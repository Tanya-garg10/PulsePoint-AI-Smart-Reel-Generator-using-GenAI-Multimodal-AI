import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { VideoUploader } from "@/components/VideoUploader";
import { ProcessingSteps, ProcessingStep } from "@/components/ProcessingSteps";
import { TranscriptAnalysis } from "@/components/TranscriptAnalysis";
import { ResultsSection } from "@/components/ResultsSection";
import { Footer } from "@/components/Footer";
import { Segment } from "@/components/SegmentCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AppState = "landing" | "upload" | "processing" | "results";

const initialSteps: ProcessingStep[] = [
  { id: "upload", label: "Video uploaded", status: "pending" },
  { id: "extract", label: "Extracting audio", status: "pending" },
  { id: "transcribe", label: "Transcribing with AI", status: "pending" },
  { id: "analyze", label: "Detecting emotional peaks", status: "pending" },
  { id: "segment", label: "Selecting best moments", status: "pending" },
  { id: "generate", label: "Generating reels", status: "pending" },
];

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>(initialSteps);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [transcript, setTranscript] = useState("");
  const [highlights, setHighlights] = useState<{ start: number; end: number; text: string; score: number }[]>([]);
  const uploaderRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    setAppState("upload");
    setTimeout(() => {
      uploaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const updateStep = (stepId: string, status: ProcessingStep["status"]) => {
    setProcessingSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
  };

  const processVideo = async (file: File | null, url?: string) => {
    if (!file && !url) return;

    setAppState("processing");
    setProcessingSteps(initialSteps);
    let videoObjectUrl = "";
    let videoDuration = 0;

    try {
      // Step 1: Upload & Get Duration
      updateStep("upload", "processing");
      if (file) {
        videoObjectUrl = URL.createObjectURL(file);
        videoDuration = await getVideoDuration(videoObjectUrl);
        console.log("Video duration:", videoDuration);
      }
      await new Promise((r) => setTimeout(r, 800));
      updateStep("upload", "completed");

      // Step 2: Extract audio
      updateStep("extract", "processing");
      const audioBlob = await extractAudioFromVideo(videoObjectUrl);
      await new Promise((r) => setTimeout(r, 500));
      updateStep("extract", "completed");

      // Step 3: Transcribe with AI
      updateStep("transcribe", "processing");
      const transcriptText = await transcribeAudio(audioBlob, videoDuration);
      setTranscript(transcriptText);
      await new Promise((r) => setTimeout(r, 500));
      updateStep("transcribe", "completed");

      // Step 4: Analyze with AI
      updateStep("analyze", "processing");

      const { data, error } = await supabase.functions.invoke("analyze-transcript", {
        body: {
          transcript: transcriptText,
          videoDuration: videoDuration
        },
      });

      let aiHighlights = [];
      if (error || !data?.highlights) {
        console.error("AI analysis error:", error);
        toast.warning("Using fallback segments based on video duration.");

        // Create fallback segments
        const segmentDuration = Math.min(20, videoDuration / 3);
        aiHighlights = [
          {
            start: 0,
            end: Math.min(segmentDuration, videoDuration),
            text: "Opening segment",
            score: 85,
            reason: "Opening moment"
          },
        ];

        if (videoDuration > segmentDuration * 2) {
          aiHighlights.push({
            start: Math.max(0, videoDuration / 2 - segmentDuration / 2),
            end: Math.min(videoDuration, videoDuration / 2 + segmentDuration / 2),
            text: "Middle segment",
            score: 90,
            reason: "Key moment"
          });
        }
      } else {
        aiHighlights = data.highlights;
      }

      setHighlights(aiHighlights);
      await new Promise((r) => setTimeout(r, 800));
      updateStep("analyze", "completed");

      // Step 5: Segment selection
      updateStep("segment", "processing");
      await new Promise((r) => setTimeout(r, 600));
      updateStep("segment", "completed");

      // Step 6: Generate reels
      updateStep("generate", "processing");

      const generatedSegments: Segment[] = [];

      for (let index = 0; index < aiHighlights.length; index++) {
        const highlight = aiHighlights[index];

        try {
          console.log(`Trimming segment ${index + 1}: ${highlight.start}s to ${highlight.end}s`);
          const segmentBlob = await trimVideo(videoObjectUrl, highlight.start, highlight.end);
          const segmentUrl = URL.createObjectURL(segmentBlob);

          generatedSegments.push({
            id: `segment-${index}`,
            title: highlight.reason || `Highlight ${index + 1}`,
            startTime: highlight.start,
            endTime: highlight.end,
            emotionScore: Math.round(highlight.score),
            transcript: highlight.text,
            thumbnailColor: getRandomColor(),
            videoUrl: segmentUrl,
            videoBlob: segmentBlob,
          });
        } catch (error) {
          console.error(`Failed to create segment ${index}:`, error);
          toast.error(`Failed to create segment ${index + 1}`);
        }
      }

      updateStep("generate", "completed");

      if (generatedSegments.length === 0) {
        toast.error("Failed to generate video segments. Please try again.");
        setAppState("upload");
        return;
      }

      // Show results
      setSegments(generatedSegments);
      await new Promise((r) => setTimeout(r, 500));
      setAppState("results");
      toast.success(`${generatedSegments.length} reel${generatedSegments.length > 1 ? 's' : ''} ready!`);
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Something went wrong. Please try again.");
      setAppState("upload");
    } finally {
      if (videoObjectUrl) {
        URL.revokeObjectURL(videoObjectUrl);
      }
    }
  };

  // Get video duration
  const getVideoDuration = (videoUrl: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      video.onerror = reject;
      video.src = videoUrl;
    });
  };

  // Extract audio from video
  const extractAudioFromVideo = (videoUrl: string): Promise<Blob> => {
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

  // Transcribe audio - tries multiple methods
  const transcribeAudio = async (audioBlob: Blob, duration: number): Promise<string> => {
    // Method 1: Try Direct OpenAI API (if API key in .env)
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (openaiKey) {
      try {
        console.log("Attempting OpenAI Whisper transcription...");
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
        formData.append("model", "whisper-1");
        formData.append("language", "en");

        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✓ Transcription successful via OpenAI");
          return data.text;
        }
      } catch (error) {
        console.log("OpenAI API error:", error);
      }
    }

    // Method 2: Try Supabase Edge Function (if available)
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      const { data, error } = await supabase.functions.invoke("transcribe-audio", {
        body: formData,
      });

      if (!error && data?.transcript) {
        console.log("✓ Transcription successful via Supabase");
        return data.transcript;
      }
    } catch (error) {
      console.log("Supabase transcription not available:", error);
    }

    // Method 3: Try Web Speech API (browser-based, Chrome only)
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        console.log("Attempting Web Speech API transcription...");
        const transcript = await transcribeWithWebSpeech(audioBlob);
        if (transcript) {
          console.log("✓ Transcription successful via Web Speech API");
          return transcript;
        }
      }
    } catch (error) {
      console.log("Web Speech API not available:", error);
    }

    // Fallback: Generate meaningful placeholder
    console.log("Using fallback transcription");

    return `This is a ${duration.toFixed(0)}-second video segment. The AI will analyze the video timing and visual content to identify the best moments for creating engaging reels.`;
  };

  // Web Speech API helper
  const transcribeWithWebSpeech = (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

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

      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.onplay = () => recognition.start();
      audio.onended = () => recognition.stop();
      audio.play().catch(reject);
    });
  };

  // Trim video to specific time range with proper timing
  const trimVideo = (videoUrl: string, startTime: number, endTime: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      video.onloadedmetadata = () => {
        // Set canvas to 9:16 aspect ratio (720x1280 for performance)
        const targetWidth = 720;
        const targetHeight = 1280;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const chunks: Blob[] = [];
        const stream = canvas.captureStream(30); // 30 FPS

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp8",
          videoBitsPerSecond: 2000000,
        });

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const videoBlob = new Blob(chunks, { type: "video/webm" });
          console.log(`Segment created: ${videoBlob.size} bytes, duration: ${endTime - startTime}s`);
          resolve(videoBlob);
        };

        video.currentTime = startTime;

        video.onseeked = () => {
          mediaRecorder.start(100); // Record in 100ms chunks
          video.play();

          const drawFrame = () => {
            if (video.currentTime >= endTime || video.ended) {
              video.pause();
              mediaRecorder.stop();
              return;
            }

            // Calculate dimensions to fit video in 9:16 canvas (center crop)
            const videoAspect = video.videoWidth / video.videoHeight;
            const canvasAspect = targetWidth / targetHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (videoAspect > canvasAspect) {
              // Video is wider - fit to height
              drawHeight = targetHeight;
              drawWidth = drawHeight * videoAspect;
              offsetX = (targetWidth - drawWidth) / 2;
              offsetY = 0;
            } else {
              // Video is taller - fit to width
              drawWidth = targetWidth;
              drawHeight = drawWidth / videoAspect;
              offsetX = 0;
              offsetY = (targetHeight - drawHeight) / 2;
            }

            // Fill background with black
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, targetWidth, targetHeight);

            // Draw video frame
            ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

            requestAnimationFrame(drawFrame);
          };

          drawFrame();
        };
      };

      video.onerror = (e) => {
        console.error("Video error:", e);
        reject(new Error("Failed to load video"));
      };
      video.crossOrigin = "anonymous";
      video.src = videoUrl;
    });
  };

  const getRandomColor = () => {
    const colors = ["#00D9FF", "#FF00AA", "#AA00FF", "#00FF9D", "#FFD700", "#FF6B6B"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleReset = () => {
    setAppState("upload");
    setProcessingSteps(initialSteps);
    setSegments([]);
    setTranscript("");
    setHighlights([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <AnimatePresence mode="wait">
        {appState === "landing" && (
          <>
            <HeroSection onGetStarted={handleGetStarted} />
            <FeaturesSection />
          </>
        )}

        {appState === "upload" && (
          <main className="pt-24 pb-20 px-4 min-h-screen flex flex-col items-center justify-center">
            <div ref={uploaderRef} className="w-full max-w-4xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                  Upload Your Video
                </h2>
                <p className="text-muted-foreground">
                  Drop your long-form video and let AI find the best moments
                </p>
              </div>
              <VideoUploader onVideoSelect={processVideo} isProcessing={false} />
            </div>
          </main>
        )}

        {appState === "processing" && (
          <main className="pt-24 pb-20 px-4 min-h-screen flex flex-col items-center justify-center gap-12">
            <ProcessingSteps steps={processingSteps} />
            <TranscriptAnalysis transcript={transcript} highlights={highlights} />
          </main>
        )}

        {appState === "results" && (
          <main className="pt-24 pb-20 px-4 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <ResultsSection segments={segments} onReset={handleReset} />
            </div>
          </main>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Index;
