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

        const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

        if (!OPENAI_API_KEY) {
            console.error("OPENAI_API_KEY not configured");
            return new Response(
                JSON.stringify({ error: "Transcription service not configured" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Create form data for OpenAI Whisper API
        const whisperFormData = new FormData();
        whisperFormData.append("file", audioFile);
        whisperFormData.append("model", "whisper-1");
        whisperFormData.append("response_format", "verbose_json");
        whisperFormData.append("timestamp_granularities[]", "word");

        // Call OpenAI Whisper API
        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: whisperFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Whisper API error:", response.status, errorText);
            return new Response(
                JSON.stringify({ error: "Transcription failed", details: errorText }),
                { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const data = await response.json();

        return new Response(
            JSON.stringify({
                transcript: data.text,
                words: data.words || [],
                duration: data.duration || 0,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error in transcribe-audio:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
