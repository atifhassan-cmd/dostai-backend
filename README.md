# DostAI Backend

A tiny, free backend that lets your DostAI website actually talk to an AI —
safely, with your API key hidden on the server instead of exposed in the browser.

It uses **Groq** (https://groq.com) for the AI — genuinely free, no credit
card required, and very fast.

---

## 1. Run it on your own computer (for testing)

You need [Node.js](https://nodejs.org) installed (version 18 or newer).

```bash
cd backend
npm install
cp .env.example .env
```

Now open `.env` and paste in your free Groq API key:
1. Go to https://console.groq.com
2. Sign up (email or Google, no card needed)
3. Click "API Keys" → "Create API Key"
4. Copy it into `.env` like this: `GROQ_API_KEY=gsk_xxxxxxxxxxxx`

Then start the server:

```bash
npm start
```

You should see:
```
✅ DostAI backend running at http://localhost:3000
```

Open http://localhost:3000 in your browser — you should see `{"status":"ok"}`.
That means it's working.

---

## 2. Connect your website (dostai.html) to this backend

Open `dostai.html`, find this line near the top of the `<script>` section:

```js
const BACKEND_URL = "http://localhost:3000";
```

- While testing on your own computer, leave it as `http://localhost:3000`.
- Once you deploy the backend online (step 3), replace it with your live
  backend URL, e.g. `https://dostai-backend.onrender.com`.

---

## 3. Put it online for free (so real users can use it) — Render

1. Create a free account at https://render.com (no credit card needed)
2. Push this `backend` folder to a GitHub repository
3. In Render, click **New → Web Service**, connect your GitHub repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Under **Environment Variables**, add:
   - `GROQ_API_KEY` = your key from console.groq.com
6. Click **Deploy**

Render will give you a live URL like `https://dostai-backend.onrender.com`.
Put that into `BACKEND_URL` in `dostai.html`, then re-upload your website
anywhere (Netlify, Vercel, GitHub Pages, or Render's free static hosting too).

**Note:** Render's free web services "sleep" after 15 minutes with no
traffic, and take about 30–60 seconds to wake up on the next request.
That's normal for a free tier — perfectly fine for a demo or small project.

---

## 4. Important for a real, paying business

This setup is great to launch and test with real users for free. Once you
have real growth, you'll eventually want to add:
- A real database for users (e.g. PostgreSQL) instead of the browser's
  localStorage used in the current frontend demo
- A real payment gateway (JazzCash, Easypaisa, Stripe) so "Upgrade to Pro"
  actually charges people, verified on the backend — never trust the
  frontend alone to decide who has paid
- Rate limiting per user on `/api/chat` so one person can't drain your
  free Groq quota for everyone else
