# Real Transcription Setup Guide

## Option 1: Supabase Dashboard (Recommended)

### Step 1: Get OpenAI API Key
1. Go to https://platform.openai.com/
2. Sign up or login
3. Navigate to "API Keys" in left sidebar
4. Click "Create new secret key"
5. Copy the key (it will only show once!)
6. Add some credits to your OpenAI account ($5-10 is enough for testing)

### Step 2: Add to Supabase
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **ockralcrkozdtbmlfxgl**
3. Click on **"Edge Functions"** in left sidebar
4. Click on **"transcribe-audio"** function
5. Go to **"Secrets"** tab
6. Click **"Add new secret"**
7. Name: `OPENAI_API_KEY`
8. Value: Paste your OpenAI API key
9. Click **"Save"**

### Step 3: Deploy the Function
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref ockralcrkozdtbmlfxgl

# Deploy the transcribe-audio function
supabase functions deploy transcribe-audio

# Set the secret
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

### Step 4: Test
Upload a video and check if transcription works!

---

## Option 2: Local .env File (For Development)

If you want to test locally first:

1. Create a file: `supabase/.env.local`
2. Add this line:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Run locally:
   ```bash
   supabase functions serve transcribe-audio --env-file supabase/.env.local
   ```

---

## Option 3: Alternative - AssemblyAI (Easier & Free Tier)

AssemblyAI has a generous free tier and is easier to set up:

### Step 1: Get AssemblyAI API Key
1. Go to https://www.assemblyai.com/
2. Sign up (free tier available)
3. Get your API key from dashboard

### Step 2: Create AssemblyAI Function

I can create a new function that uses AssemblyAI instead of OpenAI Whisper.
AssemblyAI is:
- ✅ Free tier available (100 hours/month)
- ✅ Easier to use
- ✅ Better for longer videos
- ✅ Provides word-level timestamps

Would you like me to create the AssemblyAI version?

---

## Checking if Transcription is Working

After setup, check browser console:
- ✅ Success: "✓ Transcription successful"
- ❌ Fallback: "Transcription failed, using fallback"

---

## Cost Estimate (OpenAI Whisper)

- **Price**: $0.006 per minute of audio
- **Example**: 
  - 1 minute video = $0.006 (less than 1 cent)
  - 10 minute video = $0.06 (6 cents)
  - 100 videos (5 min each) = $3

Very affordable for testing and production!

---

## Troubleshooting

### "Transcription service not configured"
- API key not set in Supabase secrets
- Function not deployed

### "Transcription failed"
- Check OpenAI account has credits
- Check API key is correct
- Check function logs in Supabase dashboard

### Still using fallback?
- Open browser DevTools → Console
- Look for error messages
- Check Supabase Edge Function logs
