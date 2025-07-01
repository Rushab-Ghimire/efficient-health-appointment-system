# core/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin # Import the base UserAdmin
from django.utils.html import format_html
from .models import User, Doctor, Appointment

# =============================================================================
# User Admin Configuration
# =============================================================================
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Extends the default UserAdmin to include our custom fields.
    This method ensures all default functionality, including password management,
    is inherited correctly.
    """
    # Define the fields to display in the user list
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = BaseUserAdmin.list_filter + ('role',) # Add 'role' to the existing filters
    
    # This is the key part: we add our custom fields to the existing forms (fieldsets)
    # This correctly adds a new section for 'role' and 'phone_number' on the user edit page.
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Profile Info', {'fields': ('role', 'phone_number')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Profile Info', {'fields': ('role', 'phone_number')}),
    )

# =============================================================================
# Doctor and Appointment Admin (These remain the same)
# =============================================================================
@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'specialization', 'available_from', 'available_to')
    search_fields = ('user__username', 'specialization')
    raw_id_fields = ('user',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'date', 'time', 'is_verified')
    list_filter = ('is_verified', 'date', 'doctor')
    search_fields = ('patient__username', 'doctor__user__username')
    fields = ('patient', 'doctor', 'date', 'time', 'is_verified', 'qr_code_preview')
    readonly_fields = ('qr_code_preview',)

    def qr_code_preview(self, obj):
        if obj.qr_code:
            return format_html(f'<a href="{obj.qr_code.url}" target="_blank"><img src="{obj.qr_code.url}" width="150" height="150" /></a>')
        return "(No QR Code Generated)"
    qr_code_preview.short_description = 'QR Code Preview'