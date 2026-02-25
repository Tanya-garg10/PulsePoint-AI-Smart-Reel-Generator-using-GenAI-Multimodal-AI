# 🚀 PulsePoint AI

**Mastering the Attention Economy with GenAI & Multimodal Intelligence**

PulsePoint AI is a GenAI-powered web application that transforms long-form educational videos (lectures, podcasts, workshops) into **3–5 short, high-impact social media reels** automatically.

It uses **AI + multimodal processing** to detect emotional and insightful moments, making content more **snackable, engaging, and shareable** for platforms like Instagram Reels, TikTok, and YouTube Shorts.

## 🎯 Problem Statement

Creators and educators produce hours of valuable content, but modern audiences prefer **60-second clips**.
Manually finding and editing the best moments is time-consuming.

PulsePoint AI solves this by:

* Identifying **emotional peaks** using AI
* Extracting **high-impact moments automatically**
* Generating short reels from long videos
* Simplifying content repurposing

## 🧠 Key Features

* Video upload interface
* Transcript analysis & emotional peak detection
* AI-based segment selection
* Automatic reel generation
* Clean, modern UI with Tailwind
* Supabase integration for backend services

> ⚠️ **Prototype Note:**
> The *Download Reels* button is currently under final development.
> However, reel generation and AI processing pipelines are functional.

## 🛠️ Tech Stack

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | React + Vite + TypeScript     |
| Styling  | Tailwind CSS                  |
| Backend  | Supabase                      |
| AI       | GenAI (Gemini / GPT), Whisper |
| Video    | AI-based segmentation         |
| Tools    | Bun / Node.js                 |

## 📁 Project Structure

```
PulsePoint-AI/
│
├── public/
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── FeatureCard.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProcessingSteps.tsx
│   │   ├── ResultsSection.tsx
│   │   ├── SegmentCard.tsx
│   │   ├── TranscriptAnalysis.tsx
│   │   └── VideoUploader.tsx
│   │
│   ├── hooks/
│   ├── integrations/supabase/
│   ├── lib/
│   ├── pages/
│   └── test/
│
├── supabase/
├── .env
├── App.tsx
├── main.tsx
├── index.html
└── README.md
```

## ⚙️ How It Works

1. User uploads a long-form video
2. Video is processed via backend
3. Transcript is generated
4. AI identifies emotional peaks
5. Best 3–5 segments are selected
6. Reels are generated
7. Results are displayed in the UI

## 🖥️ Demo Video
https://drive.google.com/file/d/125-y8rN0WpfDhvlyiuJbhvJ3zLln3gso/view?usp=drive_link

The demo shows:
* Video upload
* AI processing
* Reel generation

## 🚀 How to Run Locally

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Start Development Server

```bash
npm run dev
```

### 3️⃣ Open in Browser

```
http://localhost:5173
```

## 📊 Sample Output

* 3–5 short reels
* Each 30–60 seconds
* Focused on emotional / insightful moments
* Ready for social media sharing

## 🔮 Future Enhancements

* Fully functional reel downloads
* Vertical 9:16 smart cropping
* Face tracking
* Auto captions
* Cloud deployment

## 🏁 Conclusion

PulsePoint AI demonstrates how **GenAI + Multimodal Intelligence** can transform long-form educational content into viral short-form media, helping creators save time and maximize reach.

