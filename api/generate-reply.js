export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed"
      });
    }

    var apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GROQ_API_KEY is missing"
      });
    }

    var prompt = req.body && req.body.prompt ? req.body.prompt : "";

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    var response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You write short, natural, human-like email replies. No subject line. No signature. No explanation."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 350
      })
    });

    var data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error && data.error.message ? data.error.message : "Groq API error"
      });
    }

    var reply = "";

    if (
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      reply = data.choices[0].message.content;
    }

    if (!reply) {
      return res.status(500).json({
        error: "Empty response from AI"
      });
    }

    return res.status(200).json({
      reply: reply
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}
