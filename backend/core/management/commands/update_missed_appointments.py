
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import Q
from core.models import Appointment
from core.utils import send_infobip_sms
import datetime

class Command(BaseCommand):
    help = 'Scans for past, scheduled appointments and marks them as "No-Show".'

    def add_arguments(self, parser):
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
        script_start_time = timezone.now()
        grace_period = options['grace_period']
        dry_run = options['dry_run']
        notify_doctors = options['notify_doctors']
        
        now_naive = datetime.datetime.now()
        cutoff_time_naive = now_naive - datetime.timedelta(minutes=grace_period)
        
        self.stdout.write(f"[{script_start_time.strftime('%Y-%m-%d %H:%M:%S')}] Running job to update missed appointments...")
        self.stdout.write(f"Comparing against naive cutoff time: {cutoff_time_naive.strftime('%Y-%m-%d %H:%M:%S')}")
        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN MODE - No changes will be made"))

        missed_appointments = Appointment.objects.filter(
            Q(status='scheduled') & (
                Q(date__lt=cutoff_time_naive.date()) |
                Q(date=cutoff_time_naive.date(), time__lt=cutoff_time_naive.time())
            )
        ).distinct()
        
        count = missed_appointments.count()

        if count == 0:
            self.stdout.write(self.style.SUCCESS("No missed appointments to update. All good!"))
            return

        self.stdout.write(f"Found {count} appointments to be marked as no-show:")
        for appt in missed_appointments:
            self.stdout.write(f"  - ID {appt.id}: {appt.patient.get_full_name()} with Dr. {appt.doctor.user.get_full_name()} on {appt.date} at {appt.time}")

        if dry_run:
            self.stdout.write(f"DRY RUN: Would update {count} appointments.")
            return

        self.stdout.write(f"Updating {count} appointments now...")

        appointments_data_for_notif = []
        if notify_doctors:
            appointments_data_for_notif = list(missed_appointments) 

        rows_updated = missed_appointments.update(status='no_show')
        
        self.stdout.write(self.style.SUCCESS(f"Successfully updated {rows_updated} appointments to 'No-Show' status."))

        if notify_doctors and appointments_data_for_notif:
            self.send_doctor_notifications(appointments_data_for_notif)

        self.log_no_show_updates(appointments_data_for_notif, rows_updated)

    def send_doctor_notifications(self, appointments_list):
        """Send SMS notifications to doctors about no-show patients."""
        self.stdout.write("Sending no-show notifications to doctors...")
        
        doctor_appointments = {}
        for appt in appointments_list:
            doctor_phone = appt.doctor.user.phone_number
            if doctor_phone:
                if doctor_phone not in doctor_appointments:
                    doctor_appointments[doctor_phone] = []
                doctor_appointments[doctor_phone].append(appt)
        
        for doctor_phone, appts in doctor_appointments.items():
            try:
                if len(appts) == 1:
                    appt = appts[0]
                    message = f"No-show alert: {appt.patient.get_full_name()} missed their appointment on {appt.date} at {appt.time.strftime('%I:%M %p')}."
                else:
                    patient_names = [a.patient.get_full_name() for a in appts]
                    message = f"No-show alert: {len(appts)} patients missed appointments today: {', '.join(patient_names[:3])}{'...' if len(appts) > 3 else ''}"
                
                if send_infobip_sms(doctor_phone, message):
                    self.stdout.write(f"✓ Notified doctor at {doctor_phone}")
                else:
                    self.stdout.write(f"✗ Failed to notify doctor at {doctor_phone}")
            except Exception as e:
                self.stdout.write(f"✗ Error sending notification to {doctor_phone}: {e}")

    def log_no_show_updates(self, appointments_list, count):
        """Log no-show updates for audit purposes."""
        try:
            log_file = 'django_noshow_updates.log' 
            with open(log_file, 'a') as f:
                timestamp = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
                f.write(f"[{timestamp}] Updated {count} appointments to no-show status\n")
                for appt in appointments_list:
                    f.write(f"  - Appointment ID {appt.id}: {appt.patient.get_full_name()}\n")
        except Exception as e:
            self.stdout.write(f"Warning: Could not write to log file: {e}")