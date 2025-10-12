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

// 리뷰 작성 단계 정의
export const REVIEW_STEPS = {
  TYPE: 'type',
  ADDRESS: 'address',
  ADDRESS_INPUT: 'input-address',
  FLOOR: 'floor',
  DORMITORY: 'dormitory',
  DORMITORY_CONDITIONS: 'dormitory-conditions',
  DORMITORY_AMENITIES: 'dormitory-amenities',
  AGENCY: 'agency',
  PRICE: 'price',
  JEONSE: 'jeonse',
  WOLSE: 'wolse',
  ROOM_INFO: 'room-info',
  FILTER_AD: 'filter-ad',
  FILTER_DISAD: 'filter-disad',
  CONTENT: 'content',
  CONFIRM: 'confirm',
};

const AUTO_SAVE_KEY = 'review_auto_save';
const AUTO_SAVE_EXPIRY = 24 * 60 * 60 * 1000; // 24시간

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const data = reviewAutoSave.load();
    if (!data || !data.reviewState) return false;

    const review = data.reviewState;

    // 의미있는 데이터가 있는지 확인
    // housingType이 있거나, address가 있거나, 기타 작성된 내용이 있는지 확인
    const hasMeaningfulData =
      (review.housingType && review.housingType !== '') ||
      (review.address && review.address !== '') ||
      (review.pros && review.pros.length > 0) ||
      (review.cons && review.cons.length > 0) ||
      (review.content && review.content !== '') ||
      (review.description && review.description !== '') ||
      (review.images && review.images.length > 0);

    return hasMeaningfulData;
  },

  // 자동 저장된 데이터를 기반으로 마지막 작성 페이지 경로 반환
  getLastEditedPage: (): { path: string; state: any } | null => {
    const data = reviewAutoSave.load();
    if (!data || !data.reviewState) return null;

    const review = data.reviewState;
    const dormitory = data.dormitoryReviewState;
    const isDormitory = review.housingType === '기숙사';
    const isAgency = review.housingType === '공인중개사';
    const currentStep = data.currentStep;

    // currentStep을 우선적으로 사용하여 페이지 결정
    // currentStep이 있으면 해당 단계로 이동, 없으면 데이터 기반으로 추론

    // 확인 페이지
    if (currentStep === REVIEW_STEPS.CONFIRM) {
      return {
        path: '/review/confirm',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        },
      };
    }

    // 콘텐츠 작성 페이지
    if (currentStep === REVIEW_STEPS.CONTENT) {
      return {
        path: '/review/content',
        state: {
          housingType: review.housingType,
          photos: review.images || [],
          advantages: review.pros || [],
          disadvantages: review.cons || [],
          content: review.content || review.description || '',
          from: 'autosave',
        },
      };
    }

    // 단점 선택 페이지
    if (currentStep === REVIEW_STEPS.FILTER_DISAD) {
      return {
        path: '/review/filter-disad',
        state: {
          housingType: review.housingType,
          photos: review.images || [],
          advantages: review.pros || [],
          disadvantages: review.cons || [],
          from: 'autosave',
        },
      };
    }

    // 장점 선택 페이지
    if (currentStep === REVIEW_STEPS.FILTER_AD) {
      return {
        path: '/review/filter-ad',
        state: {
          housingType: review.housingType,
          photos: review.images || [],
          advantages: review.pros || [],
          from: 'autosave',
        },
      };
    }

    // 사진 업로드 페이지 (방 정보)
    if (currentStep === REVIEW_STEPS.ROOM_INFO) {
      return {
        path: '/review/room-info',
        state: {
          housingType: review.housingType,
          address: {
            roadAddress: review.address || '',
            jibunAddress: review.addressDetail || '',
            buildingName: review.detailedAddress || '',
          },
          buildingName: review.detailedAddress || '',
          floor: review.floorType || '',
          paymentType: review.contractType || '',
          priceData: {
            deposit: review.deposit || 0,
            monthlyRent: review.monthlyRent || 0,
            managementFee: review.managementFee || 0,
          },
          from: 'autosave',
        },
      };
    }

    // 월세 입력 페이지
    if (currentStep === REVIEW_STEPS.WOLSE) {
      return {
        path: '/review/wolse',
        state: {
          housingType: review.housingType,
          address: {
            roadAddress: review.address || '',
            jibunAddress: review.addressDetail || '',
            buildingName: review.detailedAddress || '',
          },
          buildingName: review.detailedAddress || '',
          floor: review.floorType || '',
          paymentType: review.contractType || '',
          priceData: {
            deposit: review.deposit || 0,
            monthlyRent: review.monthlyRent || 0,
            managementFee: review.managementFee || 0,
          },
          from: 'autosave',
        },
      };
    }

    // 전세 입력 페이지
    if (currentStep === REVIEW_STEPS.JEONSE) {
      return {
        path: '/review/jeonse',
        state: {
          housingType: review.housingType,
          address: {
            roadAddress: review.address || '',
            jibunAddress: review.addressDetail || '',
            buildingName: review.detailedAddress || '',
          },
          buildingName: review.detailedAddress || '',
          floor: review.floorType || '',
          paymentType: review.contractType || '',
          priceData: {
            deposit: review.deposit || 0,
            monthlyRent: review.monthlyRent || 0,
            managementFee: review.managementFee || 0,
          },
          from: 'autosave',
        },
      };
    }

    // 계약 형태 선택 페이지
    if (currentStep === REVIEW_STEPS.PRICE) {
      return {
        path: '/review/price',
        state: {
          housingType: review.housingType,
          address: {
            roadAddress: review.address || '',
            jibunAddress: review.addressDetail || '',
            buildingName: review.detailedAddress || '',
          },
          buildingName: review.detailedAddress || '',
          floor: review.floorType || '',
          from: 'autosave',
        },
      };
    }

    // 공인중개사 정보 입력 페이지
    if (currentStep === REVIEW_STEPS.AGENCY) {
      return {
        path: '/review/agency',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        },
      };
    }

    // 기숙사 편의시설 페이지
    if (currentStep === REVIEW_STEPS.DORMITORY_AMENITIES) {
      return {
        path: '/review/dormitory-amenities',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        },
      };
    }

    // 기숙사 입주 조건 페이지
    if (currentStep === REVIEW_STEPS.DORMITORY_CONDITIONS) {
      return {
        path: '/review/dormitory-conditions',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        },
      };
    }

    // 기숙사 정보 입력 페이지
    if (currentStep === REVIEW_STEPS.DORMITORY) {
      return {
        path: '/review/dormitory',
        state: {
          housingType: review.housingType,
          address: {
            roadAddress: review.address || '',
            jibunAddress: review.addressDetail || '',
            buildingName: review.detailedAddress || '',
          },
          buildingName: review.detailedAddress || '',
          floor: review.floorType || '',
          from: 'autosave',
        },
      };
    }

    // 층수 입력 페이지
    if (currentStep === REVIEW_STEPS.FLOOR) {
      return {
        path: '/review/floor',
        state: {
          housingType: review.housingType,
          address: {
            roadAddress: review.address || '',
            jibunAddress: review.addressDetail || '',
            buildingName: review.detailedAddress || '',
          },
          buildingName: review.detailedAddress || '',
          from: 'autosave',
        },
      };
    }

    // 주소 입력 페이지
    if (currentStep === REVIEW_STEPS.ADDRESS_INPUT || currentStep === REVIEW_STEPS.ADDRESS) {
      return {
        path: '/review/input-address',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        },
      };
    }

    // 찐빵 유형 선택 페이지
    if (currentStep === REVIEW_STEPS.TYPE) {
      return {
        path: '/review/type',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        },
      };
    }

    // currentStep이 없는 경우 데이터를 기반으로 추론 (하위 호환성)
    // 이 로직은 이전 버전의 자동저장 데이터를 위한 것

    // 콘텐츠 작성까지 완료
    if (review.content || review.description) {
      return {
        path: '/review/content',
        state: {
          housingType: review.housingType,
          photos: review.images || [],
          advantages: review.pros || [],
          disadvantages: review.cons || [],
          content: review.content || review.description || '',
          from: 'autosave',
        },
      };
    }

    // 단점 선택까지 완료
    if (review.cons && review.cons.length > 0) {
      return {
        path: '/review/filter-disad',
        state: {
          housingType: review.housingType,
          photos: review.images || [],
          advantages: review.pros || [],
          disadvantages: review.cons || [],
          from: 'autosave',
        },
      };
    }

    // 장점 선택까지 완료
    if (review.pros && review.pros.length > 0) {
      return {
        path: '/review/filter-ad',
        state: {
          housingType: review.housingType,
          photos: review.images || [],
          advantages: review.pros || [],
          from: 'autosave',
        },
      };
    }

    // 사진 업로드까지 완료
    if (review.images && review.images.length > 0) {
      return {
        path: '/review/room-info',
        state: {
          housingType: review.housingType,
          address: {
            roadAddress: review.address || '',
            jibunAddress: review.addressDetail || '',
            buildingName: review.detailedAddress || '',
          },
          buildingName: review.detailedAddress || '',
          floor: review.floorType || '',
          paymentType: review.contractType || '',
          priceData: {
            deposit: review.deposit || 0,
            monthlyRent: review.monthlyRent || 0,
            managementFee: review.managementFee || 0,
          },
          from: 'autosave',
        },
      };
    }

    // 기숙사 - 편의시설까지 완료
    if (isDormitory && dormitory?.facilityConditions) {
      return {
        path: '/review/dormitory-amenities',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        },
      };
    }

    // 기숙사 - 입주 조건까지 완료
    if (isDormitory && review.dormitoryConditions) {
      return {
        path: '/review/dormitory-conditions',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        },
      };
    }

    // 기숙사 - 기숙사 정보까지 완료
    if (isDormitory && review.detailedAddress) {
      return {
        path: '/review/dormitory',
        state: {
          housingType: review.housingType,
          address: {
            roadAddress: review.address || '',
            jibunAddress: review.addressDetail || '',
            buildingName: review.detailedAddress || '',
          },
          buildingName: review.detailedAddress || '',
          floor: review.floorType || '',
          from: 'autosave',
        },
      };
    }

    // 공인중개사 - 상세 정보까지 완료
    if (isAgency && review.detailedAddress) {
      return {
        path: '/review/agency',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        },
      };
    }

    // 일반 - 월세/전세 입력까지 완료
    if (!isDormitory && !isAgency && (review.deposit !== null || review.monthlyRent !== null)) {
      const nextPath = review.contractType === '전세' ? '/review/jeonse' : '/review/wolse';
      return {
        path: nextPath,
        state: {
          housingType: review.housingType,
          address: {
            roadAddress: review.address || '',
            jibunAddress: review.addressDetail || '',
            buildingName: review.detailedAddress || '',
          },
          buildingName: review.detailedAddress || '',
          floor: review.floorType || '',
          paymentType: review.contractType || '',
          priceData: {
            deposit: review.deposit || 0,
            monthlyRent: review.monthlyRent || 0,
            managementFee: review.managementFee || 0,
          },
          from: 'autosave',
        },
      };
    }

    // 일반 - 계약 형태까지 완료
    if (!isDormitory && !isAgency && review.contractType) {
      return {
        path: '/review/price',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        },
      };
    }

    // 층수까지 완료
    if (review.floorType) {
      return {
        path: '/review/floor',
        state: {
          housingType: review.housingType,
          address: {
            roadAddress: review.address || '',
            jibunAddress: review.addressDetail || '',
            buildingName: review.detailedAddress || '',
          },
          buildingName: review.detailedAddress || '',
          floor: review.floorType || '',
          from: 'autosave',
        },
      };
    }

    // 주소까지 완료
    if (review.address) {
      return {
        path: '/review/input-address',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        },
      };
    }

    // 찐빵 유형만 선택한 경우
    if (review.housingType) {
      return {
        path: '/review/type',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        },
      };
    }

    // 아무것도 작성하지 않은 경우
    return {
      path: '/review/type',
      state: {
        from: 'autosave',
      },
    };
  }
};