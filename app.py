import os
import json
from flask import Flask, request, jsonify, render_template
from wellness_companion import WellnessCompanion, MOOD_LOG_FILE

app = Flask(__name__, template_folder="templates")
companion = WellnessCompanion()

# Add a utility to handle CORS if needed
@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/')
def home():
    # If templates/index.html is not found, fallback to quick welcome message
    try:
        return render_template('index.html')
    except Exception:
        return """
        <html>
            <head>
                <title>Mental Wellness Client Portal</title>
                <style>
                    body { font-family: -apple-system, sans-serif; text-align: center; padding: 50px; background-color: #f7fafc; color: #2d3748; }
                    .card { max-width: 500px; margin: auto; padding: 30px; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                    h1 { color: #4a5568; }
                    hr { border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0; }
                    .btn { display: inline-block; padding: 10px 20px; background: #5a67d8; color: white; border-radius: 6px; text-decoration: none; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>🌟 Project Friend: Flask Wellness Portal</h1>
                    <p>Welcome to the Python backend services framework companion console!</p>
                    <hr/>
                    <p>To run the complete conversational interface with custom graphs, please make sure the file <code>templates/index.html</code> is fully populated.</p>
                    <a href="/api/report" class="btn">View Current Mood logs</a>
                </div>
            </body>
        </html>
        """

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({"status": "preflight-ok"}), 200
        
    data = request.json or {}
    message = data.get('message', '')
    weather_enabled = data.get('weather_enabled', False)
    
    # Retrieve language if chosen
    language = data.get('language', 'en')
    companion.language = language
    
    if weather_enabled:
        # Default Los Angeles coordinates for simulation
        weather_str = companion.get_weather_context(34.0522, -118.2437)
        response = companion.chat_with_context(message, weather_str)
    else:
        response = companion.chat(message)
        
    return jsonify({
        "response": response,
        "sentiment": companion.analyze_sentiment(message)[0]
    })

@app.route('/api/mood', methods=['POST', 'OPTIONS'])
def log_mood():
    if request.method == 'OPTIONS':
        return jsonify({"status": "preflight-ok"}), 200
        
    data = request.json or {}
    mood = data.get('mood', 'calm')
    intensity = data.get('intensity', 5)
    
    companion.log_mood(mood, intensity)
    return jsonify({
        "status": "success",
        "logged": {
            "mood": mood,
            "intensity": intensity
        }
    })

@app.route('/api/report', methods=['GET'])
def get_report():
    logs = []
    if MOOD_LOG_FILE.exists():
        try:
            with open(MOOD_LOG_FILE, 'r', encoding="utf-8") as f:
                logs = json.load(f)
        except Exception:
            pass
    return jsonify({
        "logs": logs[-15:] # Returns up to last 15 days logs for plotting
    })

if __name__ == '__main__':
    port = int(os.environ.get("FLASK_PORT", 5000))
    print(f"🚀 Launching Python companion interface at http://0.0.0.0:{port}")
    app.run(debug=True, host="0.0.0.0", port=port)
