// export type ContractType = 'MONTHLY_RENT' | 'DEPOSIT_RENT';
// export type FloorType = 'LOW' | 'MID' | 'HIGH' | 'STRONG' | 'ATTIC';
// export type BuildType = 'ROOM' | 'HOUSE' | 'OFFICETEL' | 'APARTMENT' | 'BOARDING_HOUSE' | 'DORMITORY' | 'AGENCY';

import { Condition, Facilities } from "../building/ReviewCreateInterface";

export type KeywordCode = string;

export interface GeneralReview {
  contractType: string;     // 계약 형태
  deposit: number;                // 보증금(만원)
  monthlyRent: number | null;     // 월세(만원) - 전세면 null
  maintenanceCost: number;        // 관리비(만원)
  floor: string;               // LOW | MID | HIGH
  space: number;                  // 면적
  rating: 1 | 2 | 3 | 4 | 5;      // 별점
  content: string;                // 후기 내용
}

export interface AgencyReview {
  rating: 1 | 2 | 3 | 4 | 5;
  content : string;
}

export interface DormitoryReview {
  campusId: number;
  capacity : number;
  dormFee : number;
  floor : string;
  rating: 1 | 2 | 3 | 4 | 5;
  content : string;
}

export interface BuildingRequest {
  buildingCode?: string;           // 카카오 건물 관리번호 (가능하면 필수 유지)
  name?: string;                  // 건물명
  type?: string;                  // 건물 유형 (예: "아파트") - 서버 enum이면 교체
  address?: string;               // 주소
  latitude?: number;              // 위도
  longitude?: number;             // 경도
}

export interface Keywords {
  positive: KeywordCode[];
  negative: KeywordCode[];
}

// 각 주거 유형별로 다른 Request 타입
export interface GeneralUpdateReviewRequest {
  generalReview: GeneralReview;
  imageUrls: string[];
  keywords: Keywords;
  buildingRequest?: BuildingRequest;
}

export interface AgencyUpdateReviewRequest {
  agencyReview: AgencyReview;
  imageUrls: string[];
  keywords: Keywords;
  buildingRequest?: BuildingRequest;
}

export interface DormitoryUpdateReviewRequest {
  dormitoryReview: DormitoryReview;
  imageUrls: string[];
  keywords: Keywords;
  buildingRequest?: BuildingRequest;
  condition: Condition;
  facilities: Facilities;
}

export type UpdateReviewRequest = 
  | GeneralUpdateReviewRequest 
  | AgencyUpdateReviewRequest 
  | DormitoryUpdateReviewRequest;