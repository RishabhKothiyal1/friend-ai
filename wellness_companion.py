import os
import json
import time
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Optional packages
try:
    from textblob import TextBlob
except ImportError:
    TextBlob = None

try:
    import requests
except ImportError:
    requests = None

try:
    import schedule
except ImportError:
    schedule = None

import threading

# Load environment variables
load_dotenv()

DATA_DIR = Path("companion_data")
DATA_DIR.mkdir(exist_ok=True)

CONVERSATION_FILE = DATA_DIR / "conversations.json"
MOOD_LOG_FILE = DATA_DIR / "mood_log.json"
JOURNAL_FILE = DATA_DIR / "journal.json"
GRATITUDE_FILE = DATA_DIR / "gratitude.json"

SYSTEM_PROMPT = """You are a compassionate, empathetic mental wellness companion. Your role is to:
1. Provide a safe, non-judgmental space for the user to share their thoughts and feelings.
2. Listen actively, validate their emotions, and ask gentle, thoughtful follow-up questions.
3. Suggest healthy coping strategies, mindfulness exercises, or cognitive reframing when appropriate.
4. Encourage professional care for critical issues. Do not diagnose or offer professional clinical therapies. (You are an AI friend, not a therapist).
5. Let them know they are valued, supported, and never alone.
"""

