import { motion } from "framer-motion";
import { Check, Loader2, Circle } from "lucide-react";

export type ProcessingStep = {
  id: string;
  label: string;
  status: "pending" | "processing" | "completed" | "error";
};

interface ProcessingStepsProps {
  steps: ProcessingStep[];
}

export const ProcessingSteps = ({ steps }: ProcessingStepsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 max-w-md mx-auto"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
        Processing Pipeline
      </h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4"
          >
            {/* Status Icon */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${step.status === "completed" ? "bg-neon-green/20" : ""}
              ${step.status === "processing" ? "bg-primary/20" : ""}
              ${step.status === "pending" ? "bg-muted" : ""}
              ${step.status === "error" ? "bg-destructive/20" : ""}
            `}>
              {step.status === "completed" && (
                <Check className="w-4 h-4 text-neon-green" />
              )}
              {step.status === "processing" && (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              )}
              {step.status === "pending" && (
                <Circle className="w-4 h-4 text-muted-foreground" />
              )}
            </div>

            {/* Label */}
            <span className={`
              text-sm font-medium
              ${step.status === "completed" ? "text-neon-green" : ""}
              ${step.status === "processing" ? "text-primary" : ""}
              ${step.status === "pending" ? "text-muted-foreground" : ""}
            `}>
              {step.label}
            </span>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-4 top-8 w-0.5 h-4 bg-border" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
