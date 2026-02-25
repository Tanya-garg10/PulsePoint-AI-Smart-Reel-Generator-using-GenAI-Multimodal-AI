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
    const { transcript, videoDuration } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!transcript) {
      return new Response(
        JSON.stringify({ error: "No transcript provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an AI that analyzes video transcripts to identify the most emotionally impactful and engaging moments for creating short-form vertical video reels.

IMPORTANT: The video is ${videoDuration ? `${videoDuration} seconds long` : 'short-form content'}. Your time estimates MUST be within 0 to ${videoDuration || 60} seconds.

Your task is to:
1. Read the transcript carefully
2. Identify 3-5 segments that would make compelling short-form vertical video content (reels)
3. Each segment should be 15-45 seconds long (not longer!)
4. Focus on moments with: strong emotions, key insights, memorable quotes, surprising revelations, or call-to-action moments
5. Ensure start and end times are realistic and within the video duration

Return your analysis as a JSON object with accurate timestamps.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Analyze this transcript from a ${videoDuration ? `${videoDuration}-second` : 'short'} video and identify the best moments for short-form reels. Remember: timestamps must be between 0 and ${videoDuration || 60} seconds, and each segment should be 15-45 seconds long.\n\nTranscript:\n${transcript}`
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "identify_highlights",
              description: "Identify the most impactful moments from the transcript for creating viral reels",
              parameters: {
                type: "object",
                properties: {
                  highlights: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        start: {
                          type: "number",
                          description: "Estimated start time in seconds (estimate based on word position)"
                        },
                        end: {
                          type: "number",
                          description: "Estimated end time in seconds"
                        },
                        text: {
                          type: "string",
                          description: "The key quote or excerpt from this moment"
                        },
                        score: {
                          type: "number",
                          description: "Emotional impact score from 0-100"
                        },
                        reason: {
                          type: "string",
                          description: "Why this moment would make a great reel"
                        }
                      },
                      required: ["start", "end", "text", "score", "reason"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["highlights"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "identify_highlights" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const highlights = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify(highlights),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback if no tool call
    return new Response(
      JSON.stringify({ highlights: [] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-transcript:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
