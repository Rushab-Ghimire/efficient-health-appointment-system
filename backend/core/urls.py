# core/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, DoctorViewSet, AppointmentViewSet, view_appointment_receipt, 
    get_current_user,custom_login_view,create_user_session, recommend_doctor_ai)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'doctors', DoctorViewSet, basename='doctor')
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/create-session/', create_user_session, name='create-session'),
    path('auth/custom-login/', custom_login_view, name='custom_login'),
     path('auth/user/', get_current_user, name='current-user'),
    path('receipt/<int:appointment_id>/', view_appointment_receipt, name='view_receipt'),
    path('recommend-doctor-ai/', recommend_doctor_ai, name='recommend-doctor-ai'),

    
]