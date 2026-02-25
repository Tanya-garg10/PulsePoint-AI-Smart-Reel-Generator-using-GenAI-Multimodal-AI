import { motion } from "framer-motion";
import { Play, Download, Clock, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useState } from "react";

export interface Segment {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  emotionScore: number;
  transcript: string;
  thumbnailColor: string;
  videoUrl?: string;
  videoBlob?: Blob;
}

interface SegmentCardProps {
  segment: Segment;
  index: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const SegmentCard = ({ segment, index }: SegmentCardProps) => {
  const duration = segment.endTime - segment.startTime;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (segment.videoBlob) {
      const url = URL.createObjectURL(segment.videoBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reel-${index + 1}-${segment.title.replace(/\s+/g, "-").toLowerCase()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="glass-card overflow-hidden group"
    >
      {/* Thumbnail/Preview Area */}
      <div
        className="relative h-48 flex items-center justify-center bg-black"
      >
        {segment.videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={segment.videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              playsInline
              onEnded={() => setIsPlaying(false)}
            />
            {/* Play/Pause Button */}
            <Button
              variant="glass"
              size="icon"
              className="w-14 h-14 rounded-full z-10 relative"
              onClick={handlePlayPause}
            >
              <Play className={`w-6 h-6 text-primary ${isPlaying ? "hidden" : "fill-primary"}`} />
              {isPlaying && (
                <div className="w-6 h-6 flex gap-1 items-center justify-center">
                  <div className="w-1.5 h-5 bg-primary rounded-sm" />
                  <div className="w-1.5 h-5 bg-primary rounded-sm" />
                </div>
              )}
            </Button>
          </>
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${segment.thumbnailColor}40 0%, hsl(var(--card)) 100%)`
              }}
            />
            {/* 9:16 Aspect Ratio Indicator */}
            <div className="absolute inset-4 border-2 border-dashed border-foreground/20 rounded-lg flex items-center justify-center">
              <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">9:16</span>
            </div>

            {/* Play Button */}
            <Button
              variant="glass"
              size="icon"
              className="w-14 h-14 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            >
              <Play className="w-6 h-6 text-primary fill-primary" />
            </Button>
          </>
        )}

        {/* Reel Number Badge */}
        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded z-10">
          Reel #{index + 1}
        </div>

        {/* Emotion Score */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs z-10">
          <TrendingUp className="w-3 h-3 text-neon-green" />
          <span className="text-neon-green font-semibold">{segment.emotionScore}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h4 className="font-semibold text-foreground mb-2 line-clamp-1">
          {segment.title}
        </h4>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          "{segment.transcript}"
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTime(segment.startTime)} - {formatTime(segment.endTime)}</span>
          </div>
          <span>{duration.toFixed(0)}s</span>
        </div>

        {/* Actions */}
        <Button
          variant="glow"
          size="sm"
          className="w-full"
          onClick={handleDownload}
          disabled={!segment.videoBlob}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Reel
        </Button>
      </div>
    </motion.div>
  );
};
