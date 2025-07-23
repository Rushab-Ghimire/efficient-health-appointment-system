from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import Q
from core.models import Appointment
from core.utils import send_infobip_sms  # Optional: to notify about no-shows
import datetime

class Command(BaseCommand):
    help = 'Scans for past, scheduled appointments and marks them as "No-Show".'

    def add_arguments(self, parser):
        # Optional: Add command-line arguments
        parser.add_argument(
            '--grace-period',
            type=int,
            default=15,
            help='Grace period in minutes after appointment time before marking as no-show (default: 15)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be updated without actually updating'
        )
        parser.add_argument(
            '--notify-doctors',
            action='store_true',
            help='Send SMS notifications to doctors about no-shows'
        )

    def handle(self, *args, **options):
        now = timezone.now()
        grace_period = options['grace_period']
        dry_run = options['dry_run']
        notify_doctors = options['notify_doctors']
        verbosity = options.get('verbosity', 1)
        
        # Calculate the cutoff time (current time minus grace period)
        cutoff_time = now - datetime.timedelta(minutes=grace_period)
        
        self.stdout.write(f"[{now.strftime('%Y-%m-%d %H:%M:%S')}] Running job to update missed appointments...")
        self.stdout.write(f"Grace period: {grace_period} minutes")
        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN MODE - No changes will be made"))

        # More efficient query using Q objects to combine conditions
        missed_appointments = Appointment.objects.filter(
            Q(status='scheduled') & (
                Q(date__lt=cutoff_time.date()) |  # Past dates
                Q(date=cutoff_time.date(), time__lt=cutoff_time.time())  # Today but past time + grace period
            )
        )
        
        count = missed_appointments.count()

        if count == 0:
            self.stdout.write(self.style.SUCCESS("No missed appointments to update. All good!"))
            return

        # Show details of what will be updated
        if dry_run or verbosity >= 2:
            self.stdout.write("Appointments to be marked as no-show:")
            for appt in missed_appointments:
                self.stdout.write(f"  - ID {appt.id}: {appt.patient.user.get_full_name()} with Dr. {appt.doctor.user.get_full_name()} on {appt.date} at {appt.time}")

        if dry_run:
            self.stdout.write(f"Would update {count} appointments to 'No-Show' status.")
            return

        self.stdout.write(f"Found {count} appointments to mark as 'No-Show'. Updating now...")

        # Store details before updating (for notifications)
        appointments_data = []
        if notify_doctors:
            try:
                appointments_data = list(missed_appointments.select_related('patient__user', 'doctor__user').values(
                    'id', 'patient__user__first_name', 'patient__user__last_name',
                    'doctor__user__first_name', 'doctor__phone_number',
                    'date', 'time'
                ))
            except Exception as e:
                self.stdout.write(f"Warning: Could not fetch appointment details for notifications: {e}")

        # Update appointments
        rows_updated = missed_appointments.update(status='no_show')
        
        self.stdout.write(self.style.SUCCESS(f"Successfully updated {rows_updated} appointments to 'No-Show' status."))

        # Optional: Send notifications to doctors
        if notify_doctors and appointments_data:
            self.send_doctor_notifications(appointments_data)

        # Optional: Log to a file for audit purposes
        self.log_no_show_updates(appointments_data if appointments_data else [], rows_updated)

    def send_doctor_notifications(self, appointments_data):
        """Send SMS notifications to doctors about no-show patients"""
        self.stdout.write("Sending no-show notifications to doctors...")
        
        # Group appointments by doctor to send one message per doctor
        doctor_appointments = {}
        for appt in appointments_data:
            doctor_phone = appt.get('doctor__phone_number')
            if doctor_phone and doctor_phone not in doctor_appointments:
                doctor_appointments[doctor_phone] = []
            if doctor_phone:
                doctor_appointments[doctor_phone].append(appt)
        
        for doctor_phone, appts in doctor_appointments.items():
            try:
                if len(appts) == 1:
                    appt = appts[0]
                    message = f"No-show alert: {appt['patient__user__first_name']} {appt['patient__user__last_name']} missed their appointment on {appt['date']} at {appt['time']}."
                else:
                    patient_names = [f"{a['patient__user__first_name']} {a['patient__user__last_name']}" for a in appts]
                    message = f"No-show alert: {len(appts)} patients missed appointments today: {', '.join(patient_names[:3])}{'...' if len(appts) > 3 else ''}"
                
                if send_infobip_sms(doctor_phone, message):
                    self.stdout.write(f"✓ Notified doctor at {doctor_phone}")
                else:
                    self.stdout.write(f"✗ Failed to notify doctor at {doctor_phone}")
            except Exception as e:
                self.stdout.write(f"✗ Error sending notification to {doctor_phone}: {e}")

    def log_no_show_updates(self, appointments_data, count):
        """Log no-show updates for audit purposes"""
        try:
            import os
            log_dir = os.path.dirname('/var/log/django_noshow_updates.log')
            if not os.path.exists(log_dir):
                # Use a local log file if /var/log doesn't exist (Windows)
                log_file = 'django_noshow_updates.log'
            else:
                log_file = '/var/log/django_noshow_updates.log'
                
            with open(log_file, 'a') as f:
                timestamp = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
                f.write(f"[{timestamp}] Updated {count} appointments to no-show status\n")
                for appt in appointments_data:
                    f.write(f"  - Appointment ID {appt['id']}: {appt['patient__user__first_name']} {appt['patient__user__last_name']}\n")
        except Exception as e:
            self.stdout.write(f"Warning: Could not write to log file: {e}")