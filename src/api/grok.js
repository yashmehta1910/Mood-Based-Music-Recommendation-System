const KEY = import.meta.env.VITE_GROK_KEY;

export async function analyzeMood(userText) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${KEY}`
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are a mood analysis assistant. Always respond with valid JSON only — no markdown, no explanation, no backticks."
        },
        {
          role: "user",
          content: `Analyze this mood and respond ONLY with this exact JSON structure:
{
  "mood": "one of: happy, sad, energetic, calm, romantic, focused, angry, nostalgic",
  "energy": <number 0-100>,
  "valence": <number 0-100>,
  "tags": ["3 Last.fm music tags that fit this mood"],
  "summary": "one sentence describing the vibe"
}

User says: "${userText}"`
        }
      ]
    })
  });
  const data = await res.json();
  const text = data.choices[0].message.content;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}