import Image, { ImageProps } from 'next/image';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary-utils';

interface CloudinaryImageProps extends Omit<ImageProps, 'src' | 'quality'> {
  src: string;
  maxWidth?: number;

  quality?: 'auto' | number;
}

export function CloudinaryImage({
  src,
  alt,
  maxWidth,
  quality = 'auto',
  ...props
}: CloudinaryImageProps) {
  const optimizedSrc = src.includes('cloudinary.com')
    ? optimizeCloudinaryUrl(src, {
        width: maxWidth,
        quality,
        format: 'auto',
        crop: 'scale',
      })
    : src;

  return <Image src={optimizedSrc} alt={alt} {...props} />;
}

export function ProductImage({
  src,
  alt,
  size = 800,
  ...props
}: {
  src: string;
  alt: string;
  size?: number;
} & Omit<ImageProps, 'src' | 'alt'>) {
  const optimizedSrc = src.includes('cloudinary.com')
    ? optimizeCloudinaryUrl(src, {
        width: size,
        height: size,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto',
        format: 'auto',
      })
    : src;

  return <Image src={optimizedSrc} alt={alt} {...props} />;
}

export function ThumbnailImage({
  src,
  alt,
  size = 200,
  ...props
}: {
  src: string;
  alt: string;
  size?: number;
} & Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'>) {
  const optimizedSrc = src.includes('cloudinary.com')
    ? optimizeCloudinaryUrl(src, {
        width: size,
        height: size,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto',
        format: 'auto',
      })
    : src;

  return (
    <Image src={optimizedSrc} alt={alt} width={size} height={size} {...props} />
  );
}