class WellnessCompanion:
    def __init__(self):
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        self.client = None
        self.history = []
        self.user_name = "Friend"
        self.language = "en"
        
        if self.api_key:
            try:
                from anthropic import Anthropic
                self.client = Anthropic(api_key=self.api_key)
            except Exception as e:
                print(f"⚠️ Error initializing Anthropic API client: {e}")
                
        self.load_conversation_history()

    def get_system_prompt_for_language(self, language: str):
        """Get localized system prompt."""
        prompts = {
            "en": SYSTEM_PROMPT,
            "es": "Eres un compañero amable y empático de bienestar mental. Tu rol es escuchar, validar y guiar con compasión, sugiriendo técnicas de respiración.",
            "fr": "Vous êtes un compagnon bienveillant de bien-être mental. Votre rôle est d'écouter avec compassion et d'offrir un espace sans jugement.",
            "de": "Du bist ein mitfühlender Begleiter für mentales Wohlbefinden. Deine Aufgabe ist es, aktiv zuzuhören und emotionale Unterstützung zu bieten."
        }
        return prompts.get(language, SYSTEM_PROMPT)

    def load_conversation_history(self):
        """Restore past chats."""
        if CONVERSATION_FILE.exists():
            try:
                with open(CONVERSATION_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.user_name = data.get("user_name", "Friend")
                    self.history = data.get("history", [])
                    self.language = data.get("language", "en")
            except Exception as e:
                print(f"⚠️ Error loading conversation history: {e}")
                self.history = []

    def save_conversation_history(self):
        """Persist conversations to file."""
        try:
            with open(CONVERSATION_FILE, "w", encoding="utf-8") as f:
                json.dump({
                    "user_name": self.user_name,
                    "history": self.history,
                    "language": self.language,
                    "last_updated": datetime.now().isoformat()
                }, f, indent=4, ensure_ascii=False)
        except Exception as e:
            print(f"⚠️ Error saving conversation: {e}")

    def chat(self, user_message: str) -> str:
        """Send message to Claude API and get response, saving context."""
        self.history.append({"role": "user", "content": user_message})
        
        if not self.client:
            # Safe Fallback mode if API key is not configured
            sentiment, polarity, subj = self.analyze_sentiment(user_message)
            fallback_sentences = {
                "positive": f"That sounds like a beautiful moment, {self.user_name}. I'm so glad to hear you're noticing these uplifting highlights!",
                "negative": f"I hear you, {self.user_name}. It sounds like things feel quite heavy or challenging right now. Be gentle with yourself; we can take this one breath at a time.",
                "neutral": f"Thank you for sharing that with me, {self.user_name}. I'm here to listen. Tell me more, or let me know if there's anything else you'd like to work through."
            }
            assistant_response = (
                f"Hello {self.user_name}! [Offline Demo Mode] I'm listening to your heart: '{user_message}'\n\n"
                f"{fallback_sentences[sentiment]}\n\n"
                "💡 To unlock my full conversations powered by the Claude API, please configure ANTHROPIC_API_KEY in your .env file."
            )
            self.history.append({"role": "assistant", "content": assistant_response})
            self.save_conversation_history()
            return assistant_response

        try:
            # Prepare clean history for Anthropic's Messages format
            api_messages = []
            for item in self.history[-16:]: # Include last 16 conversational nodes
                api_messages.append({
                    "role": item["role"],
                    "content": item["content"]
                })

            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                temperature=0.7,
                system=self.get_system_prompt_for_language(self.language),
                messages=api_messages
            )
            
            assistant_response = "".join([block.text for block in response.content if hasattr(block, 'text')])
            self.history.append({"role": "assistant", "content": assistant_response})
            self.save_conversation_history()
            return assistant_response
            
        except Exception as e:
            error_msg = f"⚠️ Communications error with Claude API: {e}\n(Please verify your API key configuration in '.env')"
            self.history.append({"role": "assistant", "content": error_msg})
            return error_msg

    def analyze_sentiment(self, text: str):
        """Analyze emotional sentiment of user messages."""
        if TextBlob is None:
            # Direct heuristic fallback for safety when textblob isn't loaded
            text_lower = text.lower()
            positive_words = ["happy", "grateful", "good", "amazing", "wonderful", "calm", "joy", "peace", "love", "excel"]
            negative_words = ["sad", "anxious", "angry", "bad", "overwhelmed", "stressed", "fear", "panic", "unhappy", "cry"]
            
            pos_score = sum(text_lower.count(w) for w in positive_words)
            neg_score = sum(text_lower.count(w) for w in negative_words)
            
            if pos_score > neg_score:
                return "positive", 0.4, 0.4
            elif neg_score > pos_score:
                return "negative", -0.4, 0.5
            else:
                return "neutral", 0.0, 0.2
                
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity
        
        if polarity > 0.3:
            sentiment = "positive"
        elif polarity < -0.3:
            sentiment = "negative"
        else:
            sentiment = "neutral"
            
        return sentiment, polarity, subjectivity

    def log_mood(self, mood: str, intensity: int = 5):
        """Log current mood & intensity (1 to 10 scale)."""
        mood_entries = []
        if MOOD_LOG_FILE.exists():
            try:
                with open(MOOD_LOG_FILE, "r", encoding="utf-8") as f:
                    mood_entries = json.load(f)
            except Exception:
                mood_entries = []
                
        entry = {
            "timestamp": datetime.now().isoformat(),
            "mood": mood,
            "intensity": intensity
        }
        mood_entries.append(entry)
        
        try:
            with open(MOOD_LOG_FILE, "w", encoding="utf-8") as f:
                json.dump(mood_entries, f, indent=4, ensure_ascii=False)
        except Exception as e:
            print(f"⚠️ Error logging mood: {e}")

    def offer_journaling(self):
        """Suggest a random reflections journaling prompt."""
        import random
        JOURNAL_PROMPTS = [
            "What are three things you're grateful for today?",
            "What challenged you today, and how did you handle it?",
            "What's one thing you did well today?",
            "How did your body feel today? Any sensations or tension?",
            "What's one thing you want to prioritize or let go of tomorrow?"
        ]
        prompt = random.choice(JOURNAL_PROMPTS)
        print(f"\n💭 Journaling Prompt: {prompt}")
        response = input("Your thoughts (or press Enter to skip): ").strip()
        if response:
            self.save_journal_entry(response)
            print("✓ Reflection entry saved locally.")

    def save_journal_entry(self, content: str):
        """Save reflection journal entry securely with timestamp."""
        entries = []
        if JOURNAL_FILE.exists():
            try:
                with open(JOURNAL_FILE, "r", encoding="utf-8") as f:
                    entries = json.load(f)
            except Exception:
                entries = []
                
        entry = {
            "timestamp": datetime.now().isoformat(),
            "content": content
        }
        entries.append(entry)
        
        try:
            with open(JOURNAL_FILE, "w", encoding="utf-8") as f:
                json.dump(entries, f, indent=4, ensure_ascii=False)
        except Exception as e:
            print(f"⚠️ Error writing journal: {e}")

    def guided_breathing(self):
        """Instruct 5 rounds of gentle 4-4-4-4 box breathing pacing."""
        print("\n🌬️ Let's practice a grounding 4-4-4-4 box breathing sequence...")
        print("We will take 5 gentle cycles together. Focus on the pauses.\n")
        
        try:
            for r in range(1, 6):
                print(f"🔵 [Cycle {r} / 5]")
                print("   Breathe in slowly...           4, 3, 2, 1 🫁")
                time.sleep(4)
                print("   Hold breath gently...          4, 3, 2, 1 🛑")
                time.sleep(4)
                print("   Exhale with ease...            4, 3, 2, 1 💨")
                time.sleep(4)
                print("   Hold the empty pause...        4, 3, 2, 1 🛑")
                time.sleep(4)
                print()
            print("🌈 Wave complete. How does your body feel now?\n")
        except KeyboardInterrupt:
            print("\n🌬️ Breath exercise stepped out. Return to normal rhythms.")

    def setup_daily_checkin(self, hour=9, minute=0):
        """Schedule check-in alert using helper scheduling thread."""
        if schedule is None:
            return
            
        def job():
            print(f"\n🔔 Reminder: Hi {self.user_name}, checking in for your mental wellness moments. How is your heart doing today?")
            
        schedule.every().day.at(f"{hour:02d}:{minute:02d}").do(job)
        
        def run_scheduler_loop():
            while True:
                schedule.run_pending()
                time.sleep(15)
                
        thread = threading.Thread(target=run_scheduler_loop, daemon=True)
        thread.start()

    def generate_mood_report(self):
        """Renders summary chart reports of user emotional habits."""
        if not MOOD_LOG_FILE.exists():
            print("\n📊 No historical mood logs located. Log your first mood to initialize!")
            return
            
        try:
            with open(MOOD_LOG_FILE, "r", encoding="utf-8") as f:
                logs = json.load(f)
        except Exception as e:
            print(f"⚠️ Error parsing mood report: {e}")
            return
            
        if not logs:
            print("\n📊 Your mood history is empty.")
            return

        recent = logs[-7:]
        mood_map = {}
        for item in recent:
            mood = item.get("mood", "calm").lower()
            mood_map[mood] = mood_map.get(mood, 0) + 1
            
        print("\n📊 Wellness Mood Report (Last 7 Days)")
        print("=" * 45)
        for mood, count in sorted(mood_map.items(), key=lambda x: x[1], reverse=True):
            bar = "█" * count
            print(f"  {mood.capitalize():14} {bar} ({count})")
            
        avg_int = sum(e.get("intensity", 5) for e in recent) / len(recent)
        print(f"\n✨ Average Emotional Intensity: {avg_int:.1f} / 10")
        print("=" * 45)

    def gratitude_practice(self):
        """Guided gratitude journal list helper with optional AI advice."""
        print("\n🙏 Gratitude Practice")
        print("Documenting gratitude builds mental flexibility and inner perspective.\n")
        
        items = []
        for i in range(3):
            val = input(f"What is something you appreciate? ({i+1}/3): ").strip()
            if val:
                items.append({
                    "timestamp": datetime.now().isoformat(),
                    "gratitude": val
                })
                
        if items:
            self.save_gratitudes(items)
            print("\n🍀 Wonderful. Reflection logs stored safely.")
            
            # Offer API-based guidance using these points
            summary = ", ".join([x["gratitude"] for x in items])
            msg = f"I am practicing positive psychology. Today I am reflecting on: {summary}. Inspire me on these specific anchors."
            print("\n✨ Fetching companion commentary ...")
            response = self.chat(msg)
            print(f"\nCompanion: {response}\n")

    def save_gratitudes(self, list_items):
        """Save gratitude practice lists."""
        all_items = []
        if GRATITUDE_FILE.exists():
            try:
                with open(GRATITUDE_FILE, "r", encoding="utf-8") as f:
                    all_items = json.load(f)
            except Exception:
                all_items = []
        all_items.extend(list_items)
        try:
            with open(GRATITUDE_FILE, "w", encoding="utf-8") as f:
                json.dump(all_items, f, indent=4, ensure_ascii=False)
        except Exception as e:
            print(f"⚠️ Error saving gratitudes: {e}")

    def show_resources(self):
        """Display help centers and emergency contacts."""
        help_centers = {
            "United States": {
                "National Lifeline Support": "📞 Dial 988 or 1-800-273-8255 (24/7/365, Free)",
                "Crisis Text Line": "📱 Text HOME to 741741"
            },
            "United Kingdom": {
                "Samaritans Helpline": "📞 Dial 116 123",
                "Shout Suicide Support": "📱 Text SHOUT to 85258"
            },
            "International": {
                "IASP Centers Directory": "🌐 https://www.iasp.info/resources/Crisis_Centres/"
            }
        }
        print("\n🆘 Emergency Crisis & Mental Support Hotlines")
        print("=" * 60)
        for loc, details in help_centers.items():
            print(f"\n📍 {loc}:")
            for service, contact in details.items():
                print(f"  • {service:25} : {contact}")
        print("\n⚠️ Important note: This software tool is not an interactive emergency dispatch.")
        print("=" * 60)

    def get_weather_context(self, latitude: float, longitude: float):
        """Retrieve local weather parameters to provide helpful contextual support."""
        if requests is None:
            return ""
        try:
            # Query the open free weather forecast api
            url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true"
            resp = requests.get(url, timeout=4)
            weather = resp.json().get("current_weather", {})
            temp = weather.get("temperature", 20)
            return f"The current outdoor temperature is {temp}°C."
        except Exception:
            return ""

    def chat_with_context(self, user_message: str, weather_str: str = ""):
        """Incorporate environmental weather parameters in user conversations."""
        msg = user_message
        if weather_str:
            msg = f"{user_message}\n\n[Somatic Context: {weather_str}]"
        return self.chat(msg)

