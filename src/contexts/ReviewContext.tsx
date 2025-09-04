// src/contexts/ReviewContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface ReviewState {
  // 기본 정보
  buildingType?: string;
  dormitoryName?: string;
  floor?: number;
  contractType?: string;
  monthlyRent?: number;
  securityDeposit?: number;

  // 기숙사 조건
  dormitoryConditions?: {
    airConditioner: boolean;
    washingMachine: boolean;
    dryer: boolean;
    refrigerator: boolean;
    microwave: boolean;
    wifi: boolean;
    bed: boolean;
    desk: boolean;
    closet: boolean;
    bathroom: boolean;
    kitchen: boolean;
    livingRoom: boolean;
  };

  // 시설
  dormitoryAmenities?: string[];

  // 장단점
  advantages?: string[];
  disadvantages?: string[];

  // 리뷰 내용
  content?: string;

  // 이미지
  photos?: string[];
}

type ReviewAction =
  | { type: 'SET_BUILDING_TYPE'; payload: string }
  | { type: 'SET_DORMITORY_NAME'; payload: string }
  | { type: 'SET_FLOOR'; payload: number }
  | { type: 'SET_CONTRACT_TYPE'; payload: string }
  | { type: 'SET_MONTHLY_RENT'; payload: number }
  | { type: 'SET_SECURITY_DEPOSIT'; payload: number }
  | { type: 'SET_DORMITORY_CONDITIONS'; payload: ReviewState['dormitoryConditions'] }
  | { type: 'SET_DORMITORY_AMENITIES'; payload: string[] }
  | { type: 'SET_ADVANTAGES'; payload: string[] }
  | { type: 'SET_DISADVANTAGES'; payload: string[] }
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_PHOTOS'; payload: string[] }
  | { type: 'UPDATE_REVIEW'; payload: Partial<ReviewState> }
  | { type: 'RESET_REVIEW' };

const initialState: ReviewState = {};

function reviewReducer(state: ReviewState, action: ReviewAction): ReviewState {
  switch (action.type) {
    case 'SET_BUILDING_TYPE':
      return { ...state, buildingType: action.payload };
    case 'SET_DORMITORY_NAME':
      return { ...state, dormitoryName: action.payload };
    case 'SET_FLOOR':
      return { ...state, floor: action.payload };
    case 'SET_CONTRACT_TYPE':
      return { ...state, contractType: action.payload };
    case 'SET_MONTHLY_RENT':
      return { ...state, monthlyRent: action.payload };
    case 'SET_SECURITY_DEPOSIT':
      return { ...state, securityDeposit: action.payload };
    case 'SET_DORMITORY_CONDITIONS':
      return { ...state, dormitoryConditions: action.payload };
    case 'SET_DORMITORY_AMENITIES':
      return { ...state, dormitoryAmenities: action.payload };
    case 'SET_ADVANTAGES':
      return { ...state, advantages: action.payload };
    case 'SET_DISADVANTAGES':
      return { ...state, disadvantages: action.payload };
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    case 'SET_PHOTOS':
      return { ...state, photos: action.payload };
    case 'UPDATE_REVIEW':
      return { ...state, ...action.payload };
    case 'RESET_REVIEW':
      return initialState;
    default:
      return state;
  }
}

interface ReviewContextType {
  reviewState: ReviewState;
  dispatch: React.Dispatch<ReviewAction>;
  updateReview: (updates: Partial<ReviewState>) => void;
  resetReview: () => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviewState, dispatch] = useReducer(reviewReducer, initialState);

  const updateReview = (updates: Partial<ReviewState>) => {
    dispatch({ type: 'UPDATE_REVIEW', payload: updates });
  };

  const resetReview = () => {
    dispatch({ type: 'RESET_REVIEW' });
  };

  return (
    <ReviewContext.Provider value={{ reviewState, dispatch, updateReview, resetReview }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
};