# core/serializers.py

from rest_framework import serializers
from .models import User, Doctor, Appointment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # We need to include 'password' so it can be sent when creating a user.
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email', 'role', 'phone_number')
        
        # This is a crucial security setting. It ensures the password is
        # never sent back in a response (e.g., from a GET request).
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        """
        This method is called when a new user is created via the API.
        We override it to use Django's `create_user` method, which
        handles password hashing automatically.
        """
        # We use .pop() to remove the password from the data, so we can handle it separately.
        password = validated_data.pop('password', None)
        
        # Use the standard ModelSerializer create method for the other fields.
        instance = self.Meta.model(**validated_data)
        
        # If a password was provided, hash it and set it.
        if password is not None:
            instance.set_password(password)
            
        instance.save()
        return instance


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Doctor
        fields = ('id', 'user', 'specialization', 'available_from', 'available_to')

class AppointmentSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)
    
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), 
        source='doctor', 
        write_only=True
    )

    class Meta:
        model = Appointment
        fields = ('id', 'patient', 'doctor', 'date', 'time', 'is_verified', 'qr_code', 'doctor_id')
        read_only_fields = ('id', 'patient', 'qr_code', 'is_verified')

    def validate(self, data):
        doctor = data.get('doctor') 
        date = data.get('date')
        time = data.get('time')
        
        if Appointment.objects.filter(doctor=doctor, date=date, time=time).exists():
            raise serializers.ValidationError("This time slot is already booked for this doctor.")
        return data