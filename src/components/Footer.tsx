import { Zap, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-magenta flex items-center justify-center">
            <Zap className="w-4 h-4 text-background" />
          </div>
          <span className="text-lg font-bold gradient-text">PulsePoint AI</span>
        </div>

        {/* Hackathon Credit */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-accent fill-accent" />
          <span>for ByteSize Sage AI Hackathon 2025</span>
        </div>

        {/* Copyright */}
        <div className="text-sm text-muted-foreground">
          © 2025 PulsePoint AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
