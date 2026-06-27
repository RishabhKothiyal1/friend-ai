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
    const { chatHistory } = body;
    
    if (!Array.isArray(chatHistory) || chatHistory.length === 0) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({ summary: stripMarkdown("Exploring safe, non-judgmental spaces to ground my thoughts and find clarity.") })
      };
    }

    const conversationItems = chatHistory.filter((msg: any) => msg.text && msg.sender);
    const userMessages = conversationItems.filter((msg: any) => msg.sender === "user");

    if (userMessages.length === 0) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({ summary: stripMarkdown("Just starting my journey with mindfulness grounding controls. Ready to face the day.") })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

    if (!ai || !checkGeminiRateLimit()) {
      const lastMsg = userMessages[userMessages.length - 1].text || "";
      let cleanSlice = lastMsg.replace(/(suicidal|suicide|kill|die|cut|self-harm|overdose)/gi, "emotional load");
      if (cleanSlice.length > 90) {
        cleanSlice = cleanSlice.substring(0, 87) + "...";
      }
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({
          summary: stripMarkdown(`Reflecting today: "${cleanSlice}". Holding a safe space and taking it one conscious breath at a time.`)
        })
      };
    }

    const formattedDialogue = conversationItems
      .slice(-8)
      .map((msg: any) => `${msg.sender === "user" ? "User" : "Companion"}: ${msg.text}`)
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Fixed from gemini-3.5-flash
      contents: `You are an expert helper at a supportive peer mental wellness community.
Below is a brief chat dialogue sequence between a user going through mental distress or emotional heavy lifting and an AI companion.
Please write a short, highly anonymous, general summary of what the user is carrying or reflecting on, completely stripped of any names, age indicators, locations, extreme trigger words, or personal context details.
The output MUST be written in the user's first-person voice (e.g. "Feeling overwhelmed today but trying to hold on...", "Reminding myself that this anxious wave will pass...", "Grateful for a moment of quiet reflection...") or as a general statement of hope.
Do NOT mention "AI companion", "chatbot", or computer processes. Focus purely on human coping and survival.
The output MUST be extremely concise, between 80 and 160 characters (shorter than a tweet) so it fits neatly as a peer support card.

Dialogue:
${formattedDialogue}

Summary:`,
    });

    const summary = stripMarkdown(response.text?.trim() || "Working on breathing through moments of anxiety, taking it one gentle step at a time.");
    
    let finalSummary = stripMarkdown(summary.replace(/^["'\s]*(summary|result|output|response):\s*/i, "").replace(/["'\s]*$/, "").trim());
    if (finalSummary.length > 250) {
      finalSummary = finalSummary.substring(0, 247) + "...";
    }

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ summary: finalSummary })
    };

  } catch (error) {
    handleGeminiRateLimit(error, "Dialogue Summarizer");
    
    const body = JSON.parse(event.body || "{}");
    const { chatHistory } = body;
    const conversationItems = (chatHistory || []).filter((msg: any) => msg.text && msg.sender);
    const userMessages = conversationItems.filter((msg: any) => msg.sender === "user");
    const lastMsg = userMessages.length > 0 ? (userMessages[userMessages.length - 1].text || "") : "";
    let cleanSlice = lastMsg.replace(/(suicidal|suicide|kill|die|cut|self-harm|overdose)/gi, "emotional load");
    if (cleanSlice.length > 90) {
      cleanSlice = cleanSlice.substring(0, 87) + "...";
    }
    const fallbackSummary = stripMarkdown(cleanSlice 
      ? `Reflecting today: "${cleanSlice}". Holding a safe space and taking it one conscious breath at a time.`
      : "Working on breathing through moments of anxiety, taking it one gentle step at a time.");
    
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ summary: fallbackSummary })
    };
  }
};
