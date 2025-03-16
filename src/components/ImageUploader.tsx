
import React, { useCallback, useState, useRef } from "react";
import { UploadCloud, X, ImagePlus } from "lucide-react";
import AnimatedButton from "./AnimatedButton";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onAddImages: (files: FileList | File[]) => void;
  isProcessing: boolean;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onAddImages, 
  isProcessing,
  className 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddImages(e.dataTransfer.files);
    }
  }, [onAddImages]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddImages(e.target.files);
      // Reset input value so the same file can be uploaded again
      e.target.value = '';
    }
  }, [onAddImages]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={cn(
      "relative w-full",
      className
    )}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 bg-background",
          "flex flex-col items-center justify-center gap-4 text-center",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-secondary/50",
          isProcessing && "opacity-50 pointer-events-none"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center bg-primary/10",
          "transition-transform duration-500",
          isDragging ? "scale-110 animate-pulse-subtle" : ""
        )}>
          <UploadCloud 
            className={cn(
              "w-8 h-8 text-primary transition-all duration-500",
              isDragging ? "scale-110" : ""
            )} 
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Drag & drop your images here</h3>
          <p className="text-sm text-muted-foreground">
            or click to browse your files
          </p>
        </div>

        <AnimatedButton 
          variant="outline" 
          size="sm"
          onClick={triggerFileInput}
          disabled={isProcessing}
          className="mt-2"
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          Select Images
        </AnimatedButton>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isProcessing}
        />

        {isDragging && (
          <div className="absolute inset-0 border-2 border-primary rounded-xl bg-primary/5 flex items-center justify-center animate-pulse z-10">
            <p className="font-medium text-primary">Drop images to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
