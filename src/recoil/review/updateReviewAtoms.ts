import { atom } from 'recoil';
import { ReviewState } from './reviewAtoms';

export const updateReviewState = atom<ReviewState | null>({
  key: 'updateReviewState',
  default: null, 
});
