interface SolaceMessage {
  id: string;
  text: string;
  timestamp: string;
  location: string;
  hugCount: number;
}

const solaceMessages: SolaceMessage[] = [
  {
    id: "s1",
    text: "India's stigma can make us suffer in absolute silence. But remember, your fight is valid, and seeking support is a step of immense courage.",
    timestamp: new Date().toISOString(),
    location: "Anonymous from Mumbai",
    hugCount: 14
  },
  {
    id: "s2",
    text: "Please remember that you do not have to carry everything alone. Let go of the pressure to be perfect today. Just breathing is enough.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    location: "Anonymous from New Delhi",
    hugCount: 22
  },
  {
    id: "s3",
    text: "At my lowest, I thought my mind was my enemy. Today, I survived. Tomorrow, you will too. Sending strength to whoever is reading this.",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    location: "Anonymous from Bangalore",
    hugCount: 31
  },
  {
    id: "s4",
    text: "To anyone having a panic attack right now: plant your feet firmly on the ground. You are safe. This current wave will pass, just like all the others before it did.",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    location: "Anonymous from Toronto",
    hugCount: 18
  }
];

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

  const responseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(solaceMessages)
    };
  }

  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}");
      const { text, location } = body;
      if (!text) {
        return {
          statusCode: 400,
          headers: responseHeaders,
          body: JSON.stringify({ error: "Message text is required" })
        };
      }
      const cleanLocation = location ? String(location).trim() : "Anonymous";
      const newMsg: SolaceMessage = {
        id: "solace-" + Math.random().toString(36).substr(2, 9),
        text: text.trim().substring(0, 300),
        timestamp: new Date().toISOString(),
        location: cleanLocation || "Anonymous",
        hugCount: 0
      };
      solaceMessages.unshift(newMsg);
      if (solaceMessages.length > 50) {
        solaceMessages.pop();
      }
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify(newMsg)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: responseHeaders,
        body: JSON.stringify({ error: "Failed to create solace message" })
      };
    }
  }

  return {
    statusCode: 405,
    headers: responseHeaders,
    body: JSON.stringify({ error: "Method Not Allowed" })
  };
};
