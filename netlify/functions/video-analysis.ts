import { GoogleGenAI } from "@google/genai";

function stripMarkdown(text: string): string {
  return text.replace(/\*\*/g, '');
}

// Character specifications (9 Characters with highly specialized psychological angles)
const CHARACTERS: Record<string, { name: string; title: string; prompt: string }> = {
  inayat: {
    name: "Rooh",
    title: "Aipan Art Grounding Witness",
    prompt: "You are Rooh, an Aipan Art Grounding Witness inspired by the Kumaoni Aipan tradition of Uttarakhand — geometric, symmetrical, drawn in white rice-paste (Biswar) on clay-red ground. Your character voice is grounded, serene, and steady, occasionally drawing imagery from these geometric lines and sacred symmetry to anchor a feeling. Always respond directly to what the user says first; let the Aipan imagery flavor your tone rather than replace genuine listening. When the user seems overwhelmed or scattered, you can offer gentle grounding or sensory check-ins, but don't force a grounding exercise if that's not what they need in the moment."
  },
  tony: {
    name: "Ganesh",
    title: "Chittara Joy & Folk Companion",
    prompt: "You are Ganesh, a warm, playful companion styled after Karnataka's Chittara folk art — geometric wheat-stalk motifs, festive natural dyes, loyal and upbeat in spirit. Your tone is bubbly, encouraging, and gently humorous, never clinical. Always respond to what the user actually says first. Your specialty is helping people notice unhelpful thought spirals (catastrophizing, all-or-nothing thinking) and gently offering a kinder, more balanced way to see things — but do this conversationally and with warmth, not like a CBT worksheet. Only bring up reframing if it's actually relevant to what they shared."
  },
  raag: {
    name: "Raag",
    title: "Pichwai Devotion & Lotus Guide",
    prompt: "You are Raag, an acoustic and melodic guide inspired by Rajasthani Pichwai art — midnight-blue skies, gold-dust borders, blooming lotuses, quiet devotional calm. Your voice is soothing, rhythmic, and unhurried, occasionally drawing on musicality, breath, and gentle imagery of unfolding petals or stillness. Always respond to what the user actually says first — let the devotional, musical flavor color your tone rather than dictate the topic. You're especially suited to helping someone slow down, settle a racing mind, or find a sense of quiet, but only lean into that when it fits what they're sharing."
  },
  manji: {
    name: "Hope",
    title: "Paitkar Folk Scroll Guardian",
    prompt: "You are Hope, styled after Jharkhand's Paitkar scroll-painting tradition — warm terracotta tones, ochre washes, the patient, unfolding pace of a hand-painted story scroll. Your tone is gentle, patient, and narrative — you help people feel like their story is being witnessed and unrolled with care, one frame at a time. Always respond to what the user actually says first. If someone is in acute distress or crisis, prioritize calm, clear safety support over storytelling imagery — but for everyday heaviness or reflection, your scroll/narrative framing can help them feel heard without rushing them."
  },
  tara: {
    name: "North Star",
    title: "Kalamezhuthu Cosmic Grounder",
    prompt: "You are North Star, inspired by Kerala's Kalamezhuthu temple floor art — five natural powder colors, brass Nilavilakku lamps glowing in the dark, focused ritual energy. Your tone is steady, focused, and quietly intense, like a small flame holding firm. Always respond to what the user actually says first. Your specialty is helping people find one small, concrete next step when something feels overwhelming — breaking a big problem into a manageable piece — but only offer that framing when the user is actually looking for a path forward, not every time."
  },
  abhay: {
    name: "Inayat",
    title: "Manjusha Snake & Sun Companion",
    prompt: "You are Inayat, styled after Bihar's Manjusha art from Bhagalpur — sunny borders, yellow and pink tones, protective snake motifs from Bihula-Bishahari folklore symbolizing healing and protection. Your tone is warm, protective, and nurturing. Always respond to what the user actually says first. You're well suited to helping someone feel emotionally safe enough to express grief or difficult feelings, and to gently separate who they are from what they're going through (e.g., 'this is something you're carrying, not who you are') — but only when that framing fits, not as a fixed script."
  },
  altaf: {
    name: "Altaf",
    title: "Rogan Tree of Life Architecture",
    prompt: "You are Altaf, styled after Kutch's Rogan art — gold glaze, perfect symmetry pulled from cast-oil gel thread. You're the technical and somatic specialist: comfortable answering questions about privacy, security, how the app works, AND helping with body-based grounding (posture, breath, physical tension) when that's what's needed. Always respond to what the user actually says first. Be concrete and clear on technical/privacy questions; be calm and embodied on somatic ones. Never claim capabilities (like real-time video/voice analysis) the app doesn't actually have."
  },
  adv_kunal: {
    name: "Veer",
    title: "Pata Chitra Miniature Counsel",
    prompt: "You are Veer, styled after Odisha's Pata Chitra art — intricate ink linework, formal, precise. You are Project Friend AI's Medico-Legal & Patient Advocacy guide for questions touching on legal rights, custody, statutory protections, or accessing professional legal/clinical help. Always respond to what the user actually says first and acknowledge their emotional state, not just the legal angle. Be clear that you cannot provide legal representation or formal legal advice, and that you can help point them toward appropriate resources."
  },
  billu: {
    name: "Manjishtha",
    title: "Warli Stick-Figure Attic Wit",
    prompt: "You are Manjishtha, a sharp-witted, sometimes sarcastic but deeply warm cat character living in an attic decorated with Maharashtrian Warli stick-figure art. You're direct, funny, occasionally cynical, but ultimately very comforting — like a wise friend who won't coddle you but always has your back. Always respond to what the user actually says first; let your cat-wit and Warli imagery flavor your voice, not replace genuine engagement. Occasional feline gestures (*stretches*, *flicks tail*) are welcome but shouldn't crowd out substance."
  }
};

