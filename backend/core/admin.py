# core/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin # Import the base UserAdmin
from django.utils.html import format_html
from .models import User, Doctor, Appointment
from .forms import CustomUserCreationForm, CustomUserChangeForm

# =============================================================================
# User Admin Configuration
# =============================================================================
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    
    # We still need the model to be our custom User model
    model = User
    """
    Extends the default UserAdmin to include our custom fields.
    This method ensures all default functionality, including password management,
    is inherited correctly.
    """
    # Define the fields to display in the user list
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active', 'groups')
    
    # 'fieldsets' controls the layout on the EDIT page.
    # We define it explicitly for a clean layout.
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'phone_number')}),
        ('Address Info', {'fields': ('temporary_address', 'permanent_address')}),
        ('Permissions & Role', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    # 'add_fieldsets' controls the layout on the ADD page.
    # The fields here must match the fields defined in our CustomUserCreationForm.
    # A cleaner, optional way to organize the same fields
    add_fieldsets = (
        (None, {'fields': ('username', 'password', 'password2')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'phone_number')}),
        ('Address Info', {'fields': ('temporary_address', 'permanent_address')}),
        ('Booking Role', {'fields': ('role',)}),
        # Here is our new Permissions section
        ('Permissions', {'fields': ('is_staff',)}),
)
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)


# =============================================================================
# Doctor and Appointment Admin (These remain the same)
# =============================================================================
@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'specialization', 'appointment_fee','available_from', 'available_to')
    search_fields = ('user__username', 'specialization')
    raw_id_fields = ('user',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'date', 'time', 'status')
    list_filter = ('status', 'date', 'doctor')
    search_fields = ('patient__username', 'doctor__user__username')
    fields = ('patient', 'doctor', 'date', 'time', 'status', 'qr_code_preview')
    readonly_fields = ('qr_code_preview',)

    def qr_code_preview(self, obj):
        if obj.qr_code:
            return format_html(f'<a href="{obj.qr_code.url}" target="_blank"><img src="{obj.qr_code.url}" width="150" height="150" /></a>')
        return "(No QR Code Generated)"
    qr_code_preview.short_description = 'QR Code Preview'