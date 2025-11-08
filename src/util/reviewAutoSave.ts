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
  ADDRESS_RESULT: 'address-result',
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

// 단계별 다음 페이지 매핑
// 주의: 일부 단계는 housingType이나 contractType에 따라 다음 단계가 달라질 수 있음
// 이 경우 각 페이지에서 조건부로 nextStep을 결정해야 함
export const STEP_FLOW: { [key: string]: string } = {
  'type': 'input-address',
  'input-address': 'floor', // 일반적인 경우
  'floor': 'price', // 기본값, 실제로는 housingType에 따라 달라짐
  'dormitory': 'dormitory-conditions',
  'dormitory-conditions': 'dormitory-amenities',
  'dormitory-amenities': 'room-info',
  'agency': 'room-info',
  'price': 'room-info', // 일반 주거의 경우
  'jeonse': 'room-info',
  'wolse': 'room-info',
  'room-info': 'filter-ad',
  'filter-ad': 'filter-disad',
  'filter-disad': 'content',
  'content': 'confirm',
  'confirm': 'confirm', // 마지막 단계
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

  // 단계별 다음 페이지 결정 헬퍼 함수
  getNextStep: (currentStep: string, review: any, dormitory: any): { path: string; state: any } | null => {
    const isDormitory = review.housingType === '기숙사';
    const isAgency = review.housingType === '공인중개사';

    // 각 단계에서 다음으로 이동할 페이지를 결정
    const stepFlow: { [key: string]: () => { path: string; state: any } | null } = {
      'type': () => ({
        path: '/review/input-address',
        state: { housingType: review.housingType, from: 'autosave' }
      }),
      'input-address': () => ({
        path: '/review/floor',
        state: {
          housingType: review.housingType,
          address: {
            roadAddress: review.address || '',
            jibunAddress: review.addressDetail || '',
            buildingName: review.detailedAddress || '',
          },
          from: 'autosave'
        }
      }),
      'address': () => stepFlow['input-address'](),
      'floor': () => {
        if (isDormitory) {
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
        } else if (isAgency) {
          return {
            path: '/review/agency',
            state: { housingType: review.housingType, from: 'autosave' },
          };
        } else {
          // 일반 주거의 경우 AddressResultPage로 이동 (PRICE가 아님)
          return {
            path: '/review/result',
            state: {
              housingType: review.housingType,
              address: {
                roadAddress: review.address || '',
                jibunAddress: review.addressDetail || '',
                buildingName: review.detailedAddress || '',
                buildingCode: review.buildingCode || '',
              },
              buildingName: review.detailedAddress || '',
              floor: review.floorType || '',
              squareFootage: review.space ? review.space.toString() : '',
              from: 'autosave',
            },
          };
        }
      },
      'address-result': () => {
        if (isAgency) {
          return {
            path: '/review/room-info',
            state: {
              housingType: review.housingType,
              address: {
                roadAddress: review.address || '',
                jibunAddress: review.addressDetail || '',
                buildingName: review.detailedAddress || '',
                buildingCode: review.buildingCode || '',
              },
              buildingName: review.detailedAddress || '',
              floor: review.floorType || '',
              from: 'autosave',
            }
          };
        } else {
          return {
            path: '/review/price',
            state: {
              housingType: review.housingType,
              address: {
                roadAddress: review.address || '',
                jibunAddress: review.addressDetail || '',
                buildingName: review.detailedAddress || '',
                buildingCode: review.buildingCode || '',
              },
              buildingName: review.detailedAddress || '',
              floor: review.floorType || '',
              squareFootage: review.space ? review.space.toString() : '',
              from: 'autosave',
            },
          };
        }
      },
      'dormitory': () => ({
        path: '/review/dormitory-conditions',
        state: { housingType: review.housingType, from: 'autosave' }
      }),
      'dormitory-conditions': () => ({
        path: '/review/dormitory-amenities',
        state: { housingType: review.housingType, from: 'autosave' }
      }),
      'dormitory-amenities': () => ({
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
          from: 'autosave',
        }
      }),
      'agency': () => ({
        path: '/review/room-info',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        }
      }),
      'price': () => {
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
            from: 'autosave',
          },
        };
      },
      'jeonse': () => ({
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
        }
      }),
      'wolse': () => stepFlow['jeonse'](),
      'room-info': () => ({
        path: '/review/filter-ad',
        state: {
          housingType: review.housingType,
          photos: review.images || [],
          from: 'autosave',
        }
      }),
      'filter-ad': () => ({
        path: '/review/filter-disad',
        state: {
          housingType: review.housingType,
          photos: review.images || [],
          advantages: review.pros || [],
          from: 'autosave',
        }
      }),
      'filter-disad': () => ({
        path: '/review/content',
        state: {
          housingType: review.housingType,
          photos: review.images || [],
          advantages: review.pros || [],
          disadvantages: review.cons || [],
          from: 'autosave',
        }
      }),
      'content': () => ({
        path: '/review/confirm',
        state: {
          housingType: review.housingType,
          photos: review.images || [],
          advantages: review.pros || [],
          disadvantages: review.cons || [],
          content: review.content || review.description || '',
          from: 'autosave',
        }
      }),
      'confirm': () => ({
        path: '/review/confirm',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        }
      }),
    };

    const nextStepFn = stepFlow[currentStep];
    return nextStepFn ? nextStepFn() : null;
  },

  // 현재 단계가 완료되었는지 확인하는 헬퍼 함수
  isStepCompleted: (currentStep: string, review: any, dormitory: any): boolean => {
    const stepValidation: { [key: string]: () => boolean } = {
      'type': () => !!(review.housingType && review.housingType !== ''),
      'input-address': () => !!(review.address && review.address !== ''),
      'address': () => !!(review.address && review.address !== ''),
      'floor': () => !!(review.floorType && review.floorType !== ''),
      'dormitory': () => !!(review.detailedAddress && review.detailedAddress !== ''),
      'dormitory-conditions': () => !!review.dormitoryConditions,
      'dormitory-amenities': () => !!dormitory?.facilityConditions,
      'agency': () => !!(review.detailedAddress && review.detailedAddress !== ''),
      'price': () => !!(review.contractType && review.contractType !== ''),
      'jeonse': () => (
        review.deposit !== null && review.deposit !== undefined &&
        review.managementFee !== null && review.managementFee !== undefined
      ),
      'wolse': () => (
        review.deposit !== null && review.deposit !== undefined &&
        review.monthlyRent !== null && review.monthlyRent !== undefined &&
        review.managementFee !== null && review.managementFee !== undefined
      ),
      'room-info': () => !!(review.images && review.images.length > 0),
      'filter-ad': () => !!(review.pros && review.pros.length >= 3), // 최소 3개
      'filter-disad': () => !!(review.cons && review.cons.length >= 3), // 최소 3개
      'content': () => {
        const content = review.content || review.description || '';
        return content.trim().length >= 50; // 최소 50자
      },
      'confirm': () => true, // 확인 페이지는 항상 완료로 간주
    };

    const validator = stepValidation[currentStep];
    return validator ? validator() : false;
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

    // 현재 단계에 해당하는 페이지 맵 정의
    const currentPageMap: { [key: string]: { path: string; state: any } } = {
      'type': {
        path: '/review/type',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        }
      },
      'input-address': {
        path: '/review/input-address',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        }
      },
      'address': {
        path: '/review/input-address',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        }
      },
      'floor': {
        path: '/review/floor',
        state: {
          housingType: review.housingType,
          address: {
            roadAddress: review.address || '',
            jibunAddress: review.addressDetail || '',
            buildingName: review.detailedAddress || '',
            buildingCode: review.buildingCode || '',
          },
          buildingName: review.detailedAddress || '',
          from: 'autosave',
        }
      },
      'address-result': {
        path: '/review/result',
        state: {
          housingType: review.housingType,
          address: {
            roadAddress: review.address || '',
            jibunAddress: review.addressDetail || '',
            buildingName: review.detailedAddress || '',
            buildingCode: review.buildingCode || '',
          },
          buildingName: review.detailedAddress || '',
          floor: review.floorType || '',
          squareFootage: review.space ? review.space.toString() : '',
          from: 'autosave',
        }
      },
      'dormitory': {
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
        }
      },
      'dormitory-conditions': {
        path: '/review/dormitory-conditions',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        }
      },
      'dormitory-amenities': {
        path: '/review/dormitory-amenities',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        }
      },
      'agency': {
        path: '/review/agency',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        }
      },
      'price': {
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
        }
      },
      'jeonse': {
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
          from: 'autosave',
        }
      },
      'wolse': {
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
          from: 'autosave',
        }
      },
      'room-info': {
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
        }
      },
      'filter-ad': {
        path: '/review/filter-ad',
        state: {
          housingType: review.housingType,
          photos: review.images || [],
          advantages: review.pros || [],
          from: 'autosave',
        }
      },
      'filter-disad': {
        path: '/review/filter-disad',
        state: {
          housingType: review.housingType,
          photos: review.images || [],
          advantages: review.pros || [],
          disadvantages: review.cons || [],
          from: 'autosave',
        }
      },
      'content': {
        path: '/review/content',
        state: {
          housingType: review.housingType,
          photos: review.images || [],
          advantages: review.pros || [],
          disadvantages: review.cons || [],
          content: review.content || review.description || '',
          from: 'autosave',
        }
      },
      'confirm': {
        path: '/review/confirm',
        state: {
          housingType: review.housingType,
          from: 'autosave',
        }
      },
    };

    // currentStep이 있을 때
    if (currentStep) {
      // "다음" 버튼을 클릭하지 않았다면 현재 페이지에 머물러야 함
      // 완료 여부와 관계없이 현재 단계로 이동
      const currentPage = currentPageMap[currentStep];
      if (currentPage) return currentPage;
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
  },

  /**
   * "다음" 버튼 클릭 시 currentStep을 다음 단계로 업데이트하는 함수
   * 이어서 작성할 때 다음 페이지로 이동하도록 함
   */
  updateCurrentStepOnNext: (nextStep: string): void => {
    try {
      const autoSaveData = sessionStorage.getItem(AUTO_SAVE_KEY);

      if (autoSaveData) {
        // 기존 자동저장 데이터가 있으면 currentStep만 업데이트
        const parsed = JSON.parse(autoSaveData);
        parsed.currentStep = nextStep;
        parsed.timestamp = Date.now();
        sessionStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(parsed));
        console.log(`[AutoSave] Updated currentStep to: ${nextStep}`);
      } else {
        // 자동저장 데이터가 없으면 최소한의 데이터로 생성
        // 이는 다음 페이지로 이동했을 때를 대비한 것
        const minimalData = {
          currentStep: nextStep,
          timestamp: Date.now(),
          reviewState: null,
          dormitoryReviewState: null
        };
        sessionStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(minimalData));
        console.log(`[AutoSave] Created new auto-save with currentStep: ${nextStep}`);
      }
    } catch (error) {
      console.error('Failed to update currentStep:', error);
    }
  }
};