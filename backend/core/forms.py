from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User

class CustomUserCreationForm(UserCreationForm):
    """
    Debug version with verbose error handling
    """
    
    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "temporary_address",
            "permanent_address",
            "role",
        )
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.fields['email'].required = True
        
        
        print("=== FORM FIELDS ===")
        for field_name in self.fields:
            print(f"Field: {field_name}")
    
    def clean_username(self):
        username = self.cleaned_data.get('username')
        print(f"=== CLEANING USERNAME: '{username}' ===")
        
        if not username:
            raise forms.ValidationError("Username is required.")
        
        if len(username) > 150:
            raise forms.ValidationError("Username must be 150 characters or fewer.")
        
        
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("A user with this username already exists.")
        
        return username
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        print(f"=== CLEANING EMAIL: '{email}' ===")
        
        if not email:
            raise forms.ValidationError("Email is required.")
        
        
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("A user with this email already exists.")
        
        return email
    
    def clean(self):
        cleaned_data = super().clean()
        print("=== FORM CLEAN METHOD ===")
        print(f"Cleaned data: {cleaned_data}")
        
        
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        
        print(f"Password1: {password1}")
        print(f"Password2: {password2}")
        
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match.")
        
        return cleaned_data
    
    def save(self, commit=True):
        print("=== FORM SAVE METHOD ===")
        user = super().save(commit=False)
        print(f"User object: {user}")
        print(f"User username: {user.username}")
        print(f"User email: {user.email}")
        
        if commit:
            user.save()
        return user

class CustomUserChangeForm(UserChangeForm):
    """
    Form for editing users
    """
    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "temporary_address",
            "permanent_address",
            "role",
            "is_active",
            "is_staff",
            "is_superuser",
            "groups",
            "user_permissions",
        )