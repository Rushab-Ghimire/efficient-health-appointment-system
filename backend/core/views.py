# core/views.py
from django.contrib.auth import authenticate
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import User, Doctor, Appointment
from .serializers import UserSerializer, DoctorSerializer, AppointmentSerializer, AppointmentListSerializer # Import the list serializer
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, BasePermission
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.contrib.auth import login 
from django.views.decorators.csrf import csrf_exempt 
from django.conf import settings
from rest_framework.views import APIView
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from .pinecone_utils import get_doctor_recommendations
from .models import Doctor 



class IsOwnerOrAdmin(BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Write permissions are only allowed to the owner of the object or an admin.
        # obj is the User instance being requested.
        # request.user is the user making the request (from the token).
        return obj == request.user or request.user.is_staff


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        Custom permissions for User actions.
        """
        if self.action == 'create':
            # Anyone can sign up
            self.permission_classes = [AllowAny]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Only the user themselves or an admin can edit/delete a profile
            self.permission_classes = [IsOwnerOrAdmin]
        elif self.action == 'list':
            # Only admins can see the full list of users
            self.permission_classes = [IsAdminUser]
        
        # For 'retrieve' (getting a single profile), it will use the default
        # class-level permission_classes defined above, which is [IsAuthenticated].
        # This means any logged-in user can view any profile, which is a common
        # requirement. If you want to restrict this, you could add another `elif`.

        return super().get_permissions()

class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DoctorSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
       
        # Start with the base list of all active doctors.
        queryset = Doctor.objects.filter(is_active=True)

        # Get the filter parameters from the URL (e.g., ?specialization=...)
        specialization = self.request.query_params.get('specialization', None)
        max_fee = self.request.query_params.get('max_fee', None)

        # If a specialization was provided, filter the queryset.
        # The 'iexact' makes the search case-insensitive.
        if specialization:
            queryset = queryset.filter(specialization__iexact=specialization)

        # If a max_fee was provided, filter the queryset.
        # The 'lte' means "less than or equal to".
        if max_fee:
            try:
                # We must convert the fee from a string to a number for the query.
                queryset = queryset.filter(appointment_fee__lte=float(max_fee))
            except (ValueError, TypeError):
                # If someone provides an invalid fee (e.g., "abc"), just ignore it.
                pass
        return queryset

class AppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    # This serializer is used by default for retrieve, create, update
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        """
        Filters appointments to ensure users only see their own data.
        """
        user = self.request.user
        if user.is_staff:
            return Appointment.objects.all()
        if user.role == 'doctor':
            return Appointment.objects.filter(doctor__user=user)
        if user.role == 'patient':
            return Appointment.objects.filter(patient=user)
        return Appointment.objects.none()

    def get_serializer_class(self):
        """
        Use a different serializer for the 'list' action.
        """
        if self.action == 'list':
            return AppointmentListSerializer # Use the lightweight serializer for lists
        return super().get_serializer_class() # Use the default for all other actions

    def perform_create(self, serializer):
        """
        Automatically sets the logged-in user as the patient for a new appointment.
        """
        if self.request.user.role != 'patient':
            raise PermissionDenied("Only patients are allowed to book appointments.")
        serializer.save(patient=self.request.user)
        
        
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.is_cancellable: # A simple check
            return Response({'error': 'This appointment cannot be edited.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'], url_path='complete')
    def complete_appointment(self, request, pk=None):
        """
        A custom action for a doctor or admin to mark an appointment as 'completed'.
        Accessible via: POST /api/appointments/{id}/complete/
        """
        appointment = self.get_object() # This gets the specific appointment by its ID

        # Permission Check: Who can do this?
        is_the_correct_doctor = (request.user.role == 'doctor' and appointment.doctor.user == request.user)
        is_an_admin = request.user.is_staff

        if not (is_the_correct_doctor or is_an_admin):
            return Response(
                {'error': 'You do not have permission to complete this appointment.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Logic Check: Can this appointment be completed?
        if appointment.status != 'scheduled':
            return Response(
                {'error': f"This appointment cannot be completed as its status is already '{appointment.get_status_display()}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # The Action: Update the status
        appointment.status = 'completed'
        appointment.save(update_fields=['status']) # Efficiently save only the 'status' field

        # You could trigger another signal/notification here, e.g., "Send patient feedback survey"
        
        return Response(
            {'status': 'Appointment marked as completed successfully.'},
            status=status.HTTP_200_OK
        )
        
    

    # The old 'verify' method has been removed. This is the only custom action left.
    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_appointment(self, request, pk=None):
        """
        A custom action for a patient to cancel their own appointment.
        Accessible via: POST /api/appointments/{id}/cancel/
        """
        appointment = self.get_object()

        # Permission Check: Only the patient who booked it can cancel.
        # (Admins can also cancel, but they can do it directly via PUT/PATCH requests)
        if appointment.patient != request.user:
            return Response(
                {'error': 'You do not have permission to cancel this appointment.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Logic Check: Use the handy model property we created!
        if not appointment.is_cancellable:
            return Response(
                {'error': 'This appointment can no longer be cancelled (it may be in the past or already completed).'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # The Action: Update the status
        appointment.status = 'cancelled'
        appointment.save(update_fields=['status'])

        # You could trigger a notification here to inform the doctor that their slot has opened up.

        return Response(
            {'status': 'Appointment cancelled successfully.'},
            status=status.HTTP_200_OK
        )
    
    # core/views.py -> inside AppointmentViewSet

    @action(detail=True, methods=['post'], url_path='no-show')
    def mark_as_no_show(self, request, pk=None):
        """
        A custom action for a doctor or admin to mark an appointment as a 'No-Show'.
        Accessible via: POST /api/appointments/{id}/no-show/
        """
        appointment = self.get_object()

        # Permission Check (same as completing an appointment)
        is_the_correct_doctor = (request.user.role == 'doctor' and appointment.doctor.user == request.user)
        is_an_admin = request.user.is_staff

        if not (is_the_correct_doctor or is_an_admin):
            return Response(
                {'error': 'You do not have permission to modify this appointment.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Logic Check: Can only mark past, scheduled appointments as no-shows.
        if not appointment.is_past:
             return Response(
                {'error': 'Cannot mark an upcoming appointment as a no-show.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if appointment.status != 'scheduled':
            return Response(
                {'error': f"Cannot mark this appointment as its status is '{appointment.get_status_display()}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # The Action
        appointment.status = 'no_show'
        appointment.save(update_fields=['status'])

        return Response(
            {'status': 'Appointment marked as No-Show.'},
            status=status.HTTP_200_OK
        )
    

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_login_view(request):
    login_identifier = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')

    if not login_identifier or not password:
        return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=login_identifier, password=password)

    if user is not None:
        if not user.is_active:
            return Response({'error': 'This user account is inactive.'}, status=status.HTTP_403_FORBIDDEN)
        
        token, created = Token.objects.get_or_create(user=user)
        
        # Include user details in the login response
        user_data = UserSerializer(user).data
        
        return Response({
            'token': token.key,
            'user': user_data
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    
    
@login_required
def view_appointment_receipt(request, appointment_id):
    """
    A view to display a rich HTML receipt for an appointment.
    """
    # Get the appointment, making sure it exists.
    appointment = get_object_or_404(Appointment, pk=appointment_id)

    # --- SECURITY CHECK ---
    # Ensure the logged-in user is either the patient or an admin.
    if not (request.user.is_staff or appointment.patient == request.user):
        return HttpResponse("You do not have permission to view this receipt.", status=403)

    # The context is a dictionary of data we send to the template.
    context = {
        'appointment': appointment
    }

    # Render the HTML page and return it as the response.
    return render(request, 'core/receipt_page.html', context)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # Ensures only logged-in users can access this
def get_current_user(request):
    """
    Determines the current user by their token and returns their data.
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@csrf_exempt 
@api_view(['POST'])
@permission_classes([IsAuthenticated]) # Ensures only users with a valid token can use this
def create_user_session(request):
    """
    Takes a user authenticated by a token and logs them into a
    stateful Django session. This sets the session cookie required
    for views using @login_required.
    """
    # The user is already identified by TokenAuthentication
    user = request.user

    user.backend = 'core.backends.EmailOrUsernameBackend'

    
    # Log the user into the session framework
    login(request, user)
    
    return Response({'status': 'session created'}, status=status.HTTP_200_OK)


pinecone_vectorstore = None
try:
    # Check for the necessary API keys from settings.py
    if all([settings.PINECONE_API_KEY, settings.PINECONE_ENVIRONMENT]):
        # Initialize the free, open-source embedding model
        embeddings = HuggingFaceEmbeddings(model_name="multi-qa-MiniLM-L6-cos-v1")
        
        # Connect to your existing Pinecone index
        pinecone_vectorstore = PineconeVectorStore.from_existing_index(
            index_name="health-doctors-hf",  # This MUST match the index name you created
            embedding=embeddings
        )
        print("Pinecone vector store (Hugging Face) connected successfully.")
    else:
        print("Pinecone credentials missing. AI Recommendation feature will be disabled.")
except Exception as e:
    print(f"Error connecting to Pinecone (Hugging Face): {e}. AI Recommendation feature will be disabled.")
# ---





# ========================================================================
# AI DOCTOR RECOMMENDATION ENDPOINT
# ========================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def recommend_doctor_ai(request):
    """
    AI-powered doctor recommendation endpoint.
    """
    try:
        user_query = request.data.get('issue', '').strip()
        
        if not user_query:
            return Response({'message': 'Medical issue query is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # --- This is the key change ---
        # Call the centralized utility function to get the list of recommended doctors
        recommended_doctors = get_doctor_recommendations(user_query, top_k=3, score_threshold=0.25)
        
        # Serialize the final list of doctor objects
        serializer = DoctorSerializer(recommended_doctors, many=True)
        
        return Response({'recommendations': serializer.data})
        
    except Exception as e:
        print(f"Error in recommend_doctor_ai view: {e}")
        return Response({'error': 'An internal server error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)