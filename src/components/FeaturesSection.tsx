import { motion } from "framer-motion";
import { 
  Upload, 
  AudioLines, 
  Brain, 
  Scissors, 
  Smartphone, 
  Subtitles,
  Download,
  Sparkles
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: Upload,
    title: "Video Upload",
    description: "Upload your long-form videos or paste a link. Supports lectures, podcasts, and workshops.",
  },
  {
    icon: AudioLines,
    title: "Audio Extraction",
    description: "Automatically extract and process audio tracks for precise transcription.",
  },
  {
    icon: Brain,
    title: "AI Transcription",
    description: "Advanced speech-to-text with timestamps using state-of-the-art AI models.",
  },
  {
    icon: Sparkles,
    title: "Emotional Peak Detection",
    description: "GenAI analyzes content to find the most impactful, engaging moments.",
  },
  {
    icon: Scissors,
    title: "Smart Segmentation",
    description: "Intelligently selects 3-5 best segments of 30-60 seconds each.",
  },
  {
    icon: Smartphone,
    title: "Vertical Format",
    description: "Converts to 9:16 format, optimized for TikTok, Reels, and Shorts.",
  },
  {
    icon: Subtitles,
    title: "Dynamic Captions",
    description: "Auto-generated captions with perfect timing and styling.",
  },
  {
    icon: Download,
    title: "Easy Export",
    description: "Download your viral-ready reels with one click.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan/5 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Powered by AI</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our intelligent pipeline transforms hours of content into scroll-stopping moments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
