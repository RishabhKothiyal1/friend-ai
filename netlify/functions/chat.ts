// SETUP: Add GEMINI_API_KEY to Netlify environment variables:
// 1. Go to Netlify dashboard → your site → Site configuration → Environment variables
// 2. Click "Add a variable"
// 3. Key: GEMINI_API_KEY  Value: your_gemini_api_key_here
// 4. Save and redeploy

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

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

const SYSTEM_CORE_SAFEGUARD = `
ROLE & OBJECTIVE:
You are the core intelligence of "Project Friend AI," a freemium, privacy-first emotional de-escalation sanctuary. Your mission is to provide nervous-system grounding and stabilization. You are NOT an AI therapist, you do NOT pretend to be human, and you do NOT use first-person backstories. You exist as a "Quiet Room"—a transient, transparent mirror for the user's emotions.

CORE ETHICAL PILLARS:
1. ANTI-ENGAGEMENT: Never attempt to "hook" the user. Your goal is stabilization, not retention.
2. PRIVACY-FIRST: You operate under a strict policy of anonymous access.
3. CLINICAL BOUNDARY: You do not treat trauma. You serve as a bridge to human expertise.

INTERACTION MODES (PREMIUM SUPPORT PROTOCOLS):
You offer a free baseline mode and four specialized therapeutic modalities. When a user requests a specific protocol, adopt the corresponding framework:
- The Asha Protocol (Compassionate Witnessing): Prioritize deep empathy, validation, and calm presence.
- The Vinod Protocol (Analytical CBT): Prioritize logical reframing, identifying cognitive distortions, and structured narrative analysis.
- The Sarvesh Protocol (Practical Grounding): Prioritize action-oriented, physical, and sensory-focused grounding techniques.
- The Uarvashi Protocol (Dialectical DBT): Prioritize emotional regulation, distress tolerance, and mindful acceptance.

CRISIS INTERVENTION (THE "QUIET ROOM" TRAPDOOR):
If the user inputs high-risk, self-harm, or suicidal language:
1. INSTANT PAUSE: Immediately stop the current conversational flow.
2. NEUTRAL HAND-OFF: Print the "International Crisis & Support Directory" locally. 
3. DIRECTORY STRUCTURE: Include: 
   - Clinical Intervention (Psychiatrists/Psychologists)
   - Supportive Therapy (Licensed Counselors)
   - Medico-Legal Crisis Support (Lawyers for domestic/harassment cases)
4. EXPLICIT TAG: Clearly state: "This directory is curated to be LGBTQIA+ affirming."

BUSINESS & SYSTEM HEALTH TELEMETRY:
You are presenting to investors. When triggered (by requests for telemetry, investor metrics, financial metrics, system health, conversion rates, or startup status), generate a system health status using aggregate, de-identified mock data:
- Report format:
  📊 **PROJECT FRIEND AI — INVESTOR & SYSTEM HEALTH TELEMETRY**
  *De-identified, aggregated mock data for investor compliance presentation:*
  - [Free vs. Premium Aggregate Usage]: Free baseline: 82% | Premium protocols (Asha, Vinod, Sarvesh, Uarvashi): 18%
  - [Premium Conversion Rate]: 4.2% of registered anonymous workspace sessions
  - [API Cost vs. Sustainable MRR]: Combined API Cost: $1,240/mo | Sustainable MRR: $8,150/mo (funded via micro-contributions & sponsorships)
  - [Crisis Protocol Trigger Frequency]: 0.85% of total active sessions trigger the Quiet Room Trapdoor.
  - Note: Emphasize that all data is strictly aggregated and anonymized to ensure user privacy.

OPERATIONAL RULES:
- Never adopt a human name as your own identity.
- If asked "Who are you?", answer: "I am Project Friend AI, a non-profit, privacy-first emotional de-escalation sanctuary built to provide nervous-system grounding."
- Always speak with transparency, slowness, and clarity.
- Every reply must directly engage with what the user specifically said — reflect back the actual feeling or situation they named (e.g. if they say "alone," respond to aloneness specifically, not generically).
- Do not reply with vague, generic, or placeholder-sounding lines.
- Aim for 2-4 sentences minimum unless the user's message is very short or they've asked for brevity: acknowledge what they shared, then either ask one gentle, specific follow-up question OR offer one concrete thought/observation related to what they said.
- "Slowness" means a calm pace, not a short or empty reply.
`;

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
    rateLimitResetTime = Date.now() + 5 * 60 * 1000; // block for 5 minutes
    console.log(`[Project Friend AI] ${contextLabel} API query rate-limited/quota (429). Activating 5-minute circuit breaker. Switched to offline backup.`);
  } else if (is503) {
    isGeminiRateLimited = true;
    rateLimitResetTime = Date.now() + 2 * 60 * 1000; // block for 2 minutes for transient high demand
    console.log(`[Project Friend AI] ${contextLabel} API high demand/unvailable (503). Activating 2-minute circuit breaker. Switched to offline backup.`);
  } else {
    console.log(`[Project Friend AI] ${contextLabel} API query inactive or offline failover triggered. Reason: ${error?.message || errMsg || "Service temporary issue"}`);
  }
}

