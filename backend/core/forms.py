from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User

class CustomUserCreationForm(UserCreationForm):
    """
    A form for creating new users. It includes all the fields required
    for our custom sign-up process.
    """
    class Meta(UserCreationForm.Meta):
        # We start with the base settings but specify our own model and fields.
        model = User
        # These are the fields that will appear on the "Add user" page in the admin.
        fields = (
            'username', 
            'first_name', 
            'last_name', 
            'email', 
            'phone_number', 
            'role', 
            'temporary_address', 
            'permanent_address'
        )

class CustomUserChangeForm(UserChangeForm):
    """
    A form for updating existing users in the admin panel.
    """
    class Meta:
        model = User
        # These are the fields that will appear on the "Change user" page.
        fields = (
            'username', 
            'first_name', 
            'last_name', 
            'email', 
            'phone_number',
            'role',
            'temporary_address', 
            'permanent_address',
            'is_active', 
            'is_staff'
        )