# core/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Appointment
from .models import User, Doctor, Appointment 
from .utils import send_twilio_sms
from django.db.models.signals import pre_save


@receiver(post_save, sender=Appointment)
def send_appointment_confirmation_sms(sender, instance: Appointment, created: bool, **kwargs):
    if created:
        patient = instance.patient
        if patient.phone_number:
            message = (
                f"Dear {patient.first_name}, your appointment with Dr. {instance.doctor.user.first_name} "
                f"is confirmed for {instance.date} at {instance.time.strftime('%I:%M %p')}."
            )
            send_twilio_sms(patient.phone_number, message)


@receiver(post_save, sender=User)
def create_doctor_profile_on_user_creation(sender, instance: User, created: bool, **kwargs):
    """
    Listens for a new User being created. If their role is 'doctor',
    it automatically creates an associated Doctor profile.
    """
    # 'created' is a boolean that is True only the first time the object is saved.
    # We also check if the role is 'doctor'.
    if created and instance.role == 'doctor':
        # Create a new Doctor object, linking it to the user that was just created.
        Doctor.objects.create(user=instance)
        print(f"Doctor profile automatically created for {instance.username}")
        
@receiver(pre_save, sender=Appointment)
def handle_cancellation(sender, instance, **kwargs):
    if instance.pk: # Check if the object is already in the DB
        try:
            old_instance = Appointment.objects.get(pk=instance.pk)
            if old_instance.status == 'scheduled' and instance.status == 'cancelled':
                # This is a cancellation!
                doctor_email = instance.doctor.user.email
                # send_email(doctor_email, "Appointment Cancelled", "A patient has cancelled...")
                print(f"LOGIC: Send cancellation notification to {doctor_email}")
        except Appointment.DoesNotExist:
            pass # This is a new appointment, do nothing.