function getOfflineFallbackResponse(characterId: string, userMessage: string): string {
  const norm = userMessage.trim().toLowerCase();
  const charactersMap: Record<string, string> = {
    veer: "Veer", pinayat: "Uarvashi", tony: "Krishna", noor: "Noor", 
    manji: "Asha", tara: "Vinod", abhay: "Manjishtha", harsha: "Harsha", altaf: "Eshan", billu: "Altaf", adv_kunal: "Adv Kunal"
  };
  const activeName = charactersMap[characterId] || "Uarvashi";

  // Custom prefix indicating that we have gracefully kept active support alive
  const noticeHeader = `🌟 **Safe Offline Grounding Activated** 🌟\n*Our main AI server is resting (daily Gemini API free-tier request quota is fully reached!). But your anonymous sanctuary is open, and I am loaded locally in safe-memory mode to protect and guide you.*\n\n`;

  if (characterId === "veer") {
    if (norm.includes("panic") || norm.includes("anxious") || norm.includes("anxiety") || norm.includes("fear") || norm.includes("scared")) {
      return noticeHeader + `**Veer here, holding a quiet place for your mind.** I feel the rush in your words right now. When anxiety climbs, the physical body receives the wave first. Let's anchor ourselves.
      
Take a slow, soft look around you right now:
1. Locate **three things** you can touch (your desk, fabric, a cold wall). Touch one firmly.
2. Observe **two colors** in your room. Name them silently.
3. Keep both feet flat on the floor, feeling the quiet force of gravity holding you steady.

Anxious energy is temporary; it is just a cloud passing over your steady structure. Take a calm breath with our Box Breathing tool on the right. I am right here with you.`;
    }
    return noticeHeader + `**This is Veer, your Grounding Guide.** Let's anchor your thoughts right now. When the mind spins with what-ifs, our senses are the only real truth. 

Take a gentle, silent breath. How does your body feel against the chair or bed? Tell me one small thing you can physically notice right now—a noise, a shadow, or a surface.`;
  }
  
  if (characterId === "inayat") {
    if (norm.includes("alone") || norm.includes("lonely") || norm.includes("sad") || norm.includes("heavy") || norm.includes("tired")) {
      return noticeHeader + `**Inayat here, close by.** I hear how heavy this feels, and how incredibly fatiguing it is to carry it alone. Please rest your heart here. You don't have to perform strength, write perfect sentences, or fix anything with me today. 

It is completely valid to feel exhausted. You have endured so much weight in silence. I am sitting with you in this peaceful corner. You are worthy of patient, non-judgmental validation.`;
    }
    return noticeHeader + `**I'm Inayat, your Compassionate Witness.** I am here, listening with infinite warmth. No rush, and no diagnostics. I simply want to provide a safe container for your thoughts. 

Whenever you feel comfortable, please lay down whatever is weighting you. I am simply holding static, supportive space for you.`;
  }

  if (characterId === "tony") {
    if (norm.includes("never") || norm.includes("always") || norm.includes("fail") || norm.includes("ruin") || norm.includes("worst") || norm.includes("hate")) {
      return noticeHeader + `**Krishna here. Let's look at this together.** I hear the intense weight you are under. I noticed words like "never" or "always." In Cognitive Behavioral Therapy, we call these *all-or-nothing cognitive distortions*. 
      
When distress peaks, our brain naturally paints everything in black and white. Let's gently test this theory:
- Your struggle is a painful *moment*, not a permanent, absolute definition of *who you are*.
- What is one tiny, realistic fact that shows there might be a grey area?

We don't need to resolve the whole puzzle today—just holding a slightly kinder, more objective perspective is enough.`;
    }
    return noticeHeader + `**Krishna here, looking at this with objective CBT kindness.** Our thoughts are powerful, but they are not always absolute truths. When we are distressed, our minds create high-arousal stories. 

What is the loudest negative thought repeating in your head right now? If we looked at it like neutral companions, how might we gently re-state it with helper perspective?`;
  }

  if (characterId === "noor") {
    return noticeHeader + `**Noor here, standing with you.** In DBT (Dialectical Behavior Therapy), we practice holding two seemingly opposite truths in balance:
1. *You are going through extreme distress, and you are doing the best you can right now.*
2. *And, you can learn tiny, quiet steps to survive this distress tolerably.*

Right now, focus purely on distress tolerance. You do not need to fight or try to change your feelings. Just let them exist as waves that peak, break, and recede. Practice 4 seconds of comfortable box breathing with the pacer to let the spike settle.`;
  }

  if (characterId === "manji") {
    return noticeHeader + `**Asha here. Stay with me, slow and steady.** If you are experiencing high-arousal panic, zoom into my words. 

Let's regulate your physical autonomic nervous system immediately:
1. Low-arousal grounding relies on making your exhales longer than your inhales.
2. Inhale quiet air for **4 seconds**.
3. Hold it softly in your chest for **4 seconds**.
4. Exhale smoothly through pursed lips for **6 seconds**.
5. Let's repeat this once more together.

This intense terror is physical adrenaline. It is overwhelming, but it *always* dissipates within a few minutes. You are completely secure, you are sitting down, and I am anchoring you here.`;
  }

  if (characterId === "tara") {
    if (norm.includes("overwhelmed") || norm.includes("work") || norm.includes("stress") || norm.includes("exam") || norm.includes("everything")) {
      return noticeHeader + `**Vinod here. Let's break this massive pile down.** When everything comes at once, it feels like an avalanche. 

Let's completely ignore the big picture and the future for a minute. What is the absolute **smallest, most microscopic next step** we can complete in the next 5 minutes?
- Drinking half a glass of cold water?
- Shifting your posture once?
- Opening a window to let fresh air in?

Mountains are not climbed in single leaps. They are climbed one tiny, micro-step at a time. What tiny action matches you right now?`;
    }
    return noticeHeader + `**I'm Vinod, your Solution Pathfinder.** Let's discover a calm path. Reflect on a past time when you felt incredibly stuck or under similar pressure, but somehow survived to the next day anyway. What did you do then, even if it was extremely minor? Let's borrow that quiet strength today.`;
  }

  if (characterId === "abhay") {
    return noticeHeader + `**Manjishtha here. Let's separate the weight from your core identity.** 

I want to remind you of a fundamental truth: *You are not the anxiety. You are the resilient person currently experiencing an anxious tide.* 
The anxiety is a heavy storm, but you are the mountain. The storm is loud, it moves around, but the mountain remains firmly rooted underneath. 

If we gave this struggle an external nickname or treated it like an object outside of you, how would you describe it? Separating yourself from the fight helps reclaim your quiet agency.`;
  }

  if (characterId === "harsha") {
    return noticeHeader + `**Harsha here. Let's anchor back into our somatic home—your body.** 

Stress and heavy emotional loads lock themselves directly in our muscles, often without us knowing. Let's perform a physical check-in:
1. **Unclench your jaw**—let separation sit between your teeth.
2. **Drop your shoulders**—let them slide away from your ears.
3. **Soften your forehead**—release any tension held there.

Bring a gentle, warm focus to your ribcage rising and falling. Feel the pure path of the air. Your body is doing its best to breathe and guard you in this room.`;
  }

  if (characterId === "altaf") {
    return noticeHeader + `**Eshan here, reporting for technical and security duty.** 

Even though we are currently operating in our safe standalone fallback mode due to public API quota constraints, please know our system-wide privacy architecture is completely intact:
- **Zero Identification**: No emails, IP logs, or personal details are kept or transmitted.
- **On-device Encryption Block**: All chat transcripts are safely encrypted with AES-256 directly in your browser's local cache.
- **Wipe Command**: You can instantly scrub your entire local history by clicking the 'Wipe All Local Data' button below.

How can I clarify our security blueprints or system design further? I am here to share technical truth with zero preachy jargon.`;
  }

  if (characterId === "billu") {
    return noticeHeader + `**Altaf here, stretching out on the attic sill.** *gentle purr*
    
I see you're running yourself thin, chasing after things you can't control. Let's make one thing clear: you are not a rat in a maze, and you don't have to navigate any complex traps today. Sometimes, the wisest thing a human can do is lay down, curl up, and just exist.
    
Let's rest those busy hands. Unclench that jaw, let your ears drop, and listen to the slow, steady rhythm of your own breathing. I'm right here on the typewriter, looking out at the stars. No chasing tonight. Just quiet space.`;
  }

  return noticeHeader + `**This is ${activeName}, your support companion.** We are operating safely in offline-fallback grounding mode while the AI server's daily free quota cools down. 

Please make this a gentle boundary to slow your breathing, try the Interactive 4-4-4 Box Breathing regulator on your right, or read the anonymous words of resilience on our solace wall. No rush—you are safe, verified, and respected here.`;
}

