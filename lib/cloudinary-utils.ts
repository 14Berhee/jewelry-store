/**
 * Cloudinary Utility Functions
 * Helper functions for working with Cloudinary images
 */

/**
 * Optimizes a Cloudinary image URL with transformations
 * @param url - Original Cloudinary URL
 * @param options - Transformation options
 * @returns Optimized URL with transformations
 */
interface OptimizeOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'scale' | 'fit' | 'limit' | 'pad';
  gravity?: 'auto' | 'face' | 'center';
}

export function optimizeCloudinaryUrl(
  url: string,
  options: OptimizeOptions = {}
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'scale',
    gravity,
  } = options;

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);

  if (width || height) {
    transformations.push(`c_${crop}`);
  }

  if (gravity) {
    transformations.push(`g_${gravity}`);
  }

  transformations.push(`f_${format}`);
  transformations.push(`q_${quality}`);

  const transformString = transformations.join(',');

  return url.replace('/upload/', `/upload/${transformString}/`);
}

export function getCloudinaryThumbnail(
  url: string,
  size: number = 200
): string {
  return optimizeCloudinaryUrl(url, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'auto',
  });
}

export function getResponsiveCloudinaryUrls(url: string) {
  return {
    mobile: optimizeCloudinaryUrl(url, { width: 640 }),
    tablet: optimizeCloudinaryUrl(url, { width: 1024 }),
    desktop: optimizeCloudinaryUrl(url, { width: 1920 }),
  };
}

export function getCloudinaryPublicId(url: string): string | null {
  if (!url.includes('cloudinary.com')) return null;

  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return matches ? matches[1] : null;
}

export async function deleteCloudinaryImage(
  publicId: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com/');
}

export function getCloudinaryImageInfo(url: string) {
  const transformMatch = url.match(/\/upload\/([^/]+)\//);
  if (!transformMatch) return null;

  const transforms = transformMatch[1].split(',');
  const info: { width?: number; height?: number; format?: string } = {};

  transforms.forEach((t) => {
    if (t.startsWith('w_')) info.width = parseInt(t.substring(2));
    if (t.startsWith('h_')) info.height = parseInt(t.substring(2));
    if (t.startsWith('f_')) info.format = t.substring(2);
  });

  return Object.keys(info).length > 0 ? info : null;
}

export function buildCloudinaryUrl(
  publicId: string,
  options: OptimizeOptions = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    console.error('Cloudinary cloud name not configured');
    return '';
  }

  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  const url = `${baseUrl}/${publicId}`;

  return optimizeCloudinaryUrl(url, options);
}

export function optimizeCloudinaryUrls(
  urls: string[],
  options: OptimizeOptions = {}
): string[] {
  return urls.map((url) => optimizeCloudinaryUrl(url, options));
}
