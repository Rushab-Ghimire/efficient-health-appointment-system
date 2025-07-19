# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# --- IMPORT ALL YOUR FUNCTION-BASED VIEWS HERE ---
# These are the views that don't belong to a ViewSet router.
from core.views import custom_login_view

urlpatterns = [
    # 1. Admin Site
    path('admin/', admin.site.urls),
    
    # 2. Authentication Routes
    # This is the main login endpoint for your React application.
    path('auth/custom-login/', custom_login_view, name='custom_login'),
    
    # This is for the browsable API login, which is useful for testing.
    path('api-auth/', include('rest_framework.urls')),
    
    # 3. Main API Routes
    # This includes all your ViewSets (Users, Doctors, Appointments) and other
    # core API endpoints like /api/users/me/ and /api/recommend-doctor-ai/
    path('api/', include('core.urls')),
]

# 4. Media File Serving (For Development)
# This part is correct and should be kept.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)