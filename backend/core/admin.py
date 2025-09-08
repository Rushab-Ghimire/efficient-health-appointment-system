# core/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.contrib import messages
from .models import User, Doctor, Appointment
from .forms import CustomUserCreationForm, CustomUserChangeForm

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'date_of_birth', 'gender', 'image')}),
        ('Custom Profile', {'fields': ('role', 'phone_number', 'temporary_address', 'permanent_address')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 
                'email', 
                'first_name', 
                'last_name', 
                'phone_number', 
                'role', 
                'temporary_address', 
                'permanent_address', 
                'password1',  
                'password2',
                'gender',
                'date_of_birth'  
            ),
        }),
    )
    
    list_display = ('username', 'email', 'first_name', 'last_name', 'gender', 'role', 'is_staff' )
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'role')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)
    
    def add_view(self, request, form_url='', extra_context=None):
        """Override add_view to debug form issues"""
        print("=== ADMIN ADD VIEW ===")
        return super().add_view(request, form_url, extra_context)
    
    def save_model(self, request, obj, form, change):
        print("=== ADMIN SAVE MODEL ===")
        print(f"Change: {change}")
        print(f"Object: {obj}")
        print(f"Form is valid: {form.is_valid()}")
        
        if not form.is_valid():
            print("=== FORM ERRORS ===")
            for field, errors in form.errors.items():
                print(f"Field '{field}': {errors}")
                for error in errors:
                    messages.error(request, f"{field}: {error}")
            
            if form.non_field_errors():
                print(f"Non-field errors: {form.non_field_errors()}")
                for error in form.non_field_errors():
                    messages.error(request, f"Error: {error}")
            
            return  
        
        print("=== SAVING USER ===")
        super().save_model(request, obj, form, change)
        messages.success(request, f"User {obj.username} saved successfully!")

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