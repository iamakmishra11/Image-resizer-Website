
import React from "react";
import { X, Download, AlertCircle, Clock } from "lucide-react";
import { ImageFile } from "@/hooks/useImageResizer";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/utils/imageUtils";
import AnimatedButton from "./AnimatedButton";

interface ImagePreviewProps {
  image: ImageFile;
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  image, 
  onRemove, 
  onDownload 
}) => {
  const { 
    id, 
    file, 
    previewUrl, 
    originalSize, 
    resizedSize, 
    isProcessing, 
    isProcessed, 
    error 
  } = image;

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(id);
  };

  const sizeReduction = resizedSize 
    ? Math.round((1 - (resizedSize / originalSize)) * 100) 
    : 0;

  return (
    <div 
      className={cn(
        "group relative rounded-lg overflow-hidden bg-card border shadow-sm",
        "transition-all duration-300 hover:shadow-md",
        isProcessing ? "animate-pulse" : "",
        "flex flex-col h-full"
      )}
    >
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <button
          onClick={handleRemove}
          className="p-1 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm transition-all"
          aria-label="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Image preview */}
      <div className="relative aspect-square overflow-hidden bg-black/5">
        <img
          src={previewUrl}
          alt={file.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isProcessing && "opacity-50 blur-[2px]",
            error && "opacity-70"
          )}
        />
        
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm">
            <div className="flex flex-col items-center text-destructive">
              <AlertCircle className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Image details */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-medium text-sm truncate" title={file.name}>
          {file.name}
        </h3>
        
        <div className="mt-1 text-xs text-muted-foreground space-y-1 flex-1">
          <p>Original: {formatFileSize(originalSize)}</p>
          
          {isProcessed && resizedSize && (
            <>
              <p>Resized: {formatFileSize(resizedSize)}</p>
              <p className="text-primary font-medium">
                {sizeReduction > 0 
                  ? `Reduced by ${sizeReduction}%` 
                  : "No size reduction"}
              </p>
            </>
          )}

          {!isProcessed && !error && !isProcessing && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              <span>Waiting to process</span>
            </div>
          )}
        </div>

        {isProcessed && !error && (
          <AnimatedButton
            onClick={handleDownload}
            className="mt-2 w-full"
            size="sm"
            variant="outline"
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </AnimatedButton>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
