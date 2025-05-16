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
  roomCapacity?: number;
  dormitoryFee?: number;
  dormitoryConditions?: {
    hasDistanceCriteria: boolean;
    hasGradeCriteria: boolean;
    dormitoryFee: number;
    residenceArea?: string;
    semesterGrade?: number;
    roomCapacity?: number;
  };
}

export const reviewState = atom<ReviewState>({
  key: 'reviewState',
  default: {
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
  },
});
