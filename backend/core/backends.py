

from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailOrUsernameBackend(ModelBackend):
    """
    Custom authentication backend.
    Allows users to log in using their email address or username.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        
        
        
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)

        try:
            
            user = UserModel.objects.get(email__iexact=username)
        except UserModel.DoesNotExist:
            
            try:
                user = UserModel.objects.get(username__iexact=username)
            except UserModel.DoesNotExist:
                
                return None
        
        
        if user.check_password(password):
            return user
        
        return None 

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None