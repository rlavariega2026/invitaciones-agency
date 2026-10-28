/**
 * Utility to process, compress and read images directly from the user's device
 * into optimized Base64 Data URLs for local storage and fast in-app rendering.
 */

export const compressAndReadFile = (
  file: File,
  maxWidth = 1400,
  maxHeight = 1400,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo seleccionado no es una imagen válida.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('No se pudo leer el archivo.'));
        return;
      }

      // If already a small SVG or GIF, resolve directly
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        resolve(result);
        return;
      }

      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate proportional scale
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result); // Fallback to raw base64 if canvas context unavailable
          return;
        }

        // Draw image on canvas with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to web-optimized JPEG data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        // Fallback to original base64 if image decoding fails
        resolve(result);
      };

      img.src = result;
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
};

export const compressMultipleFiles = async (
  files: FileList | File[],
  maxWidth = 1400,
  maxHeight = 1400,
  quality = 0.82
): Promise<string[]> => {
  const fileArray = Array.from(files);
  const results: string[] = [];

  for (const file of fileArray) {
    if (file.type.startsWith('image/')) {
      try {
        const dataUrl = await compressAndReadFile(file, maxWidth, maxHeight, quality);
        results.push(dataUrl);
      } catch (err) {
        console.warn('Error procesando imagen:', file.name, err);
      }
    }
  }

  return results;
};
