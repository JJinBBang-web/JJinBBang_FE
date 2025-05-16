// src/recoil/dormitory/dormitoryReviewAtoms.ts
import { atom } from 'recoil';

// 편의시설 옵션 인터페이스
interface FacilityOption {
  [key: string]: boolean;
}

// 편의시설 조건 인터페이스
interface FacilityConditions {
  [facility: string]: FacilityOption;
}

// 기숙사 리뷰 상태 인터페이스
export interface DormitoryReviewState {
  dormitoryName: string;
  university: string;
  period: string;
  roomType: string;
  facilityConditions?: FacilityConditions;
  rating: number;
  pros: string[];
  cons: string[];
  description: string;
  images: string[];
}

// 기숙사 리뷰 아톰
export const dormitoryReviewState = atom<DormitoryReviewState>({
  key: 'dormitoryReviewState',
  default: {
    dormitoryName: '',
    university: '',
    period: '',
    roomType: '',
    rating: 0,
    pros: [],
    cons: [],
    description: '',
    images: [],
  },
});
