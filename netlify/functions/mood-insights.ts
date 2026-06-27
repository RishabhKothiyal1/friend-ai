import { GoogleGenAI } from "@google/genai";

function stripMarkdown(text: string): string {
  return text.replace(/\*\*/g, '');
}

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

function getLocalInsights(moodsList: any[]): { triggers: string[]; patterns: string[]; text: string } {
  if (!Array.isArray(moodsList) || moodsList.length === 0) {
    return {
      triggers: [],
      patterns: [],
      text: "Start logging your secure mood states and tags. I will monitor triggers (like work or family stress) vs. positive patterns (like nature or deep box breathing)."
    };
  }

  const triggerFrequency: Record<string, number> = {};
  const positiveFrequency: Record<string, number> = {};

  moodsList.forEach((entry) => {
    const isHighDistress = (entry.intensity || 5) >= 6 || ["Overwhelmed", "Anxious", "Depressed", "Tired"].includes(entry.mood);
    const tags = Array.isArray(entry.tags) ? entry.tags : [];
    
    tags.forEach((tag: string) => {
      const cleanTag = tag.trim();
      if (!cleanTag) return;
      if (isHighDistress) {
        triggerFrequency[cleanTag] = (triggerFrequency[cleanTag] || 0) + 1;
      } else {
        positiveFrequency[cleanTag] = (positiveFrequency[cleanTag] || 0) + 1;
      }
    });
  });

  const triggers = Object.entries(triggerFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(e => e[0]);

  const patterns = Object.entries(positiveFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(e => e[0]);

  let insightText = "";
  if (triggers.length > 0 && patterns.length > 0) {
    insightText = `💡 **Mental Safety Tracker**: We notice that **#${triggers.join(", #")}** often associate with emotional spikes. Conversely, focusing on **#${patterns.join(", #")}** correlates heavily with stable, grounded, and peaceful states. Try practicing box breathing when triggers start to rise.`;
  } else if (triggers.length > 0) {
    insightText = `💡 **Potential Triggers Block**: Your logs show that **#${triggers.join(", #")}** tend to acts as stress drivers. Try taking a preemptive grounding break or setting minor boundaries around these areas.`;
  } else if (patterns.length > 0) {
    insightText = `💡 **Resilient Patterns Found**: Excellent anchors! Engaging with **#${patterns.join(", #")}** is highly correlated with stable or peaceful moments. Build on these spaces to nurture your wellness.`;
  } else {
    insightText = `💡 **Personal Insight**: You are logging consistently. Keep adding custom tags (e.g. #work, #nature, #family) with your logs so I can trace stress triggers and wellness anchors for you.`;
  }

  return { triggers, patterns, text: insightText };
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
    const { moodsList } = body;
    if (!Array.isArray(moodsList) || moodsList.length === 0) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({ text: stripMarkdown("Add some mood entries to unlock personalized triggers and wellness statistics.") })
      };
    }

    const localFeedback = getLocalInsights(moodsList);
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

    if (!ai || !checkGeminiRateLimit()) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({ text: stripMarkdown(`🛡️ [Safe Standalone Guidance]\n\n${localFeedback.text}`) })
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Fixed from gemini-3.5-flash
      contents: `You are an expert peer mental safety guide.
Review the user's logged emotions and tags. Check which tasks or contexts (tags) associate with high distress and overload, versus which activities associate with peaceful or joyful states.

Logged Data:
${JSON.stringify(moodsList, null, 2)}

Please write a brief, warm, supportive wellness check-up (maximum 220 characters). Mention any detected triggers (e.g., #work, #family) or positive patterns (e.g., #nature, #breathing) if present, encouraging gentle pacing. Focus strictly on resilience. Use 1 or 2 small tags as examples. Be extremely concise. Keep it warm but objective. Do not offer medical, therapeutic, or diagnostic statements.`,
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
      body: JSON.stringify({ text: stripMarkdown(`💡 [Empathetic Feedback]\n\n${localFeedback.text}`) })
    };

  } catch (error) {
    handleGeminiRateLimit(error, "Mood Insights");
    const body = JSON.parse(event.body || "{}");
    const { moodsList } = body;
    const localFeedback = getLocalInsights(moodsList);
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ text: stripMarkdown(`💡 [Aesthetic Stat Analysis]\n\n${localFeedback.text}`) })
    };
  }
};
