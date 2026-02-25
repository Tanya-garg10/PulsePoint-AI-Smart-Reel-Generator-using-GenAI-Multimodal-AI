import { motion } from "framer-motion";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { SegmentCard, Segment } from "./SegmentCard";

interface ResultsSectionProps {
  segments: Segment[];
  onReset: () => void;
}

export const ResultsSection = ({ segments, onReset }: ResultsSectionProps) => {
  const handleDownloadAll = () => {
    segments.forEach((segment, index) => {
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
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/20 mb-4"
        >
          <span className="text-3xl">🎉</span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Your Reels Are Ready!
        </h2>
        <p className="text-muted-foreground">
          We found {segments.length} high-impact moments in your video
        </p>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {segments.map((segment, index) => (
          <SegmentCard key={segment.id} segment={segment} index={index} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="hero" size="lg" onClick={handleDownloadAll}>
          <Download className="w-5 h-5 mr-2" />
          Download All Reels
        </Button>
        <Button variant="outline" size="lg" onClick={onReset}>
          <RefreshCw className="w-5 h-5 mr-2" />
          Process Another Video
        </Button>
      </div>
    </motion.div>
  );
};
