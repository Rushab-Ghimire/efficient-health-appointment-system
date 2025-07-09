# core/serializers.py

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from datetime import date, time
from .models import User, Doctor, Appointment

class UserSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'password', 'password_confirm', 
            'first_name', 'last_name', 'email', 'role', 'phone_number'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate_password(self, password):
        """Validate password using Django's password validators"""
        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return password

    def validate(self, data):
        """Validate password confirmation if provided"""
        if 'password_confirm' in data:
            if data['password'] != data['password_confirm']:
                raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        """Create user with hashed password"""
        # Remove password_confirm from validated_data
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password', None)
        
        instance = self.Meta.model(**validated_data)
        
        if password is not None:
            instance.set_password(password)
            
        instance.save()
        return instance

    def update(self, instance, validated_data):
        """Update user, handle password separately"""
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password', None)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Update password if provided
        if password is not None:
            instance.set_password(password)
        
        instance.save()
        return instance

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Doctor
        fields = (
            'id', 'user', 'full_name', 'specialization', 
            'available_from', 'available_to', 'image', 'is_active'
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
        queryset=Doctor.objects.filter(is_active=True), 
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
            'is_past', 'is_today', 'is_upcoming'
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

    def validate(self, data):
        """Comprehensive validation for appointments"""
        doctor = data.get('doctor')
        date_value = data.get('date')
        time_value = data.get('time')
        
        # Check if all required fields are present
        if not all([doctor, date_value, time_value]):
            raise serializers.ValidationError("Doctor, date, and time are required.")
        
        # Check for double booking
        active_statuses = ['scheduled', 'completed']
        existing_appointment = Appointment.objects.filter(
            doctor=doctor, 
            date=date_value, 
            time=time_value,
            status__in=active_statuses
        )
        
        # If updating, exclude current appointment
        if self.instance:
            existing_appointment = existing_appointment.exclude(pk=self.instance.pk)
        
        if existing_appointment.exists():
            raise serializers.ValidationError(
                "This time slot is already booked for this doctor."
            )
        
        # Check if time is within doctor's available hours
        if not (doctor.available_from <= time_value <= doctor.available_to):
            raise serializers.ValidationError(
                f"Appointment time must be between {doctor.available_from} "
                f"and {doctor.available_to} for Dr. {doctor.user.get_full_name()}."
            )
        
        # Check if doctor is active
        if not doctor.is_active:
            raise serializers.ValidationError(
                "This doctor is currently not available for appointments."
            )
        
        # Prevent booking same day appointments in the past
        if date_value == date.today():
            from django.utils import timezone
            if time_value < timezone.now().time():
                raise serializers.ValidationError(
                    "Cannot book appointments in the past."
                )
        
        return data

class AppointmentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing appointments"""
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    specialization = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = (
            'id', 'patient_name', 'doctor_name', 'specialization',
            'date', 'time', 'status', 'is_past', 'is_today'
        )
    
    def get_patient_name(self, obj):
        return obj.patient.get_full_name()
    
    def get_doctor_name(self, obj):
        return obj.doctor.user.get_full_name()
    
    def get_specialization(self, obj):
        return obj.doctor.specialization