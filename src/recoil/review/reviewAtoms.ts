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
  dormitoryFee: number | null;
  roomCapacity: number | undefined; // Changed from null to undefined
  pros: string[];
  cons: string[];
  content: string;
  rating: number;
  images: string[];
  description: string;
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
    dormitoryFee: null,
    roomCapacity: undefined, // Using undefined instead of null
    pros: [],
    cons: [],
    content: '',
    rating: 0,
    images: [],
    description: '',
  },
});
