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
const AUTO_SAVE_EXPIRY = 24 * 60 * 60 * 1000; // 24시간

// blob URL을 base64로 변환하는 함수
const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw error;
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
      try {
        const base64 = await blobUrlToBase64(imageUrl);
        converted.push(base64);
        base64Only.push(base64);
      } catch (error) {
        converted.push(imageUrl);
      }
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

      // reviewState의 base64 이미지들을 blob URL로 변환
      if (data.reviewState?.images && Array.isArray(data.reviewState.images)) {
        data.reviewState.images = convertBase64ToBlobUrls(data.reviewState.images);
      }

      // dormitoryReviewState의 base64 이미지들을 blob URL로 변환
      if (data.dormitoryReviewState?.images && Array.isArray(data.dormitoryReviewState.images)) {
        data.dormitoryReviewState.images = convertBase64ToBlobUrls(data.dormitoryReviewState.images);
      }


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