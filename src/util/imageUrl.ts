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
  
  // 기존 백엔드 서버 URL이 있는 경우 그대로 사용하되, 실제로 이미지가 있는지 확인
  if (url.includes('3.35.29.235:8080')) {
    return url;
  }
  
  // 상대 경로나 기타 형식의 경우 백엔드 서버 URL과 결합
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // 슬래시로 시작하지 않으면 추가
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${apiUrl}${cleanUrl}`;
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