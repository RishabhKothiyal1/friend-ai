# 🚀 Advanced Features & Extensions

This guide shows how to extend your Mental Wellness AI Companion with additional functionality.

## Feature Ideas

### 1. Sentiment Analysis

Add emotional tone detection to track mood patterns more accurately.

```python
# Add to requirements.txt
textblob>=0.17.1

# Add to wellness_companion.py
from textblob import TextBlob

def analyze_sentiment(self, text: str):
    """Analyze emotional sentiment of user messages."""
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # -1 to 1
    subjectivity = blob.sentiment.subjectivity  # 0 to 1
    
    if polarity > 0.5:
        sentiment = "positive"
    elif polarity < -0.5:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    
    return sentiment, polarity, subjectivity
```

### 2. Journaling Integration

Add guided journaling prompts alongside conversations.

```python
JOURNAL_PROMPTS = [
    "What are three things you're grateful for today?",
    "What challenged you today, and how did you handle it?",
    "What's one thing you did well today?",
    "How did your body feel today? Any physical sensations?",
    "What's one thing you want to work on tomorrow?"
]

def offer_journaling(self):
    """Suggest a journaling prompt."""
    import random
    prompt = random.choice(JOURNAL_PROMPTS)
    print(f"\n💭 Journaling prompt: {prompt}")
    response = input("Your thoughts (or press Enter to skip): ").strip()
    if response:
        self.save_journal_entry(response)

def save_journal_entry(self, content: str):
    """Save journal entry with timestamp."""
    entry = {
        "timestamp": datetime.now().isoformat(),
        "content": content
    }
    # Save to companion_data/journal.json
```

### 3. Breathing Exercise & Mindfulness

Include guided exercises for anxiety management.

```python
import time

def guided_breathing(self):
    """Guide through a 4-7-8 breathing exercise."""
    print("\n🌬️  Let's do a calming breathing exercise together...")
    print("We'll do 5 rounds of box breathing: 4-4-4-4 seconds\n")
    
    for round in range(1, 6):
        print(f"Round {round}...")
        print("Breathe in... 4, 3, 2, 1")
        time.sleep(4)
        print("Hold... 4, 3, 2, 1")
        time.sleep(4)
        print("Breathe out... 4, 3, 2, 1")
        time.sleep(4)
        print("Hold... 4, 3, 2, 1\n")
        time.sleep(4)
    
    print("✓ Breathwork complete. How do you feel now?\n")
```

### 4. Scheduled Check-ins

Send reminder messages or check-ins at specific times.

```python
import schedule
import threading

def setup_daily_checkin(self, hour=9, minute=0):
    """Schedule daily wellness check-in."""
    def job():
        print(f"\n💙 Daily check-in: How are you feeling today?")
    
    schedule.every().day.at(f"{hour:02d}:{minute:02d}").do(job)
    
    # Run scheduler in background thread
    def run_scheduler():
        while True:
            schedule.run_pending()
            time.sleep(60)
    
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()
```

### 5. Mood Analytics & Reports

Generate insights from mood patterns.

```python
def generate_mood_report(self):
    """Create a mood trends report."""
    if not MOOD_LOG_FILE.exists():
        print("No mood data yet. Start logging moods to see patterns!")
        return
    
    with open(MOOD_LOG_FILE, 'r') as f:
        mood_log = json.load(f)
    
    # Analyze last 7 days
    recent_moods = mood_log[-7:]
    
    mood_counts = {}
    for entry in recent_moods:
        mood = entry["mood"]
        mood_counts[mood] = mood_counts.get(mood, 0) + 1
    
    print("\n📊 Mood Report (Last 7 days)")
    print("=" * 40)
    for mood, count in sorted(mood_counts.items(), key=lambda x: x[1], reverse=True):
        bar = "█" * count
        print(f"{mood.capitalize():15} {bar} ({count})")
    
    avg_intensity = sum(e["intensity"] for e in recent_moods) / len(recent_moods)
    print(f"\nAverage Intensity: {avg_intensity:.1f}/10")
```

### 6. Gratitude Practice

Build in positive psychology techniques.

