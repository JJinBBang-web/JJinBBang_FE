import { atom } from 'recoil';

export interface ReviewState {
  housingType: string;
  address: string;
  addressDetail: string;
  detailedAddress: string;
  contractType: string;
  deposit: number | null;
  monthlyRent: number | null;
  managementFee: number | null;
  pros: string[];
  cons: string[];
  content: string;
  rating: number;
  images: string[];
}

export const reviewState = atom<ReviewState>({
  key: 'reviewState',
  default: {
    housingType: '',
    address: '',
    addressDetail: '',
    detailedAddress: '',
    contractType: '',
    deposit: null,
    monthlyRent: null,
    managementFee: null,
    pros: [],
    cons: [],
    content: '',
    rating: 0,
    images: [],
  },
});
