# core/serializers.py

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from datetime import date, time
from .models import User, Doctor, Appointment
from rest_framework.validators import UniqueValidator


class UserSerializer(serializers.ModelSerializer):
    # This field is only for validating password confirmation during signup/update.
    password_confirm = serializers.CharField(write_only=True, required=False)
    image = serializers.SerializerMethodField()


    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'role', 
            'phone_number', 'temporary_address', 'permanent_address', 
            'gender', 'date_of_birth', 'image',
            'password', 'password_confirm' # Include password fields for create/update
        )
        
        # We make certain fields read-only when RETRIEVING a user,
        # but they are writeable when creating/updating.
        read_only_fields = ('role', 'image') 

        extra_kwargs = {
            'password': {'write_only': True},
            'email': {
                'validators': [
                    UniqueValidator(
                        queryset=User.objects.all(),
                        message="A user with this email already exists."
                    )
                ]
            },
            # The 'username' uniqueness is already handled by the model,
            # but we can add a validator here for a better API error message.
            'username': {
                'validators': [
                    UniqueValidator(
                        queryset=User.objects.all(),
                        message="A user with this username already exists."
                    )
                ]
            }
        }
    def get_image(self, obj):
        request = self.context.get('request')
        image_url = None

        # Prioritize the doctor-specific image if it exists
        if hasattr(obj, 'doctor') and obj.doctor.image:
            image_url = obj.doctor.image.url
        # Fall back to the user's own image
        elif obj.image:
            image_url = obj.image.url
        
        if image_url and request:
            return request.build_absolute_uri(image_url)
        
        return None

    def validate(self, data):
        """Check that the two password entries match."""
        if 'password' in data and 'password_confirm' in data:
            if data['password'] != data['password_confirm']:
                raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        """Create and return a new `User` instance, given the validated data."""
        validated_data.pop('password_confirm', None)
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """Update and return an existing `User` instance, given the validated data."""
        # Handle password update separately to ensure it's hashed.
        password = validated_data.pop('password', None)
        validated_data.pop('password_confirm', None)

        # Update all other fields from validated_data.
        # This automatically handles the image file correctly.
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)
        
        instance.save()
        return instance

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Doctor
        fields = (
            'id', 'user', 'full_name', 'specialization','appointment_fee',
            'available_from', 'available_to', 'image', 'is_active','building'
        )

    def get_full_name(self, obj):
        return obj.user.get_full_name()

    def validate(self, data):
        """Validate doctor availability hours"""
        available_from = data.get('available_from')
        available_to = data.get('available_to')
        
        if available_from and available_to:
            if available_from >= available_to:
                raise serializers.ValidationError(
                    "Available from time must be before available to time."
                )
        
        return data

class AppointmentSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)
    
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), 
        source='doctor', 
        write_only=True
    )
    
    # Add helpful computed fields
    is_past = serializers.ReadOnlyField()
    is_today = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()

    class Meta:
        model = Appointment
        fields = (
            'id', 'patient', 'doctor', 'date', 'time', 'status', 
            'qr_code', 'doctor_id', 'created_at', 'updated_at',
            'is_past', 'is_today', 'is_upcoming','doctor_notes'
        )
        read_only_fields = (
            'id', 'patient', 'qr_code', 
            'created_at', 'updated_at'
        )

    def validate_date(self, date_value):
        """Validate appointment date"""
        if date_value < date.today():
            raise serializers.ValidationError("Cannot book appointments in the past.")
        return date_value

    def validate_time(self, time_value):
        """Validate appointment time"""
        # Check if time is in valid format and reasonable hours
        if time_value < time(6, 0) or time_value > time(22, 0):
            raise serializers.ValidationError(
                "Appointment time must be between 6:00 AM and 10:00 PM."
            )
        return time_value

   # In core/serializers.py, inside the AppointmentSerializer class

# ... (keep your Meta class and validate_date/validate_time methods) ...

    def validate(self, data):
        """
        This method integrates the model's `clean()` method into the serializer's
        validation process, making it the single source of truth for business rules.
        """
        # If this is an update request just to add notes, we can skip the complex validation.
        if self.instance and 'doctor_notes' in data and len(data) == 1:
            return data

        # Create a temporary, in-memory instance of the Appointment model.
        # We start with the existing instance's data (if updating) and override
        # it with the new data from the request.
        instance = Appointment(**{**self.instance.__dict__, **data}) if self.instance else Appointment(**data)

        # The model's `clean()` method needs the patient to run its checks.
        # For new appointments, the patient is not in the `data`, so we must get it
        # from the request context that the view provides to the serializer.
        if not self.instance: # This is a new appointment being created.
            request = self.context.get("request")
            if request and hasattr(request, "user"):
                instance.patient = request.user
            else:
                # This should not happen if permissions are set up correctly.
                raise serializers.ValidationError("Authentication error: Cannot determine patient.")

        try:
            # This is the key step: run all the validation rules from your model's clean() method.
            # This will check for same-day duplicates, booking in the past, etc.
            instance.clean()
        except ValidationError as e:
            # Convert Django's ValidationError into a DRF-friendly format.
            # This ensures the front-end receives a clean JSON error response.
            raise serializers.ValidationError(e.message_dict if hasattr(e, 'message_dict') else e.messages)

        return data
class AppointmentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing appointments"""
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    specialization = serializers.SerializerMethodField()
    doctor_building = serializers.CharField(source='doctor.building', read_only=True, allow_null=True)

    is_past = serializers.ReadOnlyField()
    is_today = serializers.ReadOnlyField()

    
    class Meta:
        model = Appointment
        fields = (
            'id', 'patient_name', 'doctor_name', 'specialization',
            'date', 'time', 'status', 'is_past', 'is_today','doctor_notes','doctor_building'
        )
    
    def get_patient_name(self, obj):
        return obj.patient.get_full_name()
    
    def get_doctor_name(self, obj):
        return obj.doctor.user.get_full_name()
    
    def get_specialization(self, obj):
        return obj.doctor.specialization



class AdminUserSerializer(serializers.ModelSerializer):
    """
    A serializer for the User model intended for use by admins.
    It allows the 'role' field to be set and updated.
    """
    class Meta:
        model = User
        # Include all fields, including the role
        fields = (
            'id', 'email', 'username', 'first_name', 'last_name', 'role', 
            'phone_number', 'temporary_address', 'permanent_address', 
            'gender', 'date_of_birth', 'image', 'is_active', 'is_staff', 'is_superuser'
        )