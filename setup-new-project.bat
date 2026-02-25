@echo off
echo.
echo ========================================
echo   PulsePoint AI - New Project Setup
echo ========================================
echo.

echo Step 1: Install Supabase CLI
echo ----------------------------
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Supabase CLI...
    npm install -g supabase
) else (
    echo ✓ Supabase CLI already installed
)
echo.

echo Step 2: Login to Supabase
echo --------------------------
echo Opening browser for authentication...
supabase login
echo.

echo Step 3: Get Your Project Details
echo ---------------------------------
echo.
echo Please go to: https://supabase.com/dashboard
echo.
echo 1. Create a new project (if not created)
echo 2. Wait 2-3 minutes for setup
echo 3. Go to Settings → API
echo 4. Copy the following values:
echo.
set /p PROJECT_ID="Enter your Project ID: "
set /p PROJECT_URL="Enter your Project URL (https://xxx.supabase.co): "
set /p ANON_KEY="Enter your Anon/Public Key: "
echo.

echo Step 4: Update .env File
echo -------------------------
echo Creating backup of old .env...
copy .env .env.backup >nul 2>nul

echo Writing new .env file...
(
echo # Supabase Configuration
echo VITE_SUPABASE_PROJECT_ID="%PROJECT_ID%"
echo VITE_SUPABASE_URL="%PROJECT_URL%"
echo VITE_SUPABASE_PUBLISHABLE_KEY="%ANON_KEY%"
echo.
echo # OpenAI ^(optional, for transcription^)
echo # VITE_OPENAI_API_KEY=sk-your-key-here
) > .env

echo ✓ .env file updated
echo.

echo Step 5: Link Project
echo --------------------
echo Linking to your Supabase project...
supabase link --project-ref %PROJECT_ID%
echo.

echo Step 6: Deploy Edge Functions
echo ------------------------------
set /p DEPLOY="Do you want to deploy transcription function? (y/n): "
if /i "%DEPLOY%"=="y" (
    echo Deploying transcribe-audio function...
    supabase functions deploy transcribe-audio
    echo.
    
    set /p HAS_OPENAI="Do you have an OpenAI API key? (y/n): "
    if /i "%HAS_OPENAI%"=="y" (
        set /p OPENAI_KEY="Enter your OpenAI API key: "
        supabase secrets set OPENAI_API_KEY=!OPENAI_KEY!
        echo ✓ OpenAI API key configured
    )
)
echo.

echo ========================================
echo   Setup Complete! 🎉
echo ========================================
echo.
echo Next steps:
echo 1. Restart your dev server: npm run dev
echo 2. Upload a test video
echo 3. Check browser console for any errors
echo.
echo Your old .env is backed up as .env.backup
echo.
pause
