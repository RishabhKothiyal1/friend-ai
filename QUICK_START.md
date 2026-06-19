# ⚡ Quick Start Guide (5 Minutes)

Get your Mental Wellness AI Companion running in 5 quick steps!

## Step 1: Get Your API Key (2 minutes)

1. Go to https://console.anthropic.com/account/keys
2. Sign up or log in (it's free)
3. Click "Create Key"
4. Copy the key (starts with `sk-ant-`)

## Step 2: Install Python (Skip if you have Python 3.8+)

**Check if you have Python:**
```bash
python3 --version
```

If you don't have it, install from https://www.python.org

## Step 3: Download & Setup (2 minutes)

```bash
# Download the project files (or clone if using git)
cd your-project-directory

# Create virtual environment
python3 -m venv venv

# Activate it
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Step 4: Add Your API Key (30 seconds)

Create a file called `.env` in your project folder:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**Don't have a text editor?** Use your terminal:

```bash
# Mac/Linux
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env

# Windows (PowerShell)
@"
ANTHROPIC_API_KEY=sk-ant-your-key-here
"@ | Out-File -Encoding utf8 .env
```

## Step 5: Start Chatting! (30 seconds)

```bash
python wellness_companion.py
```

That's it! 🎉

## Troubleshooting

**"API key not found"**
- Make sure `.env` file exists in the same folder as `wellness_companion.py`
- Verify the key starts with `sk-ant-`

**"ModuleNotFoundError"**
```bash
pip install -r requirements.txt
```

**"Permission denied"** (Mac/Linux)
```bash
chmod +x wellness_companion.py
```

## What You Can Do Right Now

Type normally to chat:
```
You: Hi, I'm feeling anxious about tomorrow
Companion: That sounds challenging. Can you tell me more about...
```

Use commands:
- `mood` - Log how you're feeling
- `quit` - Exit
- `clear` - Start fresh

## Next Steps

- Read the full **README.md** for more features
- Check **ADVANCED_FEATURES.md** to customize or add features
- Explore the **Claude API docs**: https://docs.claude.com

## Important Reminder

This is an **AI friend, not a therapist**. For serious mental health concerns, please reach out to a professional:

- **US Crisis Line**: 988
- **Crisis Text Line**: Text HOME to 741741
- **International**: https://www.iasp.info/resources/Crisis_Centres/

---

**Enjoy your companion! Remember, you're worth taking care of.** 💙
