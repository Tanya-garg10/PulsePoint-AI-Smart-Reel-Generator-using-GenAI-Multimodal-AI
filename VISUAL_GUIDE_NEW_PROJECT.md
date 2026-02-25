# 📸 Visual Guide - Create New Supabase Project

## 🎯 Quick Overview
Time needed: **10 minutes**
Cost: **FREE** (Free tier is enough)

---

## Part 1: Create Project (5 min)

### Screen 1: Supabase Homepage
```
┌─────────────────────────────────────────┐
│  Supabase                    [Sign In]  │
├─────────────────────────────────────────┤
│                                          │
│     Build in a weekend                   │
│     Scale to millions                    │
│                                          │
│     [Start your project] ←── Click here │
│                                          │
└─────────────────────────────────────────┘
```
**Action**: Click "Start your project" or "Sign In"

---

### Screen 2: Sign Up/Login
```
┌─────────────────────────────────────────┐
│  Sign in to Supabase                    │
├─────────────────────────────────────────┤
│                                          │
│  [Continue with GitHub] ←── Recommended │
│                                          │
│  [Continue with Email]                   │
│                                          │
└─────────────────────────────────────────┘
```
**Action**: Choose GitHub (easier) or Email

---

### Screen 3: Create Organization (First time only)
```
┌─────────────────────────────────────────┐
│  Create an organization                  │
├─────────────────────────────────────────┤
│                                          │
│  Organization name:                      │
│  [PulsePoint AI____________]            │
│                                          │
│  [Create organization]                   │
│                                          │
└─────────────────────────────────────────┘
```
**Action**: Enter name and click "Create organization"

---

### Screen 4: New Project Form
```
┌─────────────────────────────────────────┐
│  Create a new project                    │
├─────────────────────────────────────────┤
│                                          │
│  Name:                                   │
│  [pulsepoint-ai____________]            │
│                                          │
│  Database Password:                      │
│  [••••••••••••••••] [Generate]          │
│  ⚠️  Save this password!                │
│                                          │
│  Region:                                 │
│  [ap-south-1 (Mumbai)___▼]              │
│                                          │
│  Pricing Plan:                           │
│  ⚪ Free  ⚪ Pro                         │
│                                          │
│  [Create new project] ←── Click         │
│                                          │
└─────────────────────────────────────────┘
```
**Actions**:
1. Name: `pulsepoint-ai`
2. Password: Click "Generate" and SAVE IT!
3. Region: Choose closest (India = Mumbai)
4. Plan: Select "Free"
5. Click "Create new project"

---

### Screen 5: Project Creating
```
┌─────────────────────────────────────────┐
│  Setting up your project...              │
├─────────────────────────────────────────┤
│                                          │
│      🔄 Creating database                │
│      🔄 Setting up authentication        │
│      🔄 Configuring storage              │
│                                          │
│  This may take 2-3 minutes...           │
│                                          │
└─────────────────────────────────────────┘
```
**Action**: Wait patiently (grab a coffee ☕)

---

## Part 2: Get Credentials (2 min)

### Screen 6: Project Dashboard
```
┌─────────────────────────────────────────┐
│  pulsepoint-ai              [Settings]  │
├──────────┬──────────────────────────────┤
│ 📊 Home  │                              │
│ 📝 Table │  Welcome to your project!    │
│ 🔐 Auth  │                              │
│ 💾 Store │  Quick start guides...       │
│ ⚡ Func  │                              │
│ ⚙️  Set  │←── Click "Settings"         │
└──────────┴──────────────────────────────┘
```
**Action**: Click "Settings" (gear icon) in sidebar

---

### Screen 7: Settings → API
```
┌─────────────────────────────────────────┐
│  Settings                                │
├──────────┬──────────────────────────────┤
│ General  │  Project API                 │
│ Database │                              │
│ → API    │  Project URL:                │
│ Auth     │  https://abcd.supabase.co    │
│          │  [Copy] ←── Copy this!       │
│          │                              │
│          │  API Keys:                   │
│          │                              │
│          │  anon public                 │
│          │  eyJhbGciOiJIUzI1NiIsInR5... │
│          │  [Copy] ←── Copy this!       │
│          │                              │
│          │  service_role (secret)       │
│          │  eyJhbGciOiJIUzI1NiIsInR5... │
│          │  ⚠️  Don't use in frontend   │
└──────────┴──────────────────────────────┘
```
**Actions**:
1. Copy **Project URL**
2. Copy **anon public** key (NOT service_role!)
3. Note down **Project ID** from URL

---

## Part 3: Update Your App (3 min)

### Step 1: Open .env File
```
📁 Your Project
├── 📁 src
├── 📁 public
├── 📄 .env ←── Open this file
├── 📄 package.json
└── ...
```

### Step 2: Replace Values
**OLD .env:**
```env
VITE_SUPABASE_PROJECT_ID="ockralcrkozdtbmlfxgl"
VITE_SUPABASE_URL="https://ockralcrkozdtbmlfxgl.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGci..."
```

**NEW .env:**
```env
VITE_SUPABASE_PROJECT_ID="your_new_project_id"
VITE_SUPABASE_URL="https://your_project_id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your_new_anon_key"
```

### Step 3: Terminal Commands
```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link project (replace with your ID)
supabase link --project-ref your_project_id

# 4. Deploy function
supabase functions deploy transcribe-audio

# 5. Add OpenAI key (optional)
supabase secrets set OPENAI_API_KEY=sk-your-key

# 6. Restart dev server
npm run dev
```

---

## ✅ Verification Checklist

After setup, verify:

### 1. Project Created
- [ ] Project visible in Supabase dashboard
- [ ] Status shows "Active" (not "Setting up")

### 2. Credentials Copied
- [ ] Project ID copied
- [ ] Project URL copied
- [ ] Anon/Public key copied (NOT service_role)

### 3. .env Updated
- [ ] Old values replaced
- [ ] No extra spaces or quotes
- [ ] File saved

### 4. CLI Setup
- [ ] Supabase CLI installed
- [ ] Logged in successfully
- [ ] Project linked

### 5. Functions Deployed
- [ ] transcribe-audio function deployed
- [ ] No deployment errors
- [ ] Function visible in dashboard

### 6. App Working
- [ ] Dev server restarted
- [ ] No console errors
- [ ] Can upload videos
- [ ] Processing works

---

## 🎉 Success Indicators

You'll know it's working when:

1. **No "access denied" errors**
2. **Video upload works**
3. **Processing completes**
4. **Reels are generated**
5. **Console shows**: "✓ Transcription successful" (if OpenAI key added)

---

## 🆘 Common Issues

### Issue 1: "Project still setting up"
**Solution**: Wait 2-3 more minutes, refresh page

### Issue 2: "Invalid API key"
**Solution**: 
- Check you copied "anon public" key (not service_role)
- No extra spaces in .env
- Restart dev server

### Issue 3: "supabase: command not found"
**Solution**:
```bash
npm install -g supabase
# or use npx
npx supabase login
```

### Issue 4: "Failed to link project"
**Solution**:
- Check project ID is correct
- Make sure logged in: `supabase login`
- Try: `supabase projects list`

---

## 📞 Need Help?

Stuck at any screen? Let me know:
- Which screen you're on
- What error you see
- Screenshot if possible

I'll help you through it! 😊
