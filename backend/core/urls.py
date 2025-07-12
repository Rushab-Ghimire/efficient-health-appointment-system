# core/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, DoctorViewSet, AppointmentViewSet, view_appointment_receipt

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'doctors', DoctorViewSet, basename='doctor')


# We explicitly tell the router to use 'appointment' as the base name for the URL.
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', include(router.urls)),
    path('receipt/<int:appointment_id>/', view_appointment_receipt, name='view_receipt'),
    
]