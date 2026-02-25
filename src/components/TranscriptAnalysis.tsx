import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

interface TranscriptAnalysisProps {
  transcript: string;
  highlights: { start: number; end: number; text: string; score: number }[];
}

export const TranscriptAnalysis = ({ transcript, highlights }: TranscriptAnalysisProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 max-w-3xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/20 to-magenta/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Analysis</h3>
          <p className="text-sm text-muted-foreground">Emotional peaks detected</p>
        </div>
      </div>

      {/* Transcript with highlights */}
      <div className="relative p-4 rounded-lg bg-muted/30 max-h-64 overflow-y-auto">
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {transcript || "Transcript will appear here after processing..."}
        </p>
      </div>

      {/* Detected Highlights */}
      {highlights.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Detected Highlights
          </h4>
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {highlight.score}%
              </div>
              <div>
                <p className="text-sm text-foreground line-clamp-2">"{highlight.text}"</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.floor(highlight.start / 60)}:{(highlight.start % 60).toString().padStart(2, "0")} - 
                  {Math.floor(highlight.end / 60)}:{(highlight.end % 60).toString().padStart(2, "0")}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
