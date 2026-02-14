interface CloudinaryUploadWidgetOptions {
  cloudName?: string;
  uploadPreset?: string;
  sources?: string[];
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  clientAllowedFormats?: string[];
  resourceType?: string;
  folder?: string;
  thumbnails?: string;
  styles?: {
    palette?: {
      window?: string;
      windowBorder?: string;
      tabIcon?: string;
      menuIcons?: string;
      textDark?: string;
      textLight?: string;
      link?: string;
      action?: string;
      inactiveTabIcon?: string;
      error?: string;
      inProgress?: string;
      complete?: string;
      sourceBg?: string;
    };
  };
  publicIdMode?: string;
  useFilename?: boolean;
  uniqueFilename?: boolean;
  publicIdPrefix?: string;
  [key: string]: unknown;
}

interface CloudinaryUploadWidgetInfo {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  original_filename: string;
  [key: string]: unknown;
}

interface CloudinaryUploadWidgetResult {
  event: string;
  info?: CloudinaryUploadWidgetInfo;
}

interface CloudinaryUploadWidgetError {
  status?: string;
  message?: string;
  [key: string]: unknown;
}

interface CloudinaryUploadWidget {
  open: () => void;
  close: () => void;
}

interface Window {
  cloudinary: {
    createUploadWidget: (
      options: CloudinaryUploadWidgetOptions,
      callback: (
        error: CloudinaryUploadWidgetError | null,
        result: CloudinaryUploadWidgetResult
      ) => void
    ) => CloudinaryUploadWidget;
  };
}
