// src/api/imageUpload.ts
import { api } from './api';

export interface ImageUploadResponse {
  code: number;
  message: string;
  data: {
    imageUrl: string;
  };
}

export const imageUploadAPI = {
  /**
   * Upload a single image file
   * @param file - The image file to upload
   * @returns Promise<string> - The uploaded image URL
   */
  uploadImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/api/v1/image/upload', formData, {
        useAuth: true,
        isFile: true,
      });

      if (response.data && response.data.code === 200) {
        return response.data.data.imageUrl;
      } else {
        throw new Error('이미지 업로드 실패');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  },

  /**
   * Upload multiple image files
   * @param files - Array of image files to upload
   * @returns Promise<string[]> - Array of uploaded image URLs
   */
  uploadImages: async (files: File[]): Promise<string[]> => {
    try {
      const uploadPromises = files.map(file => imageUploadAPI.uploadImage(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple image upload error:', error);
      throw error;
    }
  },

  /**
   * Convert blob URL to File object
   * @param blobUrl - The blob URL to convert
   * @param fileName - The file name for the converted file
   * @returns Promise<File> - The converted File object
   */
  blobToFile: async (blobUrl: string, fileName: string = 'image.jpg'): Promise<File> => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new File([blob], fileName, { type: blob.type });
    } catch (error) {
      console.error('Blob to file conversion error:', error);
      throw error;
    }
  },

  /**
   * Convert multiple blob URLs to File objects and upload them
   * @param blobUrls - Array of blob URLs to convert and upload
   * @returns Promise<string[]> - Array of uploaded image URLs
   */
  uploadBlobUrls: async (blobUrls: string[]): Promise<string[]> => {
    try {
      const files = await Promise.all(
        blobUrls.map((blobUrl, index) => 
          imageUploadAPI.blobToFile(blobUrl, `image_${index + 1}.jpg`)
        )
      );
      
      return await imageUploadAPI.uploadImages(files);
    } catch (error) {
      console.error('Blob URLs upload error:', error);
      throw error;
    }
  }
};