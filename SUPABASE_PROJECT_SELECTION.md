# Supabase Project Kaise Select Karein

## Step-by-Step Guide with Screenshots

### Step 1: Supabase Dashboard Open Karo
1. Browser mein jao: **https://supabase.com/dashboard**
2. Login karo (agar already logged in nahi ho)

### Step 2: Project Select Karo

#### Method 1: Dashboard Se
1. Login karne ke baad, aapko **"All Projects"** page dikhega
2. Apna project dhundo jiska naam hai ya project ID hai: **ockralcrkozdtbmlfxgl**
3. Project card pe **click** karo

#### Method 2: Top-Left Dropdown Se
1. Agar already kisi project mein ho, toh **top-left corner** mein project name dikhega
2. Us pe click karo
3. Dropdown menu khulega with all your projects
4. Apna project select karo: **ockralcrkozdtbmlfxgl**

### Step 3: Confirm Karo
- URL check karo, yeh hona chahiye:
  ```
  https://supabase.com/dashboard/project/ockralcrkozdtbmlfxgl
  ```
- Top-left mein project name confirm karo

---

## Agar Project Nahi Dikh Raha?

### Check 1: Correct Account?
- Top-right corner mein profile icon pe click karo
- Check karo ki correct email se logged in ho

### Check 2: Organization Check Karo
- Some projects organizations ke under hote hain
- Top-left mein organization dropdown check karo
- Sahi organization select karo

### Check 3: Project Link from .env
Aapki `.env` file mein yeh details hain:
```
VITE_SUPABASE_PROJECT_ID="ockralcrkozdtbmlfxgl"
VITE_SUPABASE_URL="https://ockralcrkozdtbmlfxgl.supabase.co"
```

Direct link:
**https://supabase.com/dashboard/project/ockralcrkozdtbmlfxgl**

---

## Edge Functions Kaise Access Karein

Project select karne ke baad:

1. **Left Sidebar** mein scroll karo
2. **"Edge Functions"** option dhundo (icon: ⚡ lightning bolt)
3. Click karo

Agar Edge Functions option nahi dikh raha:
- Scroll down karo sidebar mein
- Ya **"More"** / **"..."** option check karo
- Ya directly jao: https://supabase.com/dashboard/project/ockralcrkozdtbmlfxgl/functions

---

## Quick Links (Direct Access)

### Your Project Dashboard:
```
https://supabase.com/dashboard/project/ockralcrkozdtbmlfxgl
```

### Edge Functions:
```
https://supabase.com/dashboard/project/ockralcrkozdtbmlfxgl/functions
```

### Settings (for API keys):
```
https://supabase.com/dashboard/project/ockralcrkozdtbmlfxgl/settings/api
```

---

## Visual Guide

```
┌─────────────────────────────────────────────────┐
│  Supabase Dashboard                    [Profile]│
├─────────────────────────────────────────────────┤
│                                                  │
│  [Project Dropdown ▼]  ockralcrkozdtbmlfxgl    │
│                                                  │
│  ┌─ Sidebar ────────┐                          │
│  │ 🏠 Home          │                          │
│  │ 📊 Table Editor  │                          │
│  │ 🔐 Authentication│                          │
│  │ 💾 Storage       │                          │
│  │ ⚡ Edge Functions│ ← Click here!            │
│  │ 📝 SQL Editor    │                          │
│  │ ⚙️  Settings     │                          │
│  └──────────────────┘                          │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Agar Phir Bhi Problem Ho

### Option 1: Direct URL Use Karo
Browser mein paste karo:
```
https://supabase.com/dashboard/project/ockralcrkozdtbmlfxgl/functions
```

### Option 2: CLI Se Link Karo
Terminal mein run karo:
```bash
supabase login
supabase link --project-ref ockralcrkozdtbmlfxgl
```

### Option 3: New Tab Mein Kholo
- Right-click on project
- "Open in new tab"

---

## Next Steps After Project Selection

1. ✅ Project selected
2. ✅ Edge Functions page open
3. ➡️ Now create/deploy transcription function
4. ➡️ Add API key secrets
5. ➡️ Test transcription!

---

## Need Help?

Agar koi step clear nahi hai, batao main aur detail mein explain karunga! 😊
