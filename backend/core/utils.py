import requests
from django.conf import settings

def send_infobip_sms(phone_number: str, message_text: str) -> bool:
    """
    Sends an SMS using the Infobip REST API directly.
    Returns True for success, False for failure.
    """

    # 1. Check for all necessary credentials
    if not all([settings.INFOBIP_BASE_URL, settings.INFOBIP_API_KEY, settings.INFOBIP_SENDER_ID]):
        print("ERROR: Infobip credentials are not fully configured in settings.py.")
        return False

    # 2. Format the phone number correctly
    phone_number = phone_number.lstrip('+').strip()  # Clean up the number first
    
    if phone_number.startswith('977'):
        # If it already has the country code, just add the '+'
        formatted_number = f"+{phone_number}"
    elif phone_number.startswith('0'):
        # If it starts with 0, remove it and add the full prefix
        formatted_number = f"+977{phone_number[1:]}"
    else:
        # Otherwise, assume it's a local number and add the full prefix
        formatted_number = f"+977{phone_number}"

    print(f"DEBUG: Original number: {phone_number}, Formatted: {formatted_number}")

    # 3. Construct the full API endpoint URL
    api_url = f"https://{settings.INFOBIP_BASE_URL}/sms/2/text/advanced"

    # 4. Set up the request headers for authentication
    headers = {
        'Authorization': f'App {settings.INFOBIP_API_KEY}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    # 5. Create the JSON payload with the message details - USE FORMATTED NUMBER!
    payload = {
        "messages": [
            {
                "destinations": [{"to": formatted_number}],  # Fixed: Use formatted_number
                "from": settings.INFOBIP_SENDER_ID,
                "text": message_text
            }
        ]
    }

    # 6. Send the POST request to the Infobip API
    try:
        response = requests.post(api_url, json=payload, headers=headers)
        
        # 7. Check the response from the server
        if response.status_code == 200:
            response_data = response.json()
            print(f"SUCCESS: SMS sent via Infobip API to {formatted_number}.")
            print(f"Response: {response_data}")
            return True
        else:
            # Print a detailed error message if something went wrong
            print(f"FAILED: Infobip API returned status code {response.status_code}.")
            try:
                error_response = response.json()
                print(f"Response Body: {error_response}")
            except:
                print(f"Response Text: {response.text}")
            return False

    except requests.exceptions.RequestException as e:
        # Handle network-level errors (e.g., cannot connect)
        print(f"FAILED: A network error occurred while contacting Infobip. Error: {e}")
        return False