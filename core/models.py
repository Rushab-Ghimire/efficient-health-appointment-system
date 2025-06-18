from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from io import BytesIO
from django.core.files import File
import qrcode

class User(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)
    available_from = models.TimeField(default = timezone.now)  
    available_to = models.TimeField(default = timezone.now)   


class Appointment(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
    # Save first time to generate ID (if not yet assigned)
        if not self.id:
            super().save(*args, **kwargs)

        # Now the ID exists, create QR code
        qr_data = f"AppointmentID: {self.id}, Patient: {self.patient.username}, Doctor: {self.doctor.user.username}, Date: {self.date}, Time: {self.time}"
        
        qr = qrcode.make(qr_data)
        buffer = BytesIO()
        qr.save(buffer, format='PNG')
        file_name = f'qr_{self.id}.png'

        self.qr_code.save(file_name, File(buffer), save=False)  # assign QR code without resaving to DB

        super().save(*args, **kwargs)  # final save, to store QR code path
