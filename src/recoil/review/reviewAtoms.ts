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

  // 기숙사 필드
  roomCapacity?: number;
  university?: string;
  dormitoryName?: string;
  dormitoryCondition?: string;
  dormitoryLocation?: string;
  dormitoryGpa?: string;
  dormitoryFee?: number;
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
