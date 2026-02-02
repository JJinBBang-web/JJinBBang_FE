// src/recoil/review/reviewAtoms.ts
import { atom } from 'recoil';

export interface ReviewState {
  housingType: string;
  address: string;
  addressDetail: string;
  detailedAddress: string;
  floorType: string;
  contractType: string;
  deposit: number | null;
  monthlyRent: number | null;
  managementFee: number | null;
  pros: string[];
  cons: string[];
  content: string;
  rating: number;
  images: string[];
  description: string;
  dormitoryFee?: number;
  space?:number;
  latitude?: number | null;
  longitude?: number | null; 
  buildingCode?: string;
  universityName?: string;
  campusId?:number;
  dormitoryId?: number;
  dormitoryName?: string;
  dormitoryConditions?: {
    hasDistanceCriteria: boolean;
    hasGradeCriteria: boolean;
    dormitoryFee: number;
    residenceArea?: string;
    semesterGrade?: number;
    roomCapacity?: number;
  };
  facilityConditions?: {
    private: Record<string, boolean>;
    public: Record<string, boolean>;
    lounge: Record<string, boolean>;
  };
}

export const defaultReviewState: ReviewState = {
  housingType: '',
  address: '',
  addressDetail: '',
  detailedAddress: '',
  floorType: '',
  contractType: '',
  deposit: null,
  monthlyRent: null,
  managementFee: null,
  pros: [],
  cons: [],
  content: '',
  rating: 0,
  images: [],
  description: '',
  space: 0,
  latitude: 0,
  longitude: 0,
  buildingCode: '',
  universityName: '',
};

export const reviewState = atom<ReviewState>({
  key: 'reviewState',
  default: defaultReviewState, // 분리한 변수를 default 값으로 설정
});
