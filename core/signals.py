# core/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Appointment
from .utils import send_twilio_sms

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