// src/util/reviewAutoSave.ts
export interface AutoSaveData {
  reviewState?: any;
  dormitoryReviewState?: any;
  currentStep?: string;
  timestamp?: number;
  // base64 이미지 데이터 별도 저장 (업로드용)
  reviewBase64Images?: string[];
  dormitoryBase64Images?: string[];
}

const AUTO_SAVE_KEY = 'review_auto_save';
const AUTO_SAVE_EXPIRY = 8 * 60 * 60 * 1000; // 8시간 (sessionStorage는 탭 닫히면 자동 삭제)

// blob URL을 base64로 변환하는 함수
const blobUrlToBase64 = async (blobUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(blobUrl);
    if (!response.ok) {
      return null;
    }
    const blob = await response.blob();

    // 파일 크기 체크 (너무 큰 파일은 스킵)
    if (blob.size > 10 * 1024 * 1024) { // 10MB 제한
      return null;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return null;
  }
};

// base64를 blob URL로 변환하는 함수
const base64ToBlobUrl = (base64: string): string => {
  try {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  } catch (error) {
    throw error;
  }
};

// 이미지 배열에서 blob URL들을 base64로 변환
const convertBlobUrlsToBase64 = async (images: string[]): Promise<{
  converted: string[];
  base64Only: string[];
}> => {
  const converted: string[] = [];
  const base64Only: string[] = [];

  for (const imageUrl of images) {
    if (imageUrl.startsWith('blob:')) {
      const base64 = await blobUrlToBase64(imageUrl);
      if (base64) {
        converted.push(base64);
        base64Only.push(base64);
      } else {
        converted.push(imageUrl);
      }
    } else if (imageUrl.startsWith('data:')) {
      converted.push(imageUrl);
      base64Only.push(imageUrl);
    } else {
      converted.push(imageUrl);
    }
  }

  return { converted, base64Only };
};

// 이미지 배열에서 base64들을 blob URL로 변환
const convertBase64ToBlobUrls = (images: string[]): string[] => {
  return images.map((imageUrl) => {
    if (imageUrl.startsWith('data:')) {
      try {
        return base64ToBlobUrl(imageUrl);
      } catch (error) {
        return imageUrl;
      }
    }
    return imageUrl;
  });
};

export const reviewAutoSave = {
  // 자동 저장
  save: async (data: AutoSaveData): Promise<void> => {
    try {
      // reviewState의 images를 base64로 변환
      let processedReviewState = data.reviewState;
      let reviewBase64Images: string[] = [];

      if (data.reviewState?.images && Array.isArray(data.reviewState.images)) {
        const { converted, base64Only } = await convertBlobUrlsToBase64(data.reviewState.images);
        reviewBase64Images = base64Only;
        processedReviewState = {
          ...data.reviewState,
          images: converted
        };
      }

      // dormitoryReviewState의 images를 base64로 변환
      let processedDormitoryState = data.dormitoryReviewState;
      let dormitoryBase64Images: string[] = [];

      if (data.dormitoryReviewState?.images && Array.isArray(data.dormitoryReviewState.images)) {
        const { converted, base64Only } = await convertBlobUrlsToBase64(data.dormitoryReviewState.images);
        dormitoryBase64Images = base64Only;
        processedDormitoryState = {
          ...data.dormitoryReviewState,
          images: converted
        };
      }

      const saveData = {
        ...data,
        reviewState: processedReviewState,
        dormitoryReviewState: processedDormitoryState,
        reviewBase64Images,
        dormitoryBase64Images,
        timestamp: Date.now()
      };

      sessionStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData));
    } catch (error) {
      console.error('Auto save failed:', error);
    }
  },

  // 자동 저장된 데이터 불러오기
  load: (): AutoSaveData | null => {
    try {
      const saved = sessionStorage.getItem(AUTO_SAVE_KEY);
      if (!saved) return null;

      const data = JSON.parse(saved);

      // 만료 시간 체크
      if (Date.now() - data.timestamp > AUTO_SAVE_EXPIRY) {
        sessionStorage.removeItem(AUTO_SAVE_KEY);
        return null;
      }

      // base64 이미지는 그대로 유지 (미리보기에서도 base64 사용 가능)
      // blob URL 변환은 불필요하며 새로고침 후 무효화되는 문제를 야기함


      return data;
    } catch (error) {
      console.error('Auto load failed:', error);
      return null;
    }
  },

  // 자동 저장된 데이터 삭제
  clear: () => {
    try {
      sessionStorage.removeItem(AUTO_SAVE_KEY);
    } catch (error) {
      console.error('Auto save clear failed:', error);
    }
  },

  // 자동 저장된 데이터가 있는지 확인
  hasData: (): boolean => {
    return reviewAutoSave.load() !== null;
  }
};