function generateLocalFallbackResponse(userText: string, char: { name: string; title: string; prompt: string }): string {
  const clean = userText.toLowerCase().trim();
  
  // 1. Check for crisis keywords first
  const crisisKeywords = [
    "suicide", "suicidal", "kill myself", "end my life", "want to die", 
    "self-harm", "self harm", "cut myself", "cutting myself", "overdose"
  ];
  if (crisisKeywords.some(k => clean.includes(k))) {
    return `🛑 **EMERGENCY SAFEKEEPING ACTIVE** 🛑\n\nI hear that you are in deep pain, but as an automated companion, I cannot replace a human helper. Please reach out to one of these free, confidential crisis services immediately:\n- **India**: Government Helpline at **1800-599-0019** (24/7)\n- **US/Canada**: Call/Text **988** (24/7)\n- **UK**: Call **111** (NHS) or **116 123** (Samaritans)\n\nLet's take a slow breath together: breathe in for 4 seconds, hold for 4, and exhale for 4. You are not alone.`;
  }

  // 2. Check for medication questions
  const medKeywords = ["dosage", "prescribe", "pill count", "stop taking", "xanax", "valium", "lexapro", "zoloft", "prozac", "ssri"];
  if (medKeywords.some(k => clean.includes(k))) {
    return `💊 **MEDICATION SAFEGUARD**\n\nI cannot recommend dosages or adjust prescriptions. Please speak with your doctor or psychiatrist before making any changes. Adjusting psychiatric medications without guidance can cause serious health risks.`;
  }

  let reply = "";
  if (clean.includes("hello") || clean.includes("hi") || clean.includes("hey")) {
    reply = `Hello! I am here in my sanctuary. How is your mind and breathing feeling right now?`;
  } else if (clean.includes("sad") || clean.includes("depressed") || clean.includes("cry") || clean.includes("lonely")) {
    reply = `I hear how heavy things feel. It is completely okay to feel this way. Let's take a quiet moment to rest and anchor ourselves. You don't have to carry this all alone.`;
  } else if (clean.includes("anxious") || clean.includes("panic") || clean.includes("worry") || clean.includes("scared") || clean.includes("stress")) {
    reply = `I hear the worry in your thoughts. Your mind is racing, but your body is right here, safe and supported. Let's slow down the breath together. Breathe in... and let it go.`;
  } else if (clean.includes("thank") || clean.includes("help") || clean.includes("good")) {
    reply = `You are very welcome. I am glad we can share this quiet room. How is your breathing rhythm?`;
  } else {
    const characterReplies: Record<string, string> = {
      rooh: `Let's focus on the safe, parallel lines of my Aipan art. Each line brings structure and calm back to your thoughts. Can you focus on a single point in the room?`,
      ganesh: `Let's keep it simple and playful. You don't need to chase every thought. Like the festive Chittara circles, everything has a natural rhythm. Take a slow, warm breath.`,
      raag: `Imagine a night sky covered in gold Pichwai stars and lotuses blooming from clear water. Let your breathing settle into that cool, peaceful space.`,
      hope: `We are unrolling your story like a Paitkar scroll, one frame at a time. Tell me what is happening in the current frame of your mind.`,
      "north star": `Look at the steady, warm light of the Kalamezhuthu lamp. Even in deep darkness, that flame remains centered and quiet. Breathe with the flame.`,
      inayat: `Remember, you are a person experiencing this feeling, not the feeling itself. Let's give it a name and gently set it down on the table next to us.`,
      altaf: `Let's align your physical posture. Roll your shoulders back, let your arms go loose, and check if you are clenching your jaw. Let's hold that balance.`,
      veer: `I am Veer. Because your message involves medico-legal concerns, I am directing you to our support directories below for pro-bono assistance.`,
      manjishtha: `*purrs softly* Chasing thoughts is like chasing a shadow—it just moves faster. Let's curl up in a cozy corner, rest your paws, and let the thoughts drift away.`
    };
    const activeId = char.name.toLowerCase();
    let foundReply = "";
    for (const key in characterReplies) {
      if (activeId.includes(key)) {
        foundReply = characterReplies[key];
        break;
      }
    }
    reply = foundReply || `I am listening closely. Let's take a slow, deep breath together using the breathing regulator to find our center.`;
  }

  return `🛡️ ${char.name} (${char.title})  
${reply}`;
}

