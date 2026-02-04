// src/api/review/ReviewSubmitAPI.ts
import { postAPI } from '../baseAPI';

export interface GeneralReviewRequest {
  generalReview: {
    contractType: 'MONTHLY_RENT' | 'JEONSE';
    deposit: number;
    monthlyRent: number | null;
    maintenanceCost: number;
    floor: 'LOW' | 'MID' | 'HIGH';
    space: number;
    rating: number;
    content: string;
  };
  imageUrls: string[];
  buildingRequest: {
    buildingCode: string;
    name: string;
    type: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  keywords: {
    positive: string[];
    negative: string[];
  };
}

export interface DormitoryReviewRequest {
  dormitoryReview: {
    dormitoryId: number;
    capacity: number;
    dormFee: number;
    floor: 'LOW' | 'MID' | 'HIGH';
    rating: number;
    content: string;
  };
  imageUrls: string[];
  keywords: {
    positive: string[];
    negative: string[];
  };
  condition: {
    currentRegion: string;
    currentGrade: string;
  };
  facilities: {
    privateFacilities: string[];
    publicFacilities: string[];
    lounge: boolean;
  };
}

export interface AgencyReviewRequest {
  agencyReview: {
    rating: number;
    content: string;
  };
  imageUrls: string[];
  buildingRequest: {
    buildingCode: string;
    name: string;
    type: 'AGENCY';
    address: string;
    latitude: number;
    longitude: number;
  };
  keywords: {
    positive: string[];
    negative: string[];
  };
}

export class ReviewSubmitAPI {
  /**
   * 일반 건물 리뷰 제출
   */
  static async submitGeneralReview(data: GeneralReviewRequest) {
    // buildingCode를 문자열로 보정
    const requestData = {
      ...data,
      buildingRequest: {
        ...data.buildingRequest,
        buildingCode: String(data.buildingRequest.buildingCode),
      },
    };

    // 전세인 경우 monthlyRent를 null로 설정
    if (requestData.generalReview.contractType === 'JEONSE') {
      requestData.generalReview.monthlyRent = null;
    }

    // 일반 리뷰 POST 요청 형식 출력
    // console.log('🚀 General Review POST:', JSON.stringify(requestData, null, 2));

    return await postAPI('/api/v1/review/GENERAL', requestData, true);
  }

  /**
   * 기숙사 리뷰 제출
   */
  static async submitDormitoryReview(data: DormitoryReviewRequest) {
    // 기숙사 리뷰 POST 요청 형식 출력
    // console.log('🚀 Dormitory Review POST:', JSON.stringify(data, null, 2));

    return await postAPI('/api/v1/review/DORMITORY', data, true);
  }

  /**
   * 공인중개사 리뷰 제출
   */
  static async submitAgencyReview(data: AgencyReviewRequest) {
    const requestData = {
      ...data,
      buildingRequest: {
        ...data.buildingRequest,
        buildingCode: String(data.buildingRequest.buildingCode),
      },
    };

    // 공인중개사 리뷰 POST 요청 형식 출력
    // console.log('🚀 Agency Review POST:', JSON.stringify(requestData, null, 2));

    return await postAPI('/api/v1/review/AGENCY', requestData, true);
  }

  /**
   * 리뷰 타입 자동 판별 후 제출
   */
  static async submitReview(data: any) {
    if (data.generalReview) {
      return this.submitGeneralReview(data);
    } else if (data.dormitoryReview) {
      return this.submitDormitoryReview(data);
    } else if (data.agencyReview) {
      return this.submitAgencyReview(data);
    }
    throw new Error('리뷰 타입을 확인할 수 없습니다');
  }
}
