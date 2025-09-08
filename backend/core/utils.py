import requests
from django.conf import settings

def send_infobip_sms(phone_number: str, message_text: str) -> bool:
    """
    Sends an SMS using the Infobip REST API directly.
    Returns True for success, False for failure.
    """

    
    if not all([settings.INFOBIP_BASE_URL, settings.INFOBIP_API_KEY, settings.INFOBIP_SENDER_ID]):
        print("ERROR: Infobip credentials are not fully configured in settings.py.")
        return False

    
    phone_number = phone_number.lstrip('+').strip()  
    
    if phone_number.startswith('977'):
        
        formatted_number = f"+{phone_number}"
    elif phone_number.startswith('0'):
        
        formatted_number = f"+977{phone_number[1:]}"
    else:
        
        formatted_number = f"+977{phone_number}"

    print(f"DEBUG: Original number: {phone_number}, Formatted: {formatted_number}")

    
    api_url = f"https://{settings.INFOBIP_BASE_URL}/sms/2/text/advanced"

    
    headers = {
        'Authorization': f'App {settings.INFOBIP_API_KEY}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    
    payload = {
        "messages": [
            {
                "destinations": [{"to": formatted_number}],  
                "from": settings.INFOBIP_SENDER_ID,
                "text": message_text
            }
        ]
    }

    
    try:
        response = requests.post(api_url, json=payload, headers=headers)
        
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"SUCCESS: SMS sent via Infobip API to {formatted_number}.")
            print(f"Response: {response_data}")
            return True
        else:
            
            print(f"FAILED: Infobip API returned status code {response.status_code}.")
            try:
                error_response = response.json()
                print(f"Response Body: {error_response}")
            except:
                print(f"Response Text: {response.text}")
            return False

    except requests.exceptions.RequestException as e:
        
        print(f"FAILED: A network error occurred while contacting Infobip. Error: {e}")
        return False