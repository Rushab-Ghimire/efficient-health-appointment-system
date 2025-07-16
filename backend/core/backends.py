# core/backends.py

from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailOrUsernameBackend(ModelBackend):
    """
    Custom authentication backend.
    Allows users to log in using their email address or username.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        
        # The 'username' argument in the authenticate function can be
        # either a username or an email address.
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)

        try:
            # Try to fetch the user by treating the 'username' as an email.
            user = UserModel.objects.get(email__iexact=username)
        except UserModel.DoesNotExist:
            # If that fails, try to fetch the user by treating it as a username.
            try:
                user = UserModel.objects.get(username__iexact=username)
            except UserModel.DoesNotExist:
                # If both fail, no user exists with these credentials.
                return None
        
        # If a user was found, check their password.
        if user.check_password(password):
            return user
        
        return None # Password was incorrect.

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None