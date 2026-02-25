// Direct OpenAI Whisper API transcription (client-side)

export const transcribeWithOpenAI = async (audioBlob: Blob): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error("OPENAI_API_KEY not configured");
    }

    try {
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
        formData.append("model", "whisper-1");
        formData.append("language", "en");

        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Transcription failed");
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("OpenAI transcription error:", error);
        throw error;
    }
};

// Browser-based Web Speech API transcription (free, works in Chrome)
export const transcribeWithWebSpeech = (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            reject(new Error("Web Speech API not supported"));
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        let transcript = '';

        recognition.onresult = (event: any) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    transcript += event.results[i][0].transcript + ' ';
                }
            }
        };

        recognition.onerror = (event: any) => {
            reject(new Error(`Speech recognition error: ${event.error}`));
        };

        recognition.onend = () => {
            if (transcript.trim()) {
                resolve(transcript.trim());
            } else {
                reject(new Error("No speech detected"));
            }
        };

        // Play audio to trigger recognition
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.onplay = () => recognition.start();
        audio.onended = () => recognition.stop();
        audio.onerror = () => reject(new Error("Audio playback failed"));
        audio.play().catch(reject);
    });
};
