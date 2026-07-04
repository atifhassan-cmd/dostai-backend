// DostAI Backend Server
// -----------------------------------------------------------------------
// This tiny server sits between your website (frontend) and the AI.
// The AI API key lives ONLY here, safely, and is never sent to the browser.
//
// It uses Groq (https://console.groq.com) which has a genuinely free tier:
// no credit card required, generous rate limits, and it runs great open
// models (like Llama 3.3) at very high speed.
// -----------------------------------------------------------------------

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // Groq uses an OpenAI-compatible API

const app = express();
app.use(cors());               // allows your frontend (any origin) to call this server
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3000;

if (!process.env.GROQ_API_KEY) {
  console.error('\n❌ Missing GROQ_API_KEY. Copy .env.example to .env and add your free Groq key.\n');
}

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'missing-key', // placeholder so startup never crashes
  baseURL: 'https://api.groq.com/openai/v1',
});

// Simple health check — visit this URL in a browser to confirm the server is alive
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'DostAI backend is running.' });
});

// Main chat endpoint — the frontend sends conversation history here
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Request must include a non-empty "messages" array.' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Server is missing GROQ_API_KEY. Add it to your .env file and restart the server.' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // free Groq model, fast + capable
      messages: [
        {
          role: 'system',
          content: 'You are DostAI, a warm and helpful assistant inside a premium chat app. Keep answers clear and well-formatted with markdown where useful.',
        },
        ...messages,
      ],
      max_tokens: 1000,
    });

    const reply = completion.choices?.[0]?.message?.content || "Sorry, I couldn't generate a reply just now.";
    res.json({ reply });

  } catch (err) {
    console.error('AI request failed:', err.message);
    res.status(500).json({ error: 'Something went wrong reaching the AI. Please try again in a moment.' });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ DostAI backend running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/`);
  console.log(`   Chat endpoint: POST http://localhost:${PORT}/api/chat\n`);
});
