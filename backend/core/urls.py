# core/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, DoctorViewSet, AppointmentViewSet,
    get_current_user, recommend_doctor_ai, view_appointment_receipt, create_user_session, get_booked_slots, DoctorDashboardDataView, DoctorPatientsView, TopRatedDoctorsView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'doctors', DoctorViewSet, basename='doctor')
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('users/me/', get_current_user, name='current-user'),
    path('recommend-doctor-ai/', recommend_doctor_ai, name='recommend-doctor-ai'),
    path('receipt/<int:appointment_id>/', view_appointment_receipt, name='view_receipt'),
    path('auth/create-session/', create_user_session, name='create-session'),
    path('booked-slots/', get_booked_slots, name='get-booked-slots'),
    path('doctor/dashboard-data/', DoctorDashboardDataView.as_view(), name='doctor-dashboard-data'),
    path('doctor/patients/', DoctorPatientsView.as_view(), name='doctor-patients'),
    path('doctors/top-rated/', TopRatedDoctorsView.as_view(), name='top-rated-doctors'),


    path('', include(router.urls)),
]