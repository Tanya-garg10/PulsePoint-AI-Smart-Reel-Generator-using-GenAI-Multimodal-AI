import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Film, X, Loader2, Link as LinkIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface VideoUploaderProps {
  onVideoSelect: (file: File | null, url?: string) => void;
  isProcessing: boolean;
}

export const VideoUploader = ({ onVideoSelect, isProcessing }: VideoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      onVideoSelect(file);
    }
  }, [onVideoSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onVideoSelect(file);
    }
  }, [onVideoSelect]);

  const handleUrlSubmit = useCallback(() => {
    if (videoUrl.trim()) {
      onVideoSelect(null, videoUrl);
    }
  }, [videoUrl, onVideoSelect]);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setVideoUrl("");
    onVideoSelect(null);
  }, [onVideoSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6 justify-center">
        <Button
          variant={uploadMode === "file" ? "default" : "ghost"}
          size="sm"
          onClick={() => setUploadMode("file")}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
        <Button
          variant={uploadMode === "url" ? "default" : "ghost"}
          size="sm"
          onClick={() => setUploadMode("url")}
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Paste URL
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {uploadMode === "file" ? (
          <motion.div
            key="file-upload"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                ${isDragging 
                  ? "border-primary bg-primary/10 scale-[1.02]" 
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
                }
                ${selectedFile ? "border-neon-green bg-neon-green/5" : ""}
              `}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <p className="text-foreground font-medium">Processing your video...</p>
                  <p className="text-sm text-muted-foreground">This may take a few moments</p>
                </div>
              ) : selectedFile ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center">
                    <Film className="w-8 h-8 text-neon-green" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearSelection}>
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium mb-2">
                    Drop your video here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports MP4, MOV, AVI, MKV (Max 500MB)
                  </p>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="url-upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8"
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Paste video URL (YouTube, Drive, etc.)"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleUrlSubmit} disabled={!videoUrl.trim() || isProcessing}>
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Process"
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Supports YouTube, Google Drive, Vimeo, and direct video links
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
