@echo off
echo.
echo 🎙️ Setting up Real Transcription for PulsePoint AI
echo ==================================================
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Supabase CLI not found. Installing...
    npm install -g supabase
)

echo ✅ Supabase CLI found
echo.

REM Login to Supabase
echo 📝 Logging in to Supabase...
supabase login

REM Link project
echo 🔗 Linking to your project...
supabase link --project-ref ockralcrkozdtbmlfxgl

echo.
echo Choose transcription service:
echo 1) OpenAI Whisper (Most accurate, $0.006/min)
echo 2) AssemblyAI (Free tier 100hrs/month, easier setup)
echo.
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo 📋 OpenAI Whisper Setup
    echo ----------------------
    echo 1. Go to: https://platform.openai.com/api-keys
    echo 2. Create a new API key
    echo 3. Add credits to your account ($5-10 recommended)
    echo.
    set /p api_key="Enter your OpenAI API Key: "
    
    REM Deploy function
    echo 🚀 Deploying transcribe-audio function...
    supabase functions deploy transcribe-audio
    
    REM Set secret
    echo 🔐 Setting API key...
    supabase secrets set OPENAI_API_KEY=!api_key!
    
    echo.
    echo ✅ OpenAI Whisper setup complete!
    
) else if "%choice%"=="2" (
    echo.
    echo 📋 AssemblyAI Setup
    echo -------------------
    echo 1. Go to: https://www.assemblyai.com/
    echo 2. Sign up (free tier available)
    echo 3. Copy your API key from dashboard
    echo.
    set /p api_key="Enter your AssemblyAI API Key: "
    
    REM Deploy function
    echo 🚀 Deploying transcribe-audio-assemblyai function...
    supabase functions deploy transcribe-audio-assemblyai
    
    REM Set secret
    echo 🔐 Setting API key...
    supabase secrets set ASSEMBLYAI_API_KEY=!api_key!
    
    echo.
    echo ✅ AssemblyAI setup complete!
    echo.
    echo ⚠️  Note: You need to update src/pages/Index.tsx
    echo    Change 'transcribe-audio' to 'transcribe-audio-assemblyai'
    
) else (
    echo ❌ Invalid choice
    exit /b 1
)

echo.
echo 🎉 Transcription setup complete!
echo.
echo Next steps:
echo 1. Upload a video to test
echo 2. Check browser console for: '✓ Transcription successful'
echo 3. If issues, check Supabase Edge Function logs
echo.
pause
