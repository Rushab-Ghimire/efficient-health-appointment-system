# core/management/commands/send_reminders.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.timezone import localtime
from datetime import timedelta
from core.models import Appointment
from core.utils import send_infobip_sms


class Command(BaseCommand):
    help = 'Sends SMS reminders: morning (7-8 AM Nepal time) and 30 minutes before appointments.'

    def handle(self, *args, **options):
        now = localtime(timezone.now())
        today = now.date()
        current_time = now.time()

        self.stdout.write(f"[{now}] Running reminder check...")

        # ==== MORNING REMINDERS (7:00 AM - 8:59 AM local time) ====
        if 7 <= now.hour <= 8:
            morning_appointments = Appointment.objects.filter(
                date=today,
                morning_reminder_sent=False,
                status='scheduled'
            )

            count = morning_appointments.count()
            self.stdout.write(f"Found {count} appointments needing morning reminders")

            for appt in morning_appointments:
                message = (f"Good morning {appt.patient.first_name}! "
                           f"You have an appointment with Dr. {appt.doctor.user.first_name} "
                           f"today at {appt.time.strftime('%I:%M %p')}. "
                           f"Please arrive 15 minutes early. Thank you!")

                if appt.patient.phone_number and send_infobip_sms(appt.patient.phone_number, message):
                    appt.morning_reminder_sent = True
                    appt.save()
                    self.stdout.write(
                        f"[OK] Sent morning reminder to {appt.patient.first_name} "
                        f"({appt.patient.phone_number}) for {appt.time.strftime('%I:%M %p')}"
                    )
                else:
                    self.stdout.write(
                        f"[FAIL] Could not send morning reminder to {appt.patient.first_name}"
                    )
        else:
            self.stdout.write(f"Outside morning reminder hours (7-8 AM). Current time: {current_time}")

        # ==== 30-MINUTE REMINDERS ====
        time_20_mins = (now + timedelta(minutes=20)).time()
        time_30_mins = (now + timedelta(minutes=30)).time()

        if time_20_mins <= time_30_mins:
            thirty_min_appointments = Appointment.objects.filter(
                date=today,
                time__gte=time_20_mins,
                time__lte=time_30_mins,
                thirty_min_reminder_sent=False,
                status='scheduled'
            )
        else:
            from django.db.models import Q
            thirty_min_appointments = Appointment.objects.filter(
                date=today,
                thirty_min_reminder_sent=False,
                status='scheduled'
            ).filter(
                Q(time__gte=time_20_mins) | Q(time__lte=time_30_mins)
            )

        count = thirty_min_appointments.count()
        self.stdout.write(f"Found {count} appointments needing 30-minute reminders")

        for appt in thirty_min_appointments:
            message = (f"Reminder: Your appointment with Dr. {appt.doctor.user.first_name} "
                       f"is in about 30 minutes at {appt.time.strftime('%I:%M %p')}. "
                       f"See you soon!")

            if appt.patient.phone_number and send_infobip_sms(appt.patient.phone_number, message):
                appt.thirty_min_reminder_sent = True
                appt.save()
                self.stdout.write(
                    f"[OK] Sent 30-min reminder to {appt.patient.first_name} "
                    f"({appt.patient.phone_number}) for {appt.time.strftime('%I:%M %p')}"
                )
            else:
                self.stdout.write(
                    f"[FAIL] Could not send 30-min reminder to {appt.patient.first_name}"
                )

        self.stdout.write("Reminder check finished.")