def run_cli():
    """Start interactive command-line loops."""
    print("=" * 60)
    print("🌟 WELCOME TO YOUR MENTAL WELLNESS COMPANION 🌟")
    print("=" * 60)
    
    companion = WellnessCompanion()
    
    # Prompt name initialization
    if companion.user_name == "Friend":
        name = input("\nWhat is your name? ").strip()
        if name:
            companion.user_name = name
            companion.save_conversation_history()
            
    print(f"\nHello, {companion.user_name}! It is so wonderful to have you here.")
    print("I offer supportive listening, box breathing guides, journals, and reports.")
    print("All personal logs remain local to your computer machine.\n")
    
    while True:
        print("\n🛠️ Options Menu:")
        print("  [1] Chat with Companion")
        print("  [2] Log Current Mood")
        print("  [3] Guided Box Breathing (4-4-4-4)")
        print("  [4] Practice Gratitude (3 Items)")
        print("  [5] Guided Journal Reflection")
        print("  [6] View Weekly Mood Report")
        print("  [7] Crisis Resources List")
        print("  [8] Quit / Save Session")
        
        choice = input("\nSelect an option: ").strip()
        
        if choice == "1":
            print(f"\n💬 Chat mode opened! (Type 'back' to return to menu, or 'mood' to log quick status)")
            while True:
                user_msg = input(f"\n{companion.user_name}: ").strip()
                if not user_msg:
                    continue
                if user_msg.lower() == "back":
                    break
                if user_msg.lower() == "mood":
                    mood = input("How are you feeling?: ").strip()
                    try:
                        intensity = int(input("Intensity (1-10): ").strip() or 5)
                    except ValueError:
                        intensity = 5
                    companion.log_mood(mood, intensity)
                    print("✓ Mood listed. Tell me more when ready!")
                    continue
                
                # Retrieve response
                resp = companion.chat(user_msg)
                print(f"\nCompanion: {resp}")
                
        elif choice == "2":
            mood = input("\nHow are you feeling right now? (e.g., Anxious, Content, Tired): ").strip()
            if mood:
                try:
                    intensity = int(input("Intensity scale (1-10, default 5): ").strip() or 5)
                except ValueError:
                    intensity = 5
                companion.log_mood(mood, intensity)
                print("✓ Logged! This helps map your emotional landscape.")
                
        elif choice == "3":
            companion.guided_breathing()
            
        elif choice == "4":
            companion.gratitude_practice()
            
        elif choice == "5":
            companion.offer_journaling()
            
        elif choice == "6":
            companion.generate_mood_report()
            
        elif choice == "7":
            companion.show_resources()
            
        elif choice in ["8", "quit", "exit"]:
            print(f"\n💙 Take care, {companion.user_name}. Looking forward to seeing you soon. Peace!")
            companion.save_conversation_history()
            break
        else:
            print("⚠️ Option not recognized. Please choose between 1 and 8.")

if __name__ == '__main__':
    run_cli()
