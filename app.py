from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests
import re


load_dotenv()


app = Flask(__name__, 
    static_folder='.',
    static_url_path='',
    template_folder='.'
)


CORS(app, resources={
    r"/*": {
        "origins": "*",  
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": False
    }
})


GOOGLE_API_KEY = " "
API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent"
headers = {
    "Content-Type": "application/json"
}

# Conversation patterns and responses
GREETINGS = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"]
NAME_PATTERNS = [
    r"my name is (\w+)",
    r"i am (\w+)",
    r"i'm (\w+)",
    r"call me (\w+)"
]

def get_contextual_prompt(message, session_id):
    """Generate a contextual prompt based on the message and conversation history."""
    message = message.lower().strip()
    
    # Check for greetings
    if any(greeting in message for greeting in GREETINGS):
        return "Assistant: Hello! I'm here to support your mental wellness journey. How are you feeling today? You can share your thoughts, feelings, or any concerns you might have."
    
    # Check for name introductions
    for pattern in NAME_PATTERNS:
        match = re.search(pattern, message)
        if match:
            name = match.group(1)
            return f"Assistant: Nice to meet you, {name}! I'm here to support you. How are you feeling today? You can share your thoughts, feelings, or any concerns you might have."
    
    # Default prompt for other messages
    return f"User: {message}\nAssistant: I understand. Let me help you with that. "

@app.route('/')
def serve_index():
    return render_template('index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    try:
        if not GOOGLE_API_KEY:
            return jsonify({
                'error': 'Google API key is not configured',
                'status': 'error'
            }), 500

        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data received', 'status': 'error'}), 400

        message = data.get('message')
        session_id = data.get('session_id')

        if not message:
            return jsonify({'error': 'Message is required', 'status': 'error'}), 400

        # Get contextual prompt
        prompt = get_contextual_prompt(message, session_id)

        # Prepare the payload for Google API
        payload = {
            "prompt": {
                "text": prompt
            },
            "temperature": 0.8,
            "top_p": 0.9,
            "do_sample": True,
            "repetition_penalty": 1.2
        }

        # Make request to Google API
        response = requests.post(API_URL, headers=headers, json=payload)
        
        if response.status_code == 401:
            return jsonify({
                'error': 'Invalid Google API key',
                'status': 'error'
            }), 500

        response.raise_for_status()

        # Extract the response text
        result = response.json()
        if isinstance(result, list) and len(result) > 0:
            generated_text = result[0].get('text', '')
            # Extract only the assistant's response
            bot_response = generated_text.split('Assistant:')[-1].strip()
            if not bot_response:
                bot_response = 'I understand. How can I help you further?'
        else:
            bot_response = 'I understand. How can I help you further?'

        return jsonify({
            'response': bot_response,
            'session_id': session_id,
            'status': 'success'
        })

    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': f'Error connecting to Google API: {str(e)}',
            'status': 'error'
        }), 500
    except Exception as e:
        return jsonify({
            'error': f'An unexpected error occurred: {str(e)}',
            'status': 'error'
        }), 500

if __name__ == '__main__':
    print("Starting server on port 5000")
    print("Server is ready to accept connections")
    print("Access the application at: http://localhost:5000")
    if not GOOGLE_API_KEY:
        print("Warning: GOOGLE_API_KEY not found in .env file")
    app.run(host='0.0.0.0', port=5000, debug=True) 
