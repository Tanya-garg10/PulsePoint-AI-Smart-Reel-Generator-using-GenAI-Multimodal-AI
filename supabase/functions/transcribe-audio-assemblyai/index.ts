import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const formData = await req.formData();
        const audioFile = formData.get("audio");

        if (!audioFile) {
            return new Response(
                JSON.stringify({ error: "No audio file provided" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const ASSEMBLYAI_API_KEY = Deno.env.get("ASSEMBLYAI_API_KEY");

        if (!ASSEMBLYAI_API_KEY) {
            console.error("ASSEMBLYAI_API_KEY not configured");
            return new Response(
                JSON.stringify({ error: "Transcription service not configured" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Step 1: Upload audio file to AssemblyAI
        const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
            method: "POST",
            headers: {
                authorization: ASSEMBLYAI_API_KEY,
            },
            body: audioFile,
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error("AssemblyAI upload error:", uploadResponse.status, errorText);
            return new Response(
                JSON.stringify({ error: "Failed to upload audio", details: errorText }),
                { status: uploadResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const { upload_url } = await uploadResponse.json();

        // Step 2: Request transcription
        const transcriptResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
            method: "POST",
            headers: {
                authorization: ASSEMBLYAI_API_KEY,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                audio_url: upload_url,
                language_code: "en", // Change if needed
            }),
        });

        if (!transcriptResponse.ok) {
            const errorText = await transcriptResponse.text();
            console.error("AssemblyAI transcription error:", transcriptResponse.status, errorText);
            return new Response(
                JSON.stringify({ error: "Failed to start transcription", details: errorText }),
                { status: transcriptResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const { id: transcriptId } = await transcriptResponse.json();

        // Step 3: Poll for completion
        let transcript = null;
        let attempts = 0;
        const maxAttempts = 60; // 60 seconds max wait

        while (attempts < maxAttempts) {
            const pollingResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                headers: {
                    authorization: ASSEMBLYAI_API_KEY,
                },
            });

            const pollingData = await pollingResponse.json();

            if (pollingData.status === "completed") {
                transcript = pollingData;
                break;
            } else if (pollingData.status === "error") {
                return new Response(
                    JSON.stringify({ error: "Transcription failed", details: pollingData.error }),
                    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            // Wait 1 second before polling again
            await new Promise((resolve) => setTimeout(resolve, 1000));
            attempts++;
        }

        if (!transcript) {
            return new Response(
                JSON.stringify({ error: "Transcription timeout" }),
                { status: 408, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                transcript: transcript.text,
                words: transcript.words || [],
                duration: transcript.audio_duration || 0,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error in transcribe-audio-assemblyai:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
