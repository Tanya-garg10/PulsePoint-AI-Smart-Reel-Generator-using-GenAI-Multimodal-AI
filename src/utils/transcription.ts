// Browser-based transcription using Web Speech API
export const transcribeWithWebSpeech = (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Check if Web Speech API is available
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            reject(new Error("Web Speech API not supported in this browser"));
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
            console.error('Speech recognition error:', event.error);
            reject(new Error(`Speech recognition error: ${event.error}`));
        };

        recognition.onend = () => {
            if (transcript.trim()) {
                resolve(transcript.trim());
            } else {
                reject(new Error("No speech detected"));
            }
        };

        // Play audio through an audio element to trigger recognition
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.onplay = () => {
            recognition.start();
        };
        audio.onended = () => {
            recognition.stop();
        };
        audio.play();
    });
};

// Extract audio from video file
export const extractAudioFromVideo = (videoUrl: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        video.crossOrigin = "anonymous";
        video.src = videoUrl;

        video.onloadedmetadata = () => {
            const source = audioContext.createMediaElementSource(video);
            const destination = audioContext.createMediaStreamDestination();
            source.connect(destination);

            const mediaRecorder = new MediaRecorder(destination.stream, {
                mimeType: "audio/webm",
            });

            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunks, { type: "audio/webm" });
                audioContext.close();
                resolve(audioBlob);
            };

            mediaRecorder.start();
            video.play();

            video.onended = () => {
                mediaRecorder.stop();
            };
        };

        video.onerror = (e) => {
            console.error("Video error during audio extraction:", e);
            reject(new Error("Failed to extract audio from video"));
        };
    });
};
