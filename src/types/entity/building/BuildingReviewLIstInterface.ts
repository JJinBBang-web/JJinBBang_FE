// types/entity/building/ReviewInterface.ts

export type ViewSort = 'LATEST' | 'LIKES' | 'STARS';
export type ContractType = 'MONTHLY_RENT' | 'DEPOSIT_RENT'; // 실제 서버와 맞게 수정

// 공통 ReviewInfo
export interface ReviewInfo {
  content: string;
  keyword: string[];
  likeCount: number;
  updateAt: string; // ISO 8601 날짜 문자열
}

// 일반 건물 리뷰
export interface GeneralReviewInfo {
  id: number;
  name: string;
  type: string;
  contractType: ContractType;
  deposit: number;
  monthlyRent: number;
  floor: string;
  space: number;
  maintenanceCost: number;
  rating: number;
  liked: boolean;
}

// 기숙사 리뷰
export interface DormitoryReviewInfo {
  id: number;
  name: string;
  type: string;
  universityName: string;
  floor: string;
  capacity: number;
  dormFee: number;
  rating: number;
  liked: boolean;
}

// 공인중개사 리뷰
export interface AgencyReviewInfo {
  id: number;
  name: string;
  type: string;
  rating: number;
  liked: boolean;
}

// 개별 리뷰 아이템 (유형 중 하나만 존재)
export interface ReviewItem {
  generalReviewInfo?: GeneralReviewInfo;
  dormitoryReviewInfo?: DormitoryReviewInfo;
  agencyReviewInfo?: AgencyReviewInfo;
  reviewInfo: ReviewInfo;
  image: string;
}

// 전체 응답
export interface BuidlingReviewListResponse {
  num: number;
  page: number;
  itemNum: number;
  items: ReviewItem[];
}
