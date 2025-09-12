// src/api/imageUpload.ts
import { api } from "./api";
import client from "./client";

export interface PresignedUrlResponse {
  code: number;
  message: string;
  data: {
    presignedUrl: string;
    expiresAt: string;
    cdnUrl: string;
  };
}

export interface ImageUploadResponse {
  code: number;
  message: string;
  data: {
    imageUrl: string;
  };
}

export const imageUploadAPI = {
  /**
   * Get presigned URL for S3 upload
   * @param folder - Upload category ('review' | 'profile')
   * @param fileName - Original file name with extension
   * @returns Promise<PresignedUrlResponse['data']> - Presigned URL data
   */
  getPresignedUrl: async (
    folder: "review" | "profile",
    fileName: string
  ): Promise<PresignedUrlResponse["data"]> => {
    try {
      const response = await api.get("/api/v1/s3/presigned-upload", {
        params: {
          folder,
          fileName,
        },
        useAuth: true,
      });

      if (response.data && response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(
          `Presigned URL 발급 실패: ${
            response.data?.message || "Unknown error"
          }`
        );
      }
    } catch (error: any) {
      console.error("Presigned URL error:", error);
      throw error;
    }
  },

  /**
   * Get proper content type for image files
   * @param fileName - The file name with extension
   * @returns string - The proper MIME type
   */
  getImageContentType: (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "webp":
        return "image/webp";
      case "bmp":
        return "image/bmp";
      case "svg":
        return "image/svg+xml";
      case "heic":
        return "image/heic";
      case "heif":
        return "image/heif";
      case "avif":
        return "image/avif";
      default:
        return "image/jpeg"; // 기본값
    }
  },

  /**
   * Upload file to S3 using presigned URL
   * @param presignedUrl - The presigned URL from getPresignedUrl
   * @param file - The file to upload
   * @returns Promise<void>
   */
  uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
    try {
      const contentType = imageUploadAPI.getImageContentType(file.name);
      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType,
        },
      });

      if (!response.ok) {
        throw new Error(`S3 업로드 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("S3 upload error:", error);
      throw error;
    }
  },

  /**
   * Upload a single image file using S3 presigned URL (with fallback to legacy API)
   * @param file - The image file to upload
   * @param folder - Upload category ('review' | 'profile')
   * @returns Promise<string> - The CDN URL or legacy image URL of the uploaded image
   */
  uploadImage: async (
    file: File,
    folder: "review" | "profile" = "review"
  ): Promise<string> => {
    try {
      // Validate file type
      const supportedTypes = [
        "jpg",
        "jpeg",
        "png",
        "webp",
        "gif",
        "avif",
        "heic",
        "heif",
      ];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !supportedTypes.includes(fileExtension)) {
        throw new Error(
          `지원되지 않는 파일 형식입니다. 지원 형식: ${supportedTypes.join(
            ", "
          )}`
        );
      }

      try {
        // Try S3 upload first
        const { presignedUrl, cdnUrl } = await imageUploadAPI.getPresignedUrl(
          folder,
          file.name
        );
        await imageUploadAPI.uploadToS3(presignedUrl, file);
        return cdnUrl;
      } catch (s3Error) {
        console.warn(
          "S3 upload failed, falling back to legacy upload:",
          s3Error
        );

        // Fallback to legacy upload
        return await imageUploadAPI.uploadImageLegacy(file);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  },

  /**
   * Legacy image upload method (fallback)
   * @param file - The image file to upload
   * @returns Promise<string> - The uploaded image URL
   */
  uploadImageLegacy: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/api/v1/image/upload", formData, {
        useAuth: true,
        isFile: true,
      });

      if (response.data && response.data.code === 200) {
        return response.data.data.imageUrl;
      } else {
        throw new Error("이미지 업로드 실패");
      }
    } catch (error) {
      console.error("Legacy image upload error:", error);
      throw error;
    }
  },

  /**
   * Upload multiple image files
   * @param files - Array of image files to upload
   * @param folder - Upload category ('review' | 'profile')
   * @returns Promise<string[]> - Array of CDN URLs
   */
  uploadImages: async (
    files: File[],
    folder: "review" | "profile" = "review"
  ): Promise<string[]> => {
    try {
      const uploadPromises = files.map((file) =>
        imageUploadAPI.uploadImage(file, folder)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Multiple image upload error:", error);
      throw error;
    }
  },

  /**
   * Convert blob URL to File object
   * @param blobUrl - The blob URL to convert
   * @param fileName - The file name for the converted file
   * @returns Promise<File> - The converted File object
   */
  blobToFile: async (
    blobUrl: string,
    fileName: string = "image.jpg"
  ): Promise<File> => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new File([blob], fileName, { type: blob.type });
    } catch (error) {
      console.error("Blob to file conversion error:", error);
      throw error;
    }
  },

  /**
   * Convert multiple blob URLs to File objects and upload them using S3
   * @param blobUrls - Array of blob URLs to convert and upload
   * @param folder - Upload category ('review' | 'profile')
   * @returns Promise<string[]> - Array of CDN URLs
   */
  uploadBlobUrls: async (
    blobUrls: string[],
    folder: "review" | "profile" = "review"
  ): Promise<string[]> => {
    try {
      const files = await Promise.all(
        blobUrls.map((blobUrl, index) => {
          // Generate a unique filename with supported extension
          const timestamp = Date.now();
          const fileName = `image_${timestamp}_${index + 1}.jpg`;
          return imageUploadAPI.blobToFile(blobUrl, fileName);
        })
      );

      return await imageUploadAPI.uploadImages(files, folder);
    } catch (error) {
      console.error("Blob URLs upload error:", error);
      throw error;
    }
  },
};
