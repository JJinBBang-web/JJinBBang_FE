// src/util/imageUrl.ts
/**
 * Fixes localhost image URLs to use the correct API URL
 * @param url - The potentially incorrect image URL
 * @returns The corrected image URL
 */
export const fixImageUrl = (url: string): string => {
  if (!url) return url;
  
  const apiUrl = process.env.REACT_APP_API_URL || 'http://3.35.29.235:8080';
  
  // Replace localhost:8080 with the correct API URL
  if (url.includes('localhost:8080')) {
    return url.replace('http://localhost:8080', apiUrl);
  }
  
  return url;
};

/**
 * Fixes an array of image URLs
 * @param urls - Array of potentially incorrect image URLs
 * @returns Array of corrected image URLs
 */
export const fixImageUrls = (urls: string[]): string[] => {
  return urls.map(fixImageUrl);
};