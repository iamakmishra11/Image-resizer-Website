
/**
 * Utility functions for image processing
 */

// Resize an image to specific dimensions while maintaining aspect ratio if needed
export const resizeImage = async (
  file: File,
  maxWidth: number,
  maxHeight: number,
  maintainAspectRatio = true,
  format = 'image/jpeg',
  quality = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = maxWidth;
      let height = maxHeight;
      
      // Calculate dimensions if maintaining aspect ratio
      if (maintainAspectRatio) {
        const aspectRatio = img.width / img.height;
        
        if (width / height > aspectRatio) {
          width = height * aspectRatio;
        } else {
          height = width / aspectRatio;
        }
      }
      
      // Create canvas and draw resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Apply smooth rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Could not create blob'));
            return;
          }
          resolve(blob);
        },
        format,
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Error loading image'));
    };
    
    // Set source from file
    img.src = URL.createObjectURL(file);
  });
};

// Generate a thumbnail preview from a file
export const generateThumbnail = async (
  file: File,
  maxSize = 200
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      let width = maxSize;
      let height = maxSize;
      
      if (aspectRatio > 1) {
        height = width / aspectRatio;
      } else {
        width = height * aspectRatio;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Return as data URL
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    
    img.onerror = () => {
      reject(new Error('Error generating thumbnail'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Download a blob with a filename
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

// Get file extension from file name
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

// Format file size to human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Create zip file from multiple blobs
export const createZipFromBlobs = async (
  files: Array<{ blob: Blob; name: string }>
): Promise<Blob> => {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  
  files.forEach(file => {
    zip.file(file.name, file.blob);
  });
  
  return zip.generateAsync({ type: 'blob' });
};
