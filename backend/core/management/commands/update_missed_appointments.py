from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import Appointment
import datetime

class Command(BaseCommand):
    # A brief description of what this command does, which will show up when you type `python manage.py help`
    help = 'Scans for past, scheduled appointments and marks them as "No-Show".'

    def handle(self, *args, **options):
        # Get the current time. It's important to use timezone.now() to handle timezones correctly.
        now = timezone.now()
        
        self.stdout.write(f"[{now.strftime('%Y-%m-%d %H:%M:%S')}] Running job to update missed appointments...")

        # --- The Core Logic ---
        # We want to find appointments that meet ALL of these conditions:
        # 1. Their status is still 'scheduled'.
        # 2. Their date is in the past.
        #    OR
        #    Their date is today, but their time has already passed.
        
        # We can find appointments where the datetime is less than the current datetime.
        # For this, we need to combine the date and time fields.
        # This is a bit advanced, but let's find them directly.

        appointments_to_update = Appointment.objects.filter(
            status='scheduled',
            date__lt=now.date()  # Find all appointments with a date before today
        )
        
        # Also find appointments for today where the time has passed
        appointments_today_to_update = Appointment.objects.filter(
            status='scheduled',
            date=now.date(),
            time__lt=now.time()
        )

        # Combine the querysets
        missed_appointments = appointments_to_update | appointments_today_to_update
        
        # A more efficient way to get the count without loading all objects into memory
        count = missed_appointments.count()

        if count == 0:
            self.stdout.write(self.style.SUCCESS("No missed appointments to update. All good!"))
            return

        self.stdout.write(f"Found {count} appointments to mark as 'No-Show'. Updating now...")

        # Loop through the found appointments and update their status.
        # The .update() method is very efficient as it does it in a single database query.
        rows_updated = missed_appointments.update(status='no_show')
        
        self.stdout.write(self.style.SUCCESS(f"Successfully updated {rows_updated} appointments to 'No-Show' status."))