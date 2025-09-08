

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
from io import BytesIO
from django.core.files import File
import qrcode
from datetime import time, date
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.validators import RegexValidator



class User(AbstractUser):
    
    ROLE_CHOICES = (
        ('patient', 'Patient'), 
        ('doctor', 'Doctor'), 
        ('admin', 'Admin')
    )

    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    )
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)

    email = models.EmailField('email address', unique=True)
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone_number_validator = RegexValidator(
        regex=r'^\d{10}$', 
        message="Phone number must be exactly 10 digits."
    )
    phone_number = models.CharField(
        max_length=15, 
        blank=True, 
        null=True,
        validators=[phone_number_validator] 
    )
    temporary_address = models.CharField(max_length=255, blank=True, null=True)
    permanent_address = models.CharField(max_length=255, blank=True, null=True)

    image = models.ImageField(upload_to='user_profiles/', null=True, blank=True)



    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"

class Doctor(models.Model):

    BUILDING_CHOICES = (
        ('Building 1', 'Building 1'),
        ('Building 2', 'Building 2'),
        ('Building 3', 'Building 3'),
        ('Hospital Pharmacy', 'Hospital Pharmacy'),
        
    )
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        limit_choices_to={'role': 'doctor'}
    )
    appointment_fee = models.DecimalField(max_digits=8, decimal_places=2, default=500.00)
    specialization = models.CharField(max_length=100)
    available_from = models.TimeField(default=time(9, 0))  
    available_to = models.TimeField(default=time(17, 0))   
    image = models.ImageField(upload_to='doctors/', null=True, blank=True)
    building = models.CharField(max_length=50, choices=BUILDING_CHOICES, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    qualification = models.CharField(max_length=255, blank=True, help_text="e.g., MD, MBBS, PhD")
    experience_years = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)]
    )

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
        ('no_show', 'No-Show'), 
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
    
    morning_reminder_sent = models.BooleanField(default=False)
    thirty_min_reminder_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    doctor_notes = models.TextField(blank=True, null=True)

    
    class Meta:
        
        ordering = ['date', 'time']

    

    def clean(self):
        
        
        if self.pk is None:
            
            if self.date < date.today():
                raise ValidationError("Cannot book appointments in the past.")
        
            if self.date == date.today() and self.time < timezone.now().time():
                current_time = timezone.now().time()
                raise ValidationError(
                    f"Cannot book appointments in the past. "
                    f"Current time: {current_time.strftime('%H:%M')}, "
                    f"Requested time: {self.time.strftime('%H:%M')}"
                    )

            
            existing_appointment_on_day = Appointment.objects.filter(
                patient=self.patient,
                doctor=self.doctor,
                date=self.date,
                status__in=['scheduled', 'completed']
            )
            if existing_appointment_on_day.exists():
                raise ValidationError(
                    f"You already have an appointment scheduled with Dr. {self.doctor.user.get_full_name()} on {self.date.strftime('%B %d, %Y')}. "
                    "A patient can only have one appointment per doctor per day."
                )

            
            patient_time_conflicts = Appointment.objects.filter(
                patient=self.patient,
                date=self.date,
                time=self.time,
                status__in=['scheduled', 'completed']
            ).exclude(pk=self.pk)
            if patient_time_conflicts.exists():
                conflicting_appointment = patient_time_conflicts.first()
                raise ValidationError(
                    f"You already have an appointment scheduled at {self.time.strftime('%I:%M %p')} "
                    f"on {self.date.strftime('%B %d, %Y')} with Dr. {conflicting_appointment.doctor.user.get_full_name()}. "
                    f"Please choose a different time slot."
                )
                
            
            active_statuses = ['scheduled', 'completed']
            if Appointment.objects.filter(
                doctor=self.doctor, 
                date=self.date, 
                time=self.time,
                status__in=active_statuses
            ).exclude(pk=self.pk).exists():
                raise ValidationError("This doctor is already booked for this time slot.")
            
            
            if not (self.doctor.available_from <= self.time <= self.doctor.available_to):
                raise ValidationError(
                    f"Appointment time is outside of Dr. {self.doctor.user.first_name}'s "
                    f"available hours ({self.doctor.available_from} - {self.doctor.available_to})."
                )
            
            
            if not self.doctor.is_active:
                raise ValidationError("This doctor is currently not available for appointments.")
            
        

    def save(self, *args, **kwargs):
        
        
        if self.pk is None:
            self.clean()

        
        is_new = self.pk is None 
        super().save(*args, **kwargs)
        
        
        if is_new and not self.qr_code:
            self.generate_qr_code()

    def generate_qr_code(self):
        """
            Generates a QR code containing ONLY the appointment's ID and saves it.
        """
        
        qr_data = str(self.pk)
        
        
        qr = qrcode.QRCode(
            version=1,  
            error_correction=qrcode.constants.ERROR_CORRECT_L, 
            box_size=10, 
            border=4,   
        )
        
        
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        
        qr_image = qr.make_image(fill_color="black", back_color="white")
        
        
        buffer = BytesIO()
        qr_image.save(buffer, format='PNG')
        file_name = f'qr_{self.pk}.png'
        
        
        
        self.qr_code.save(file_name, File(buffer), save=False)
        
        
        
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