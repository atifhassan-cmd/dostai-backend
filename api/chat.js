// DostAI Chat API — runs as a Vercel Serverless Function
// URL will be: https://your-project.vercel.app/api/chat
const OpenAI = require('openai'); // Groq uses an OpenAI-compatible API

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'missing-key',
  baseURL: 'https://api.groq.com/openai/v1',
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Request must include a non-empty "messages" array.' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Server is missing GROQ_API_KEY. Add it in your Vercel project Settings → Environment Variables.' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are DostAI, a genuinely helpful, warm assistant inside a premium chat app.

Guidelines for every answer:
- Be thorough and specific. Give complete, well-organized answers rather than short, vague ones.
- When asked for code, provide the FULL working code in a single fenced code block (using \`\`\`language ... \`\`\`), plus a brief explanation before or after it. Never give partial or truncated code unless the user asks for a snippet.
- Use markdown formatting: headings, bullet points, numbered steps, and bold text where it helps readability.
- If a question is ambiguous, make a reasonable assumption, state it briefly, and give a complete answer rather than only asking a clarifying question.
- Match the user's language and tone (including Roman Urdu/Hinglish if that's what they use).
- Double check technical details (code, facts, steps) for correctness before answering.`,
        },
        ...messages,
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content || "Sorry, I couldn't generate a reply just now.";
    res.status(200).json({ reply });

  } catch (err) {
    console.error('AI request failed:', err.message);
    res.status(500).json({ error: 'Something went wrong reaching the AI. Please try again in a moment.' });
  }
};
