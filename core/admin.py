# core/admin.py

from django.contrib import admin
from django.utils.html import format_html
from .models import User, Doctor, Appointment

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name')

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'available_from', 'available_to')
    search_fields = ('user__username', 'specialization')

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