# core/utils.py

from django.conf import settings
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

def send_twilio_sms(phone_number: str, message: str) -> bool:
    if not phone_number.startswith('+'):
        phone_number = f"+977{phone_number.lstrip('0')}"

    try:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        message_instance = client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        print(f"Successfully sent SMS with SID: {message_instance.sid}")
        return True
    except TwilioRestException as e:
        print(f"Failed to send SMS via Twilio. Error: {e}")
        return False


