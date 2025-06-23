# core/management/commands/send_reminders.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import Appointment
from core.utils import send_twilio_sms

class Command(BaseCommand):
    help = 'Scans for appointments and sends SMS reminders.'

    def handle(self, *args, **options):
        now = timezone.now()
        today = now.date()
        self.stdout.write(f"[{now}] Running reminder check...")

        # Morning Reminder Logic (at 8:00 AM)
        if now.hour == 8 and now.minute == 0:
            morning_appointments = Appointment.objects.filter(date=today, morning_reminder_sent=False)
            for appt in morning_appointments:
                message = f"Reminder: You have an appointment with Dr. {appt.doctor.user.first_name} today at {appt.time.strftime('%I:%M %p')}."
                if send_twilio_sms(appt.patient.phone_number, message):
                    appt.morning_reminder_sent = True
                    appt.save()
                    self.stdout.write(f"Sent morning reminder for appointment ID {appt.id}")

        # 30-Minute Reminder Logic
        time_plus_30_mins = (now + timedelta(minutes=30)).time()
        thirty_min_appointments = Appointment.objects.filter(
            date=today,
            time__gte=now.time(),
            time__lte=time_plus_30_mins,
            thirty_min_reminder_sent=False
        )
        for appt in thirty_min_appointments:
            message = f"Alert: Your appointment with Dr. {appt.doctor.user.first_name} is in about 30 minutes."
            if send_twilio_sms(appt.patient.phone_number, message):
                appt.thirty_min_reminder_sent = True
                appt.save()
                self.stdout.write(f"Sent 30-minute reminder for appointment ID {appt.id}")

        self.stdout.write("Reminder check finished.")