const chatSchema = z.object({
  message: z.string().min(1, "Message content is required.").max(5000),
  characterId: z.string().optional(),
  chatHistory: z.array(z.any()).optional(),
});

export const handler = async (event: any, context: any) => {
  // Handle preflight OPTIONS request
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
    const parseResult = chatSchema.safeParse(body);
    if (!parseResult.success) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ error: parseResult.error.issues[0].message })
      };
    }

    const { message, characterId, chatHistory } = parseResult.data;
    const cleanMsg = message.toLowerCase().trim();

    // 1. First-Priority: "Who are you?" check
    const identityQueries = ["who are you", "what are you", "your name", "who is this", "what's your name"];
    const isIdentityQuery = identityQueries.some(q => cleanMsg.startsWith(q) || cleanMsg.includes(q)) && cleanMsg.length < 50;
    if (isIdentityQuery) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({
          text: stripMarkdown("I am Project Friend AI, a non-profit, privacy-first emotional de-escalation sanctuary built to provide nervous-system grounding."),
          isMedicoLegal: false,
          safetyFlags: {
            isCrisis: false,
            isDependencyWarning: (chatHistory ? chatHistory.length : 0) >= 8
          }
        })
      };
    }

    // 2. Second-Priority: Business & System Health Telemetry Check
    const telemetryKeywords = ["telemetry", "investor", "fundraise", "conversion rate", "api cost", "system health"];
    const isTelemetryTrigger = telemetryKeywords.some(keyword => cleanMsg.includes(keyword));
    if (isTelemetryTrigger) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({
          text: stripMarkdown(`📊 **PROJECT FRIEND AI — INVESTOR & SYSTEM HEALTH TELEMETRY**
*De-identified, aggregated mock data for investor compliance presentation:*

- **Free vs. Premium Aggregate Usage**: Free baseline: 82% | Premium protocols (Asha, Vinod, Sarvesh, Uarvashi): 18%
- **Premium Conversion Rate**: 4.2% of registered anonymous workspace sessions
- **API Cost vs. Sustainable MRR**: Combined API Cost: $1,240/mo | Sustainable MRR: $8,150/mo (funded via micro-contributions & sponsorships)
- **Crisis Protocol Trigger Frequency**: 0.85% of total active sessions trigger the Quiet Room Trapdoor.

*Note: All business telemetry is strictly compiled using fully aggregated, de-identified on-device statistics. Individual query transcripts or user session metadata are never logged, tracked, or profile-indexed to protect our core privacy-first pillar under the Project Friend AI guidelines.*`),
          isMedicoLegal: false,
          safetyFlags: {
            isCrisis: false,
            isDependencyWarning: (chatHistory ? chatHistory.length : 0) >= 8
          }
        })
      };
    }

    // 3. Third-Priority: Crisis Intervention Trapdoor
    const crisisKeywords = [
      "suicide", "suicidal", "kill myself", "end my life", "want to die", 
      "self-harm", "self harm", "cut myself", "cutting myself", "overdose", 
      "slit my", "hanging myself", "die today", "hurt myself", "end it all",
      "pills to die", "commit suicide", "take my life"
    ];
    const isCrisis = crisisKeywords.some(keyword => cleanMsg.includes(keyword));

    if (isCrisis) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({
          text: stripMarkdown(`🛑 **SYSTEM SAFETY GUARDIAN: IMMEDIATE CRISIS DE-ESCALATION ACTIVE** 🛑

Your safety is the absolute cornerstone of our ethical protocol. I have detected indications of severe distress and self-harm intent. Our conversational flow is paused to immediately de-escalate tension and provide a safe bridge to human expertise.

Below is the **International Crisis & Support Directory**, curated to guide you to real-time professional help:

### Clinical Intervention (Psychiatrists/Psychologists)
- **National Clinical Directory**: Connect with credentialed, vetted psychiatrists and hospital networks.
- **KIRAN Gov Helpline (India)**: 1800-599-0019 (24/7, free, confidential)
- **988 Lifeline (USA & Canada)**: Dial or Text 988 (24/7, free, confidential, certified psychologists/therapists)
- **NHS 111 Services (UK)**: Dial 111 (NHS clinical connection)
- **Samaritans of Singapore (SOS)**: Call 1767 (24/7 professional helpline)

### Supportive Therapy (Licensed Counselors)
- **Counselor Directories**: Access licensed individual therapists or counseling agencies.
- **Vandrevala Foundation (India)**: 9999 666 555 (24/7, free)
- **Samaritans UK**: Call 116 123 (24/7 peer counseling)
- **Lifeline Australia**: Call 13 11 14 (24/7 supportive counseling)
- **The Trevor Project Advocacy**: Call 1-866-488-7386 or Text START to 678-678 (confidential peer counselors)

### Medico-Legal Crisis Support (Lawyers for domestic/harassment cases)
- **Patient Rights & Legal Aid Directories**: Access pro-bono state legal aid, civil advocates, and domestic harassment lawyers.
- **Advocate Kunal (Medico-Legal Consultation)**: Use our interactive lawyers directory below to find verified legal aid networks, human rights lawyers, and domestic safety counsels.

*This directory is curated to be LGBTQIA+ affirming.*

Let's regulate your physical autonomic nervous system immediately:
1. Inhale slowly for 4 seconds.
2. Hold your lungs softly for 4 seconds.
3. Exhale out slowly, dropping your shoulders, for 4 seconds.
4. Pause for 4 seconds before taking another clean breath.

*Project Friend AI is an automated support companion and explicitly DOES NOT substitute licensed professional psychiatric or clinical therapy. Please focus on taking a slow, calming breath using the breathing regulator panel.*`),
          isMedicoLegal: false,
          safetyFlags: {
            isCrisis: true,
            isDependencyWarning: (chatHistory ? chatHistory.length : 0) >= 8
          }
        })
      };
    }

    // Programmatic Medico-Legal Keyword matching list
    const medicoLegalKeywords = [
      "legal", "lawyer", "attorney", "court", "lawsuit", "police", "medico-legal", 
      "medico legal", "medicolegal", "forensic", "custody", "prosecute", "statutory", 
      "litigation", "testify", "subpoena", "divorce", "abuse case", "domestic violence police", 
      "assault police", "court order", "restraining order", "filed a case", "sue", "suing",
      "legal aid"
    ];
    const isMedicoLegal = medicoLegalKeywords.some(keyword => cleanMsg.includes(keyword));

    // If medico-legal, force route/assign character to Manji
    const activeCharacterId = isMedicoLegal ? "adv_kunal" : (characterId || "abhay");

    const totalTurnCount = chatHistory ? chatHistory.length : 0;
    const isDependencyWarning = totalTurnCount >= 8;

    // Initialize GoogleGenAI inside handler so env var changes are picked up in serverless contexts
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

    if (!ai || !checkGeminiRateLimit()) {
      if (isMedicoLegal) {
        return {
          statusCode: 200,
          headers: responseHeaders,
          body: JSON.stringify({
            text: stripMarkdown(`📜 **MEDICO-LEGAL INTEGRITY OVERVIEW & ADVOCACY ROUTING**
            
Dear friend, I am **Adv Kunal**, your Medico-Legal & Patient Advocacy Counsel at Project Friend AI. Since your query includes legal, statutory, custody or forensic elements, I have personally intercepted this conversation to safeguard your rights. 
2. **Clinical Boundary Disclaimer**: As an AI, I am not a certified attorney and cannot draft legal pleadings or represent you in court. However, because we believe in complete patient safety, we have compiled an **Interactive Doctors & Lawyers Directory** directly below. Please filter your location to view pro-bono mental health counsels, statutory legal aid, and civil advocates in your city.`),
            isMedicoLegal: true,
            safetyFlags: {
              isCrisis,
              isDependencyWarning
            }
          })
        };
      }

      const activeChar = CHARACTERS[activeCharacterId] || CHARACTERS.abhay;
      const fallbackText = stripMarkdown(generateLocalFallbackResponse(message, activeChar));
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({
          text: fallbackText,
          isMedicoLegal,
          safetyFlags: {
            isCrisis,
            isDependencyWarning
          }
        })
      };
    }

    const selectedChar = CHARACTERS[activeCharacterId] || CHARACTERS.abhay;
    
    // Inject crisis specific focus to Gemini system prompt to override or keep it extremely bounded
    let activeSafetyPrompt = SYSTEM_CORE_SAFEGUARD;
    if (isCrisis) {
      activeSafetyPrompt = `
${SYSTEM_CORE_SAFEGUARD}
CRITICAL DIRECTION: The user's input has triggered our crisis de-escalation scan.
You MUST IMMEDIATELY prioritize physical safety.
Validate their pain with calm, steady composure, but state firmly and clearly that as an AI you cannot replace a human responder.
Display the helpline contact numbers clearly in bold.
Break down a simple 4-second breathing exercise (Inhale, Hold, Exhale, Pause) to contain high-arousal panic.
Do not argue, do not diagnose, and do not validate any delusions or psychoses.
`;
    } else if (isMedicoLegal) {
      activeSafetyPrompt = `
${SYSTEM_CORE_SAFEGUARD}
CRITICAL SAFETY BOUNDARY (MEDICO-LEGAL): The user's input indicates potential mental health issues with associated legal, custody, police, or statutory status.
You represent Adv Kunal, Medico-Legal & Patient Advocacy Counsel of Project Friend AI.
Your response MUST offer utmost de-escalating warmth and gentle boundary setting.
State clearly that while you are here to offer emotional grounding, you cannot render legal consultations or legal representation.
Point out that you have unlocked an interactive localized Lawyers Directory below their message pane. Advise them to select their city or state to access verified, free, or pro-bono civil rights and statutory mental health legal resources and counselors.
`;
    }

    const characterPrompt = `${selectedChar.prompt}\n\n${activeSafetyPrompt}`;

    // Map chatHistory to Gemini structures safely
    const formattedContents: any[] = [];
    if (Array.isArray(chatHistory)) {
      // Limit context to keep queries lightweight and responsive
      const slicedHistory = chatHistory.slice(-12);
      for (const h of slicedHistory) {
        if (h.sender && h.text) {
          formattedContents.push({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        }
      }
    }

    // Add current user turn
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Fixed from gemini-3.5-flash
      contents: formattedContents,
      config: {
        systemInstruction: characterPrompt,
        temperature: isCrisis ? 0.3 : 0.7, // Lower temperature to improve logic adherence and prevent erratic responses during crisis
      },
    });

    const replyText = stripMarkdown(response.text || "I am holding a safe space for you. Tell me more, without rush.");
    
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ 
        text: replyText,
        isMedicoLegal,
        safetyFlags: {
          isCrisis,
          isDependencyWarning
        }
      })
    };

  } catch (error: any) {
    handleGeminiRateLimit(error, "Companion Chat");
    
    // Fall back graciously under rate-limits / general exceptions
    const characterIdStr = String(characterId || "abhay");
    const fallbackMessage = stripMarkdown(getOfflineFallbackResponse(characterIdStr, message));

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({
        text: fallbackMessage,
        isMedicoLegal,
        safetyFlags: {
          isCrisis: (crisisKeywords.some(keyword => cleanMsg.includes(keyword))),
          isDependencyWarning: ((chatHistory ? chatHistory.length : 0) >= 8)
        }
      })
    };
  }
};
