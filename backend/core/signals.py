

from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from .models import User, Doctor, Appointment 


from .utils import send_infobip_sms
from .pinecone_utils import upsert_doctor, delete_doctor





@receiver(post_save, sender=Appointment)
def send_appointment_confirmation_sms(sender, instance: Appointment, created: bool, **kwargs):
   
    if created:
        patient = instance.patient
        if patient.phone_number:
            message = (
                f"Dear {patient.first_name}, your appointment with Dr. {instance.doctor.user.get_full_name()} "
                f"is confirmed for {instance.date} at {instance.time.strftime('%I:%M %p')}."
            )
          
            send_infobip_sms(patient.phone_number, message)


@receiver(pre_save, sender=Appointment)
def handle_cancellation_notification(sender, instance: Appointment, **kwargs):
    """
    Checks if an appointment status is changing from 'scheduled' to 'cancelled'
    and triggers a notification.
    """
    if instance.pk: 
        try:
            old_instance = Appointment.objects.get(pk=instance.pk)
            
            if old_instance.status == 'scheduled' and instance.status == 'cancelled':
                doctor_email = instance.doctor.user.email
                patient_name = instance.patient.get_full_name()
                
                print(f"NOTIFICATION LOGIC: Sending email to {doctor_email} that {patient_name} has cancelled their appointment for {instance.date} at {instance.time}.")
        except Appointment.DoesNotExist:
            pass 





@receiver(post_save, sender=User)
def create_doctor_profile_on_user_creation(sender, instance: User, created: bool, **kwargs):
    """
    Listens for a new User being created. If their role is 'doctor',
    it automatically creates an associated Doctor profile.
    """
    if created and instance.role == 'doctor':
        Doctor.objects.create(user=instance)
        
        print(f"Doctor profile automatically created for user: {instance.email}")





@receiver(post_save, sender=Doctor)
def doctor_post_save_handler(sender, instance: Doctor, **kwargs):
    """
    This signal is triggered whenever a Doctor instance is created or updated.
    It calls a utility function to add/update the doctor's data in Pinecone.
    This also handles deactivation by deleting the vector if is_active=False.
    """
    print(f"Pinecone Sync: post_save signal triggered for Doctor ID: {instance.id}")
    upsert_doctor(instance.id)


@receiver(post_delete, sender=Doctor)
def doctor_post_delete_handler(sender, instance: Doctor, **kwargs):
    """
    This signal is triggered whenever a Doctor instance is deleted from the database.
    It calls a utility function to remove the doctor's data from Pinecone.
    """
    print(f"Pinecone Sync: post_delete signal triggered for Doctor ID: {instance.id}")
    delete_doctor(instance.id)