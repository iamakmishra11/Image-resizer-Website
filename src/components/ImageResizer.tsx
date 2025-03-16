
import React from "react";
import { useImageResizer } from "@/hooks/useImageResizer";
import ImageUploader from "./ImageUploader";
import ImagePreview from "./ImagePreview";
import ResizeOptions from "./ResizeOptions";
import AnimatedButton from "./AnimatedButton";
import { Download, Settings2, Trash2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const ImageResizer: React.FC = () => {
  const {
    images,
    options,
    isProcessing,
    progress,
    addImages,
    removeImage,
    clearImages,
    updateOptions,
    resizeImages,
    downloadAllImages,
    downloadImage,
  } = useImageResizer();

  const hasImages = images.length > 0;
  const hasProcessedImages = images.some((img) => img.isProcessed);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - options and uploader */}
        <div className="w-full md:w-1/3 space-y-6">
          <ResizeOptions
            width={options.width}
            height={options.height}
            maintainAspectRatio={options.maintainAspectRatio}
            format={options.format}
            quality={options.quality}
            onUpdate={updateOptions}
            className="animate-slide-up [animation-delay:200ms]"
          />

          <div className="animate-slide-up [animation-delay:300ms]">
            <ImageUploader onAddImages={addImages} isProcessing={isProcessing} />
          </div>

          {hasImages && (
            <div className="space-y-4 animate-slide-up [animation-delay:400ms]">
              <div className="flex flex-col space-y-3">
                <AnimatedButton
                  onClick={resizeImages}
                  isLoading={isProcessing}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resize All Images
                </AnimatedButton>

                {hasProcessedImages && (
                  <AnimatedButton
                    onClick={downloadAllImages}
                    variant="outline"
                    isLoading={isProcessing}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All Images
                  </AnimatedButton>
                )}

                <AnimatedButton
                  onClick={clearImages}
                  variant="ghost"
                  disabled={isProcessing}
                  className="w-full text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Images
                </AnimatedButton>
              </div>

              {isProcessing && (
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column - image previews */}
        <div className="w-full md:w-2/3">
          {!hasImages ? (
            <div className="h-64 border-2 border-dashed rounded-xl flex items-center justify-center bg-muted/30 animate-fade-in">
              <div className="text-center text-muted-foreground">
                <Settings2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No images added yet</p>
                <p className="max-w-md mx-auto mt-2 text-sm">
                  Upload images to get started with resizing. You can upload
                  multiple images at once.
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">
                  Images ({images.length})
                </h2>
                <div className="text-sm text-muted-foreground">
                  {hasProcessedImages
                    ? `${
                        images.filter((img) => img.isProcessed).length
                      } of ${images.length} processed`
                    : "Ready to process"}
                </div>
              </div>

              <div
                className={cn(
                  "grid gap-4",
                  images.length > 8
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                    : images.length > 3
                    ? "grid-cols-2 sm:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2"
                )}
              >
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className={cn(
                      "animate-scale-in",
                      `[animation-delay:${index * 50}ms]`
                    )}
                  >
                    <ImagePreview
                      image={image}
                      onRemove={removeImage}
                      onDownload={downloadImage}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageResizer;
