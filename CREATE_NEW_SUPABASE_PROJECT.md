# 🚀 Create Your Own Supabase Project - Step by Step

## Step 1: Create Supabase Account & Project

### 1.1 Go to Supabase
- Open: **https://supabase.com**
- Click **"Start your project"** or **"Sign In"**

### 1.2 Sign Up/Login
- Use GitHub (recommended) or Email
- Verify your email if needed

### 1.3 Create New Organization (if first time)
- Organization name: **"PulsePoint AI"** (or your name)
- Click **"Create organization"**

### 1.4 Create New Project
1. Click **"New Project"**
2. Fill in details:
   - **Name**: `pulsepoint-ai` or `reel-creator`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you:
     - India: `ap-south-1` (Mumbai)
     - US: `us-east-1` (N. Virginia)
     - Europe: `eu-west-1` (Ireland)
   - **Pricing Plan**: Free (sufficient for development)
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup ⏳

---

## Step 2: Get Your Project Credentials

### 2.1 Go to Project Settings
1. Project created? Great!
2. Click **"Settings"** (gear icon) in left sidebar
3. Click **"API"** section

### 2.2 Copy These Values
You'll see:
- **Project URL**: `https://xxxxx.supabase.co`
- **Project API keys**:
  - `anon` `public` key (this one!)
  - `service_role` key (don't use this in frontend)

### 2.3 Get Project ID
- Look at URL: `https://supabase.com/dashboard/project/xxxxx`
- The `xxxxx` part is your **Project ID**

---

## Step 3: Update Your .env File

Open your `.env` file and replace with new values:

```env
# OLD VALUES (remove these)
# VITE_SUPABASE_PROJECT_ID="ockralcrkozdtbmlfxgl"
# VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGci..."
# VITE_SUPABASE_URL="https://ockralcrkozdtbmlfxgl.supabase.co"

# NEW VALUES (add these)
VITE_SUPABASE_PROJECT_ID="your_new_project_id"
VITE_SUPABASE_URL="https://your_project_id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_public_key"

# OpenAI (optional, for transcription)
VITE_OPENAI_API_KEY=sk-your-openai-key
```

**Example:**
```env
VITE_SUPABASE_PROJECT_ID="abcdefghijklmnop"
VITE_SUPABASE_URL="https://abcdefghijklmnop.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDE1NTc2MDAwfQ.xxxxxxxxxxxxx"
```

---

## Step 4: Deploy Edge Functions

### 4.1 Install Supabase CLI
```bash
npm install -g supabase
```

### 4.2 Login to Supabase
```bash
supabase login
```
- Browser will open
- Click "Authorize"

### 4.3 Link Your Project
```bash
supabase link --project-ref your_new_project_id
```
Replace `your_new_project_id` with actual ID from Step 2.3

### 4.4 Deploy Transcription Function
```bash
# Deploy the function
supabase functions deploy transcribe-audio

# Add OpenAI API key (if you have one)
supabase secrets set OPENAI_API_KEY=sk-your-openai-key
```

---

## Step 5: Test Everything

### 5.1 Restart Dev Server
```bash
npm run dev
```

### 5.2 Upload a Video
- Go to your app
- Upload a test video
- Check if processing works

### 5.3 Check Console
- Open DevTools (F12)
- Look for any errors
- Should see successful processing

---

## 📋 Quick Checklist

- [ ] Supabase account created
- [ ] New project created (wait 2-3 min)
- [ ] Project URL copied
- [ ] Project ID copied
- [ ] Anon/Public key copied
- [ ] `.env` file updated with new values
- [ ] Supabase CLI installed
- [ ] Logged in to Supabase CLI
- [ ] Project linked via CLI
- [ ] Edge function deployed
- [ ] Dev server restarted
- [ ] App tested with video upload

---

## 🐛 Troubleshooting

### "Project is still setting up"
- Wait 2-3 more minutes
- Refresh the page
- Check project status in dashboard

### "supabase: command not found"
```bash
npm install -g supabase
# or
npx supabase login
```

### "Failed to link project"
- Check project ID is correct
- Make sure you're logged in: `supabase login`
- Try: `supabase projects list` to see your projects

### Edge function deployment fails
- Make sure you're in project root directory
- Check `supabase/functions/transcribe-audio/index.ts` exists
- Try: `supabase functions list` to see deployed functions

### App not connecting to new project
- Check `.env` values are correct
- Restart dev server
- Clear browser cache
- Check browser console for errors

---

## 🎉 Success!

Once everything is set up, you'll have:
- ✅ Your own Supabase project
- ✅ Full control and access
- ✅ Edge functions deployed
- ✅ Transcription working (if OpenAI key added)
- ✅ No "access denied" errors!

---

## 💡 Next Steps

1. **Add OpenAI API Key** for real transcription
2. **Test with multiple videos**
3. **Deploy to production** when ready
4. **Monitor usage** in Supabase dashboard

---

## 📞 Need Help?

If you get stuck at any step, let me know which step and what error you're seeing! 😊
