'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

export interface CloudinaryImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  originalFilename?: string;
}

interface CloudinaryUploadWidgetProps {
  onImagesChange: (images: CloudinaryImage[]) => void;
  initialImages?: CloudinaryImage[];
  maxImages?: number;
  folder?: string;
  publicIdPrefix?: string;
  useOriginalFilename?: boolean;
}

export function CloudinaryUploadWidget({
  onImagesChange,
  initialImages = [],
  maxImages = 10,
  folder = 'products',
  publicIdPrefix,
  useOriginalFilename = false,
}: CloudinaryUploadWidgetProps) {
  const [images, setImages] = useState<CloudinaryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const openCloudinaryWidget = useCallback(() => {
    setError('');

    if (images.length >= maxImages) {
      setError(`Хамгийн ихдээ ${maxImages} зураг оруулах боломжтой`);
      return;
    }

    if (typeof window !== 'undefined' && window.cloudinary) {
      setUploading(true);

      const uploadOptions: CloudinaryUploadWidgetOptions = {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: true,
        maxFiles: maxImages - images.length,
        maxFileSize: 5000000,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        resourceType: 'image',
        folder: folder,
        thumbnails: '.upload-thumbnails',
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#E5E7EB',
            tabIcon: '#171717',
            menuIcons: '#171717',
            textDark: '#171717',
            textLight: '#FFFFFF',
            link: '#3B82F6',
            action: '#3B82F6',
            inactiveTabIcon: '#9CA3AF',
            error: '#EF4444',
            inProgress: '#3B82F6',
            complete: '#10B981',
            sourceBg: '#F9FAFB',
          },
        },
      };

      if (useOriginalFilename) {
        uploadOptions.publicIdMode = 'filename';
        uploadOptions.useFilename = true;
        uploadOptions.uniqueFilename = true;
      } else {
        uploadOptions.publicIdMode = 'random';
      }

      if (publicIdPrefix) {
        uploadOptions.publicIdPrefix = publicIdPrefix;
      }

      const widget = window.cloudinary.createUploadWidget(
        uploadOptions,
        (error, result) => {
          setUploading(false);

          if (error) {
            console.error('Upload error:', error);
            setError('Зураг оруулахад алдаа гарлаа');
            return;
          }

          if (result.event === 'success' && result.info) {
            const newImage: CloudinaryImage = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
              width: result.info.width,
              height: result.info.height,
              format: result.info.format,
              bytes: result.info.bytes,
              originalFilename: result.info.original_filename,
            };

            const newImages = [...images, newImage];
            setImages(newImages);
            onImagesChange(newImages);
          }

          if (result.event === 'close') {
            widget.close();
          }
        }
      );

      widget.open();
    } else {
      setError('Cloudinary widget-ийг ачаалж чадсангүй');
    }
  }, [
    images,
    maxImages,
    onImagesChange,
    folder,
    publicIdPrefix,
    useOriginalFilename,
  ]);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
    setError('');
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={openCloudinaryWidget}
        disabled={uploading || images.length >= maxImages}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-gray-600 transition hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Зураг оруулж байна...</span>
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            <span>
              Зураг оруулах ({images.length}/{maxImages})
            </span>
          </>
        )}
      </button>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.publicId}
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', index.toString());
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const fromIndex = parseInt(
                  e.dataTransfer.getData('text/plain')
                );
                reorderImages(fromIndex, index);
              }}
            >
              <Image
                src={image.url}
                alt={image.originalFilename || `Product image ${index + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />

              {index === 0 && (
                <div className="absolute top-2 left-2 rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                  Үндсэн
                </div>
              )}

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                aria-label="Зураг устгах"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-xs text-white">
                  {image.originalFilename || 'Uploaded image'}
                </p>
                {image.width && image.height && (
                  <p className="text-xs text-white/80">
                    {image.width} × {image.height}
                    {image.bytes && ` • ${(image.bytes / 1024).toFixed(0)}KB`}
                  </p>
                )}
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                Чирж байршуулах
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-gray-500">
          <ImageIcon className="h-12 w-12 text-gray-400" />
          <p>Бүтээгдэхүүний зургийг оруулна уу</p>
          <p className="text-xs">JPG, PNG, WEBP, GIF (макс 5MB)</p>
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-500">
          💡 Эхний зураг нь үндсэн зураг болно. Дарааллыг өөрчлөхийн тулд
          зургийг чирнэ үү.
        </p>
      )}
    </div>
  );
}