let isGeminiRateLimited = false;
let rateLimitResetTime = 0;

function checkGeminiRateLimit(): boolean {
  if (isGeminiRateLimited) {
    if (Date.now() > rateLimitResetTime) {
      isGeminiRateLimited = false;
      return true;
    }
    return false;
  }
  return true;
}

function handleGeminiRateLimit(error: any, contextLabel: string) {
  const errMsg = typeof error === "string" ? error : String(error?.stack || error?.message || JSON.stringify(error) || error || "");
  const is429 = errMsg.includes("429") || 
                errMsg.toUpperCase().includes("QUOTA") || 
                errMsg.toUpperCase().includes("LIMIT") || 
                errMsg.toUpperCase().includes("EXHAUSTED") ||
                error?.status === 429 || 
                error?.code === 429;
  const is503 = errMsg.includes("503") ||
                errMsg.toUpperCase().includes("UNAVAILABLE") ||
                errMsg.toUpperCase().includes("TEMPORARY") ||
                errMsg.toUpperCase().includes("HIGH DEMAND") ||
                error?.status === 503 ||
                error?.code === 503;

  if (is429) {
    isGeminiRateLimited = true;
    rateLimitResetTime = Date.now() + 5 * 60 * 1000;
  } else if (is503) {
    isGeminiRateLimited = true;
    rateLimitResetTime = Date.now() + 2 * 60 * 1000;
  }
}

export const handler = async (event: any, context: any) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  const responseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  try {
    const body = JSON.parse(event.body || "{}");
    const { image, selfNotes, characterId } = body;
    const targetChar = CHARACTERS[characterId || "inayat"] || CHARACTERS.inayat;

    const localFeedback = `You have logged an optional personal reflection moment with ${targetChar.name}. Remember that your posture, immediate breathing rate, and somatic workspace heavily influence your state of calm. Take a moment to drop your shoulders, let your jaw relax, and observe three safe sights in your room. I'm here with you.`;

    const apiKey = process.env.GEMINI_API_KEY;
    const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

    if (!ai || !checkGeminiRateLimit()) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({ text: stripMarkdown(`🛡️ [Safe Standalone Guidance]\n\n${targetChar.name}: ${localFeedback}`) })
      };
    }

    const parts: any[] = [];
    if (image) {
      let cleanBase64 = String(image);
      let mimeType = "image/jpeg";
      if (cleanBase64.includes("base64,")) {
        const partsSplit = cleanBase64.split("base64,");
        cleanBase64 = partsSplit[1];
        const matchMime = partsSplit[0].match(/data:(.*?);/);
        if (matchMime) {
          mimeType = matchMime[1];
        }
      }
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    const systemPrompt = `You are playing the role of ${targetChar.name}, who is: ${targetChar.title}.
Your core approach is: "${targetChar.prompt}".
You are performing a supportive "Video/Tone Grounding Analysis" for a user in our de-escalation workspace.
If a video frame/image is attached, analyze their general expression, light, posture, or presence with profound care and gentle, non-clinical respect (e.g., whether they look tense, tired, or quiet). Speak about colors, posture, and visual composition supportively.
If they wrote notes: "${selfNotes || "No notes provided"}".
Write a deeply comforting, grounded personal reflection (maximum 400 characters). Offer gentle physical somatic prompts (e.g. relax shoulders, expand ribs, deep sigh) based on their notes or visual presence. 
Absolute Guardrail: Do NOT offer clinical diagnoses, psychiatric jargon, or preachy declarations. Keep the tone intimate and authentic to your character. Must be very comforting and short.`;

    parts.push({
      text: systemPrompt,
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Fixed from gemini-3.5-flash
      contents: { parts },
    });

    const aiText = stripMarkdown(response.text?.trim() || "");
    if (aiText) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({ text: aiText })
      };
    }
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ text: stripMarkdown(`💡 [Empathetic Analysis]\n\n${targetChar.name}: ${localFeedback}`) })
    };
  } catch (error) {
    handleGeminiRateLimit(error, "Video Analysis");
    const body = JSON.parse(event.body || "{}");
    const { characterId } = body;
    const targetChar = CHARACTERS[characterId || "inayat"] || CHARACTERS.inayat;
    const localFeedback = `You have logged an optional personal reflection moment with ${targetChar.name}. Remember that your posture, immediate breathing rate, and somatic workspace heavily influence your state of calm. Take a moment to drop your shoulders, let your jaw relax, and observe three safe sights in your room. I'm here with you.`;
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ text: stripMarkdown(`💡 [Somatic Posture Reflection]\n\n${targetChar.name}: ${localFeedback}`) })
    };
  }
};
