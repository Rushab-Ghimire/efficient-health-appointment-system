# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from core.views import custom_login_view

urlpatterns = [
    # 1. Admin Site
    path('admin/', admin.site.urls),
    
    # 2. Authentication Routes
    path('auth/custom-login/', custom_login_view, name='custom_login'),
    
    path('api-auth/', include('rest_framework.urls')),
    
    # 3. Main API Routes
    path('api/', include('core.urls')),
]

# 4. Media File Serving (For Development)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)