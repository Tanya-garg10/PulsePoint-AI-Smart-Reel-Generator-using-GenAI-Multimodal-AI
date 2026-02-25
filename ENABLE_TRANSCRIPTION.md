# 🎙️ Enable Real Transcription - Simple Guide

## Current Status
✅ Audio extraction working
✅ Video processing working  
⚠️ Transcription using fallback (no real speech-to-text)

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get OpenAI API Key

1. Go to: **https://platform.openai.com/api-keys**
2. Sign up or login
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-...`)
5. Add $5-10 credits to your account

### Step 2: Add to .env File

Open your `.env` file and add this line:

```env
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
```

Example:
```env
VITE_SUPABASE_PROJECT_ID="ockralcrkozdtbmlfxgl"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://ockralcrkozdtbmlfxgl.supabase.co"
VITE_OPENAI_API_KEY=sk-proj-abc123xyz...
```

### Step 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test!

1. Upload a video
2. Check browser console
3. Look for: **"✓ Transcription successful via OpenAI"**

---

## 💰 Cost

OpenAI Whisper pricing:
- **$0.006 per minute** of audio
- 1 minute video = $0.006 (less than 1 cent!)
- 10 minute video = $0.06 (6 cents)
- 100 videos (5 min each) = $3

Very affordable! 💸

---

## 🆓 Free Alternative: Web Speech API

If you don't want to pay, the app will automatically try **Web Speech API** (browser-based):

**Pros:**
- ✅ Completely free
- ✅ No API key needed
- ✅ Works in Chrome/Edge

**Cons:**
- ❌ Only works in Chrome/Edge browsers
- ❌ Less accurate than OpenAI
- ❌ Requires microphone permission
- ❌ May not work with all video formats

---

## 🔍 How to Check if It's Working

### Method 1: Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Upload a video
4. Look for these messages:

**Success:**
```
Attempting OpenAI Whisper transcription...
✓ Transcription successful via OpenAI
```

**Fallback:**
```
OpenAI API error: ...
Using fallback transcription
```

### Method 2: Check Transcript
- After processing, the transcript should show real words from your video
- Not just "This is a X-second video segment..."

---

## 🐛 Troubleshooting

### "OpenAI API error: Incorrect API key"
- Check API key is correct in `.env`
- Make sure it starts with `sk-`
- No extra spaces or quotes

### "OpenAI API error: Insufficient credits"
- Add credits to OpenAI account
- Go to: https://platform.openai.com/account/billing

### Still using fallback?
1. Check `.env` file has `VITE_OPENAI_API_KEY`
2. Restart dev server
3. Clear browser cache
4. Check console for error messages

### API key not loading?
- Make sure variable name is exactly: `VITE_OPENAI_API_KEY`
- Restart dev server after adding to `.env`
- Check no typos in `.env` file

---

## 📝 Example .env File

```env
# Supabase (already configured)
VITE_SUPABASE_PROJECT_ID="ockralcrkozdtbmlfxgl"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ja3JhbGNya296ZHRibWxmeGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Mjg4NDAsImV4cCI6MjA4NDIwNDg0MH0.1mtRpqZ0HgB3Vuf4j0pc_UTDy-gH_4vIvbAsBfroaEI"
VITE_SUPABASE_URL="https://ockralcrkozdtbmlfxgl.supabase.co"

# OpenAI (add this line)
VITE_OPENAI_API_KEY=sk-proj-your-actual-key-here
```

---

## ✅ Success Checklist

- [ ] OpenAI account created
- [ ] API key generated
- [ ] Credits added ($5-10)
- [ ] API key added to `.env`
- [ ] Dev server restarted
- [ ] Video uploaded for testing
- [ ] Console shows "✓ Transcription successful"
- [ ] Real transcript visible (not fallback text)

---

## 🎉 That's It!

Once setup, transcription will work automatically for all videos!

Need help? Check console for error messages and refer to troubleshooting section above.
