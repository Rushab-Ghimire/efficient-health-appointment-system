# core/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
from io import BytesIO
from django.core.files import File
import qrcode
from datetime import time, date

class User(AbstractUser):
    
    ROLE_CHOICES = (
        ('patient', 'Patient'), 
        ('doctor', 'Doctor'), 
        ('admin', 'Admin')
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    temporary_address = models.CharField(max_length=255, blank=True, null=True)
    permanent_address = models.CharField(max_length=255, blank=True, null=True)


    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"

class Doctor(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        limit_choices_to={'role': 'doctor'}
    )
    appointment_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    specialization = models.CharField(max_length=100)
    available_from = models.TimeField(default=time(9, 0))  # 9:00 AM
    available_to = models.TimeField(default=time(17, 0))   # 5:00 PM
    image = models.ImageField(upload_to='doctors/', null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def clean(self):
        if self.available_from >= self.available_to:
            raise ValidationError("Available from time must be before available to time.")

    def __str__(self):
        return f"Dr. {self.user.get_full_name()}"

class Appointment(models.Model):
    
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No-Show'), # Our new status for missed appointments
    )

    patient = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='appointments',
        limit_choices_to={'role': 'patient'}
    )
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='scheduled')
    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True, editable=False)
    # is_verified = models.BooleanField(default=False)
    morning_reminder_sent = models.BooleanField(default=False)
    thirty_min_reminder_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        #unique_together = ('doctor', 'date', 'time')
        ordering = ['date', 'time']

    def clean(self):
        if self.pk is None:
        # Prevent booking in the past
            if self.date < date.today():
                raise ValidationError("Cannot book appointments in the past.")
        
        # Prevent booking on the same day if time has passed
            if self.date == date.today() and self.time < timezone.now().time():
                raise ValidationError("Cannot book appointments in the past.")
        
        # Check for double booking
        active_statuses = ['scheduled', 'completed']
        if Appointment.objects.filter(
            doctor=self.doctor, 
            date=self.date, 
            time=self.time,
            status__in=active_statuses
        ).exclude(pk=self.pk).exists():
            raise ValidationError("This doctor is already booked for this time slot.")
        
        # Ensure the appointment is within the doctor's available hours
        if not (self.doctor.available_from <= self.time <= self.doctor.available_to):
            raise ValidationError(
                f"Appointment time is outside of Dr. {self.doctor.user.first_name}'s "
                f"available hours ({self.doctor.available_from} - {self.doctor.available_to})."
            )
        
        # Check if doctor is active
        if not self.doctor.is_active:
            raise ValidationError("This doctor is currently not available for appointments.")
        
        active_statuses = ['scheduled', 'completed']
        if Appointment.objects.filter(
            doctor=self.doctor, 
            date=self.date, 
            time=self.time,
            status__in=active_statuses 
        ).exclude(pk=self.pk).exists():
            raise ValidationError("This doctor is already booked for this time slot.")

    def save(self, *args, **kwargs):
        self.clean()
        is_new = self.pk is None 
        super().save(*args, **kwargs)
        
        # Generate QR code for new appointments
        if is_new and not self.qr_code:
            self.generate_qr_code()

    def generate_qr_code(self):
        """
            Generates a QR code containing ONLY the appointment's ID and saves it.
        """
        # The data for the QR code is just the primary key (ID) of the appointment.
        qr_data = str(self.pk)
        
        # 1. Create and configure the QRCode object.
        qr = qrcode.QRCode(
            version=1,  # Controls the size of the QR Code grid. 1 is the smallest.
            error_correction=qrcode.constants.ERROR_CORRECT_L, # Low error correction is fine for simple data.
            box_size=10, # How many pixels each "box" of the QR code is.
            border=4,   # How many boxes thick the border should be.
        )
        
        # 2. Add the data to the QR Code.
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        # 3. Create an image from the QR Code instance.
        qr_image = qr.make_image(fill_color="black", back_color="white")
        
        # 4. Save the image to an in-memory buffer.
        buffer = BytesIO()
        qr_image.save(buffer, format='PNG')
        file_name = f'qr_{self.pk}.png'
        
        # 5. Save the buffer content to the ImageField.
        # 'save=False' prevents this from triggering another model save right away.
        self.qr_code.save(file_name, File(buffer), save=False)
        
        # 6. Explicitly save just the 'qr_code' field to the database.
        # This avoids a recursive loop where save() calls generate_qr_code() which calls save().
        super().save(update_fields=['qr_code'])

    def __str__(self):
        return f"Appointment for {self.patient.get_full_name()} with {self.doctor} on {self.date} at {self.time}"

    @property
    def is_past(self):
        """Check if the appointment is in the past"""
        return (self.date < date.today() or 
                (self.date == date.today() and self.time < timezone.now().time()))

    @property
    def is_today(self):
        """Check if the appointment is today"""
        return self.date == date.today()

    @property
    def is_upcoming(self):
        """Check if the appointment is upcoming"""
        return not self.is_past
    
    @property
    def is_cancellable(self):
        """
        Determines if an appointment can be cancelled.
        An appointment is cancellable if it is in the future and not already
        completed, cancelled, or marked as a no-show.
        """
        if self.is_past:
            return False
        
        return self.status == 'scheduled'