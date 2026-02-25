#!/bin/bash

echo "🎙️ Setting up Real Transcription for PulsePoint AI"
echo "=================================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo "✅ Supabase CLI found"
echo ""

# Login to Supabase
echo "📝 Logging in to Supabase..."
supabase login

# Link project
echo "🔗 Linking to your project..."
supabase link --project-ref ockralcrkozdtbmlfxgl

echo ""
echo "Choose transcription service:"
echo "1) OpenAI Whisper (Most accurate, $0.006/min)"
echo "2) AssemblyAI (Free tier 100hrs/month, easier setup)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" == "1" ]; then
    echo ""
    echo "📋 OpenAI Whisper Setup"
    echo "----------------------"
    echo "1. Go to: https://platform.openai.com/api-keys"
    echo "2. Create a new API key"
    echo "3. Add credits to your account ($5-10 recommended)"
    echo ""
    read -p "Enter your OpenAI API Key: " api_key
    
    # Deploy function
    echo "🚀 Deploying transcribe-audio function..."
    supabase functions deploy transcribe-audio
    
    # Set secret
    echo "🔐 Setting API key..."
    supabase secrets set OPENAI_API_KEY="$api_key"
    
    echo ""
    echo "✅ OpenAI Whisper setup complete!"
    
elif [ "$choice" == "2" ]; then
    echo ""
    echo "📋 AssemblyAI Setup"
    echo "-------------------"
    echo "1. Go to: https://www.assemblyai.com/"
    echo "2. Sign up (free tier available)"
    echo "3. Copy your API key from dashboard"
    echo ""
    read -p "Enter your AssemblyAI API Key: " api_key
    
    # Deploy function
    echo "🚀 Deploying transcribe-audio-assemblyai function..."
    supabase functions deploy transcribe-audio-assemblyai
    
    # Set secret
    echo "🔐 Setting API key..."
    supabase secrets set ASSEMBLYAI_API_KEY="$api_key"
    
    # Update frontend to use AssemblyAI function
    echo "📝 Updating frontend configuration..."
    sed -i 's/transcribe-audio/transcribe-audio-assemblyai/g' src/pages/Index.tsx
    
    echo ""
    echo "✅ AssemblyAI setup complete!"
    
else
    echo "❌ Invalid choice"
    exit 1
fi

echo ""
echo "🎉 Transcription setup complete!"
echo ""
echo "Next steps:"
echo "1. Upload a video to test"
echo "2. Check browser console for: '✓ Transcription successful'"
echo "3. If issues, check Supabase Edge Function logs"
echo ""
