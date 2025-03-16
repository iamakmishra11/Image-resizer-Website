
import { useState, useCallback } from "react";
import { resizeImage, createZipFromBlobs } from "@/utils/imageUtils";
import { toast } from "sonner";

export interface ImageFile {
  id: string;
  file: File;
  originalSize: number;
  previewUrl: string;
  resizedBlob?: Blob;
  resizedSize?: number;
  isProcessing: boolean;
  isProcessed: boolean;
  error?: string;
}

interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  format: "image/jpeg" | "image/png" | "image/webp";
  quality: number;
}

interface UseImageResizerReturn {
  images: ImageFile[];
  options: ResizeOptions;
  isProcessing: boolean;
  progress: number;
  addImages: (files: FileList | File[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  updateOptions: (newOptions: Partial<ResizeOptions>) => void;
  resizeImages: () => Promise<void>;
  downloadAllImages: () => Promise<void>;
  downloadImage: (id: string) => void;
}

export const useImageResizer = (): UseImageResizerReturn => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [options, setOptions] = useState<ResizeOptions>({
    width: 1200,
    height: 800,
    maintainAspectRatio: true,
    format: "image/jpeg",
    quality: 0.8,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Add images to the list
  const addImages = useCallback(async (files: FileList | File[]) => {
    try {
      const fileArray = Array.from(files);
      const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      
      // Filter only image files
      const imageFiles = fileArray.filter(file => imageTypes.includes(file.type));
      
      if (imageFiles.length === 0) {
        toast.error("Please select valid image files");
        return;
      }
      
      // Create preview URLs
      const newImages: ImageFile[] = await Promise.all(
        imageFiles.map(async (file) => {
          // Create a preview URL
          const previewUrl = URL.createObjectURL(file);
          
          return {
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            originalSize: file.size,
            previewUrl,
            isProcessing: false,
            isProcessed: false,
          };
        })
      );
      
      setImages(prev => [...prev, ...newImages]);
      
      if (newImages.length > 0) {
        toast.success(`Added ${newImages.length} image${newImages.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error("Error adding images:", error);
      toast.error("Error adding images");
    }
  }, []);

  // Remove an image from the list
  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image?.previewUrl) {
        URL.revokeObjectURL(image.previewUrl);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  // Clear all images
  const clearImages = useCallback(() => {
    setImages(prev => {
      // Clean up all preview URLs
      prev.forEach(img => {
        if (img.previewUrl) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
      return [];
    });
  }, []);

  // Update resize options
  const updateOptions = useCallback((newOptions: Partial<ResizeOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  // Resize all images based on current options
  const resizeImages = useCallback(async () => {
    if (images.length === 0) {
      toast.error("No images to resize");
      return;
    }
    
    try {
      setIsProcessing(true);
      setProgress(0);
      
      // Mark all images as processing
      setImages(prev => 
        prev.map(img => ({ ...img, isProcessing: true, isProcessed: false, error: undefined }))
      );
      
      const total = images.length;
      let processed = 0;
      
      const resizedImages = await Promise.all(
        images.map(async (image, index) => {
          try {
            // Add slight delay between processing each image to show animation
            await new Promise(resolve => setTimeout(resolve, index * 100));
            
            const resizedBlob = await resizeImage(
              image.file,
              options.width,
              options.height,
              options.maintainAspectRatio,
              options.format,
              options.quality
            );
            
            processed++;
            setProgress((processed / total) * 100);
            
            return {
              ...image,
              resizedBlob,
              resizedSize: resizedBlob.size,
              isProcessing: false,
              isProcessed: true,
            };
          } catch (error) {
            processed++;
            setProgress((processed / total) * 100);
            
            return {
              ...image,
              isProcessing: false,
              isProcessed: false,
              error: "Failed to resize",
            };
          }
        })
      );
      
      setImages(resizedImages);
      
      const successCount = resizedImages.filter(img => img.isProcessed).length;
      const errorCount = resizedImages.filter(img => img.error).length;
      
      if (successCount > 0) {
        toast.success(`Successfully resized ${successCount} image${successCount > 1 ? 's' : ''}`);
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to resize ${errorCount} image${errorCount > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error("Error resizing images:", error);
      toast.error("Error resizing images");
    } finally {
      setIsProcessing(false);
    }
  }, [images, options]);

  // Download a single image
  const downloadImage = useCallback((id: string) => {
    const image = images.find(img => img.id === id);
    
    if (!image || !image.resizedBlob) {
      toast.error("Image not available for download");
      return;
    }
    
    const format = options.format.split('/')[1];
    const filename = `${image.file.name.split('.')[0]}_resized.${format}`;
    
    const url = URL.createObjectURL(image.resizedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }, [images, options.format]);

  // Download all resized images as a zip file
  const downloadAllImages = useCallback(async () => {
    try {
      const resizedImages = images.filter(img => img.resizedBlob);
      
      if (resizedImages.length === 0) {
        toast.error("No resized images to download");
        return;
      }
      
      setIsProcessing(true);
      toast.info("Preparing download...");
      
      // Dynamically import JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      const format = options.format.split('/')[1];
      
      // Add all resized images to the zip
      resizedImages.forEach(image => {
        if (image.resizedBlob) {
          const filename = `${image.file.name.split('.')[0]}_resized.${format}`;
          zip.file(filename, image.resizedBlob);
        }
      });
      
      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "resized_images.zip";
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Download complete!");
    } catch (error) {
      console.error("Error downloading images:", error);
      toast.error("Error preparing download");
    } finally {
      setIsProcessing(false);
    }
  }, [images, options.format]);

  return {
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
  };
};
