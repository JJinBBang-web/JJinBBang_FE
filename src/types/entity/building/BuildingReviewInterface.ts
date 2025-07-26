
// 리뷰 키워드
export interface ReviewKeywords {
  positive: string[];
  negative: string[];
}

// 이미지 정보
export interface ReviewImages {
  count: number;
  imageUrl: string[];
}

// 건물 정보
export interface BuildingInfo {
  buildingId: number;
  buildingCode?: string; // 카카오 건물번호 (optional)
  name: string;
  type: string; // "아파트", "공인중개사", "기숙사" 등
  address: string;
  latitude: number;
  longitude: number;
}

// 공통 리뷰 본문 정보
export interface ReviewInfo {
  content: string;
  keywords: string[] | null;
  likeCount: number;
  updateAt: string;
}

// 일반 건물 리뷰 정보
export interface GeneralReviewInfo {
  id: number;
  name: string;
  type: string;
  contractType: string;
  deposit: number;
  monthlyRent: number;
  floor: string;
  space: number;
  maintenanceCost: number;
  rating: number;
  liked: boolean;
}

// 기숙사 리뷰 정보
export interface DormitoryReviewInfo {
  id: number;
  name: string;
  type: string;
  university: string;
  floor: string;
  capacity: number;
  dormFee: number;
  rating: number;
  liked: boolean;
}

// 공인중개사 리뷰 정보
export interface AgencyReviewInfo {
  id: number;
  name: string;
  type: string;
  rating: number;
  liked: boolean;
}

// 기숙사 추가 조건
export interface DormitoryConditions {
  currentRegion: string;
  currentGrade: number;
}

// 기숙사 편의시설
export interface DormitoryFacilities {
  private: string[];
  public: string[];
  lounge: boolean;
}


// 최종 통합 타입
export interface BuildingReviewResponse {
  generalReviewInfo?: GeneralReviewInfo;
  domitoryReviewInfo?: DormitoryReviewInfo;
  agencyReviewInfo?: AgencyReviewInfo;

  reviewInfo: ReviewInfo;
  reviewImages: ReviewImages;
  building: BuildingInfo;
  keywords: ReviewKeywords;
  authorId: number;

  // 기숙사 추가 정보
  conditions?: DormitoryConditions;
  facilities?: DormitoryFacilities;
}