# core/serializers.py

from rest_framework import serializers
from .models import User, Doctor, Appointment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'role', 'phone_number')

class DoctorSerializer(serializers.ModelSerializer):
    # This correctly shows the full user object inside the doctor object.
    user = UserSerializer(read_only=True)
    class Meta:
        model = Doctor
        fields = ('id', 'user', 'specialization', 'available_from', 'available_to')

class AppointmentSerializer(serializers.ModelSerializer):
    # For GET requests (reading), these will display the full nested objects.
    patient = UserSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)
    
    # --- The Improvement ---
    # For POST/PUT requests (writing), this field will accept a simple doctor ID.
    # It's more efficient and DRF handles the object fetching for you.
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), 
        source='doctor', 
        write_only=True
    )

    class Meta:
        model = Appointment
        # 'patient' is removed from the writeable fields because the view will
        # automatically inject the logged-in user. We only need the doctor_id from the client.
        fields = ('id', 'patient', 'doctor', 'date', 'time', 'is_verified', 'qr_code', 'doctor_id')
        
        # These fields should not be settable by the client API.
        read_only_fields = ('id', 'patient', 'qr_code', 'is_verified')

    def validate(self, data):
        """
        Custom validation to check for booking conflicts.
        This logic remains the same and is excellent.
        """
        # The 'source="doctor"' argument populates `data['doctor']` for us.
        doctor = data.get('doctor') 
        date = data.get('date')
        time = data.get('time')
        
        if Appointment.objects.filter(doctor=doctor, date=date, time=time).exists():
            raise serializers.ValidationError("This time slot is already booked for this doctor.")
        return data
    
    # --- NO `create()` METHOD NEEDED ---
    # Because we are now using standard DRF fields, the default `create()` method
    # provided by ModelSerializer will work perfectly. We don't need to write our own.