```python
def gratitude_practice(self):
    """Guided gratitude exercise."""
    print("\n🙏 Gratitude Practice")
    print("Research shows gratitude improves mental wellbeing.\n")
    
    gratitudes = []
    for i in range(3):
        item = input(f"What are you grateful for? ({i+1}/3): ").strip()
        if item:
            gratitudes.append({
                "timestamp": datetime.now().isoformat(),
                "gratitude": item
            })
    
    if gratitudes:
        self.save_gratitudes(gratitudes)
        print("\n✨ Thank you for practicing gratitude!")
        
        response = self.chat(
            f"I'm grateful for these things today: {', '.join([g['gratitude'] for g in gratitudes])}. "
            "Help me appreciate these more deeply."
        )
        print(f"\nCompanion: {response}")
```

### 7. Crisis Resource Links

Display emergency contacts prominently.

```python
CRISIS_RESOURCES = {
    "US": {
        "988 Suicide & Crisis Lifeline": "988 or 1-800-273-8255",
        "Crisis Text Line": "Text HOME to 741741",
        "SAMHSA National Helpline": "1-800-662-4357"
    },
    "UK": {
        "Samaritans": "116 123",
        "Crisis Text Line": "Text SHOUT to 85258"
    },
    "INTL": {
        "International Association for Suicide Prevention": 
        "https://www.iasp.info/resources/Crisis_Centres/"
    }
}

def show_resources(self):
    """Display crisis resources."""
    print("\n🆘 Mental Health Resources")
    print("=" * 50)
    
    for region, services in CRISIS_RESOURCES.items():
        print(f"\n{region}:")
        for name, contact in services.items():
            print(f"  • {name}: {contact}")
```

### 8. Integration with External APIs

Connect to weather, meditation apps, or calendar APIs.

```python
# Integration with Open-Meteo (free weather API)
import requests

def get_weather_context(self, latitude: float, longitude: float):
    """Get weather for mood context."""
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true"
        response = requests.get(url)
        data = response.json()
        
        weather = data["current_weather"]
        return f"Current weather: {weather['temperature']}°C, {weather['weathercode']}"
    except Exception as e:
        return ""

def chat_with_context(self, user_message: str, weather: str = ""):
    """Include context like weather in conversation."""
    contextual_message = user_message
    if weather:
        contextual_message = f"{user_message}\n[Context: {weather}]"
    
    return self.chat(contextual_message)
```

### 9. Web Interface

Create a Flask-based web UI.

```python
# Create app.py
from flask import Flask, request, jsonify, render_template
from wellness_companion import WellnessCompanion

app = Flask(__name__)
companion = WellnessCompanion()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    response = companion.chat(message)
    return jsonify({"response": response})

@app.route('/api/mood', methods=['POST'])
def log_mood():
    data = request.json
    companion.log_mood(data.get('mood'), data.get('intensity', 5))
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)
```

### 10. Multi-language Support

Support conversations in different languages.

```python
def get_system_prompt_for_language(self, language: str):
    """Get localized system prompt."""
    prompts = {
        "es": "Eres un compañero amable de bienestar mental...",
        "fr": "Vous êtes un compagnon bienveillant de bien-être mental...",
        "de": "Du bist ein mitfühlender Begleiter für Wellness...",
        # Add more languages
    }
    return prompts.get(language, SYSTEM_PROMPT)
```

## Implementation Priority

1. **Easy** (1-2 hours): Sentiment analysis, gratitude practice, mood reports
2. **Medium** (2-4 hours): Journaling, breathing exercises, multi-language
3. **Advanced** (4+ hours): Web interface, scheduled check-ins, API integrations

## Testing Your Extensions

```python
# Add to main() for testing
def test_features():
    companion = WellnessCompanion()
    
    # Test sentiment analysis
    sentiment = companion.analyze_sentiment("I'm feeling amazing today!")
    print(f"Sentiment: {sentiment}")
    
    # Test mood report
    companion.generate_mood_report()
    
    # Test resources
    companion.show_resources()
```

## Performance Tips

- Cache conversation summaries after ~20 messages to manage token usage
- Implement message pagination for large conversation histories
- Use async API calls for better responsiveness
- Consider implementing rate limiting for API calls

## Security Considerations

- Never log full conversations to plain text if sensitive data is shared
- Implement optional encryption for stored data
- Use environment variables for all secrets
- Validate and sanitize user inputs
- Implement session timeouts for sensitive contexts

---

**Happy extending! Remember, every feature should serve the user's wellbeing.** 💙
