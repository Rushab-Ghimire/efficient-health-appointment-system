# core/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import User, Doctor, Appointment
from .serializers import UserSerializer, DoctorSerializer, AppointmentSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # For production, you would add permissions here, e.g., IsAdminUser
    # permission_classes = [permissions.IsAdminUser]

class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A read-only viewset for listing doctors. This is secure by default.
    """
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated] # Anyone logged in can see doctors

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filters appointments to ensure users only see their own data.
        """
        user = self.request.user
        if user.is_staff: # Admins see everything
            return Appointment.objects.all()
        if user.role == 'doctor':
            return Appointment.objects.filter(doctor__user=user)
        if user.role == 'patient':
            return Appointment.objects.filter(patient=user)
        return Appointment.objects.none() # Should not be reached

    def perform_create(self, serializer):
        """
        Automatically sets the logged-in user as the patient for a new appointment.
        """
        # Ensure only users with the 'patient' role can create an appointment.
        if self.request.user.role != 'patient':
            raise PermissionDenied("Only patients are allowed to book appointments.")
            
        # This is the standard, correct way to inject the user.
        # It passes the user object directly to the serializer's create/update method.
        serializer.save(patient=self.request.user)
        
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """
        An admin/doctor action to mark an appointment as verified.
        """
        appointment = self.get_object()
        
        # A more secure check: only admins or the specific doctor of this appointment can verify.
        is_correct_doctor = (request.user.role == 'doctor' and appointment.doctor.user == request.user)
        if not (request.user.is_staff or is_correct_doctor):
             return Response(
                 {'error': 'You do not have permission to verify this appointment.'}, 
                 status=status.HTTP_403_FORBIDDEN
             )
        
        appointment.is_verified = True
        # Using update_fields is more efficient as it only updates one column in the DB.
        appointment.save(update_fields=['is_verified'])
        return Response({'status': 'Appointment verified successfully.'})