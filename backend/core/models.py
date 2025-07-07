# core/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from io import BytesIO
from django.core.files import File
import qrcode
from django.core.exceptions import ValidationError

class User(AbstractUser):
    ROLE_CHOICES = (('patient', 'Patient'), ('doctor', 'Doctor'), ('admin', 'Admin'))
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'role': 'doctor'})
    specialization = models.CharField(max_length=100)
    available_from = models.TimeField(default=timezone.now)  
    available_to = models.TimeField(default=timezone.now)
    image = models.ImageField(upload_to='doctors/', null=True, blank=True)

    def __str__(self):
        return f"Dr. {self.user.get_full_name()}"

class Appointment(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments', limit_choices_to={'role': 'patient'})
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True, editable=False)
    is_verified = models.BooleanField(default=False)
    morning_reminder_sent = models.BooleanField(default=False)
    thirty_min_reminder_sent = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('doctor', 'date', 'time')

    def clean(self):
        # Application-level validation to prevent double booking.
        if Appointment.objects.filter(doctor=self.doctor, date=self.date, time=self.time).exclude(pk=self.pk).exists():
            raise ValidationError("This doctor is already booked for this time slot.")
        # Ensure the appointment is within the doctor's available hours
        if not (self.doctor.available_from <= self.time <= self.doctor.available_to):
            raise ValidationError(f"Appointment time is outside of Dr. {self.doctor.user.first_name}'s available hours.")

    def save(self, *args, **kwargs):
        self.clean()
        is_new = self.pk is None 
        super().save(*args, **kwargs)
        
        if is_new and not self.qr_code:
            qr_data = f"AppointmentID: {self.pk}, Patient: {self.patient.username}, Doctor: {self.doctor.user.username}, Date: {self.date}"
            qr = qrcode.make(qr_data)
            buffer = BytesIO()
            qr.save(buffer, format='PNG')
            file_name = f'qr_{self.pk}.png'
            self.qr_code.save(file_name, File(buffer), save=True)
            
    def __str__(self):
        return f"Appointment for {self.patient.username} with {self.doctor} on {self.date} at {self.time}"