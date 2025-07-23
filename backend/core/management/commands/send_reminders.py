# core/management/commands/send_reminders.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import Appointment
from core.utils import send_infobip_sms

class Command(BaseCommand):
    help = 'Sends SMS reminders: morning (7-8 AM) and 30 minutes before appointments.'
    
    def handle(self, *args, **options):
        now = timezone.now()
        today = now.date()
        current_time = now.time()
        
        self.stdout.write(f"[{now}] Running reminder check...")
        
        # ==== MORNING REMINDERS (7:00 AM - 8:59 AM) ====
        # Send morning reminders between 7 AM and 9 AM for today's appointments
        if 7 <= now.hour <= 8:
            morning_appointments = Appointment.objects.filter(
                date=today,
                morning_reminder_sent=False,
                status='scheduled'  # Only send to scheduled appointments
            )
            
            count = morning_appointments.count()
            self.stdout.write(f"Found {count} appointments needing morning reminders")
            
            for appt in morning_appointments:
                # Create a personalized morning message
                message = (f"Good morning {appt.patient.user.first_name}! "
                          f"You have an appointment with Dr. {appt.doctor.user.first_name} "
                          f"today at {appt.time.strftime('%I:%M %p')}. "
                          f"Please arrive 15 minutes early. Thank you!")
                
                if send_infobip_sms(appt.patient.phone_number, message):
                    appt.morning_reminder_sent = True
                    appt.save()
                    self.stdout.write(f"✓ Sent morning reminder to {appt.patient.user.first_name} "
                                    f"({appt.patient.phone_number}) for {appt.time.strftime('%I:%M %p')}")
                else:
                    self.stdout.write(f"✗ Failed to send morning reminder to {appt.patient.user.first_name}")
        else:
            self.stdout.write(f"Outside morning reminder hours (7-8 AM). Current time: {current_time}")

        # ==== 30-MINUTE REMINDERS ====
        # Calculate the time window for 30-minute reminders (25-35 minutes from now)
        time_25_mins = (now + timedelta(minutes=25)).time()
        time_35_mins = (now + timedelta(minutes=35)).time()
        
        # Handle the case where the time window crosses midnight
        if time_25_mins <= time_35_mins:
            # Normal case: both times are on the same day
            thirty_min_appointments = Appointment.objects.filter(
                date=today,
                time__gte=time_25_mins,
                time__lte=time_35_mins,
                thirty_min_reminder_sent=False,
                status='scheduled'
            )
        else:
            # Edge case: time window crosses midnight
            from django.db.models import Q
            thirty_min_appointments = Appointment.objects.filter(
                date=today,
                thirty_min_reminder_sent=False,
                status='scheduled'
            ).filter(
                Q(time__gte=time_25_mins) | Q(time__lte=time_35_mins)
            )
        
        count = thirty_min_appointments.count()
        self.stdout.write(f"Found {count} appointments needing 30-minute reminders")
        
        for appt in thirty_min_appointments:
            # Create a personalized 30-minute reminder message
            message = (f"Reminder: Your appointment with Dr. {appt.doctor.user.first_name} "
                      f"is in about 30 minutes at {appt.time.strftime('%I:%M %p')}. "
                      f"Please start preparing to leave now. See you soon!")
            
            if send_infobip_sms(appt.patient.phone_number, message):
                appt.thirty_min_reminder_sent = True
                appt.save()
                self.stdout.write(f"✓ Sent 30-min reminder to {appt.patient.user.first_name} "
                                f"({appt.patient.phone_number}) for {appt.time.strftime('%I:%M %p')}")
            else:
                self.stdout.write(f"✗ Failed to send 30-min reminder to {appt.patient.user.first_name}")
        
        # ==== SUMMARY ====
        total_morning = Appointment.objects.filter(date=today, morning_reminder_sent=True).count()
        total_thirty_min = Appointment.objects.filter(date=today, thirty_min_reminder_sent=True).count()
        
        self.stdout.write(f"Summary for {today}:")
        self.stdout.write(f"  - Morning reminders sent: {total_morning}")
        self.stdout.write(f"  - 30-minute reminders sent: {total_thirty_min}")
        self.stdout.write("Reminder check finished.")