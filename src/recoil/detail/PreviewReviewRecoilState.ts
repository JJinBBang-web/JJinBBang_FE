import { atom } from "recoil";

// 리뷰 프리뷰 인터페이스
export interface BasicInfo {
    reviewId: number,
    name : string,
    type : string,
    contractType: string,
    deposit: number, // 보증금
    monthlyRent: number, // 월세
    floor: string,
    space: number, // area -> space 변경
    maintenanceCost: number,
    rating: number,
    liked: boolean // false
}

export interface dormitoryBasicInfo {
  id: number; // 리뷰 ID
  name: string;
  type: string;
  university: string;
  floor: string;
  space: number; // area -> space 변경
  capacity: number;
  dormFee: number;
  rating: number; // 평점
  liked: boolean; // 좋아요 여부
}

export interface agencyReviewInfo {
    id : number;
    name : string;
    type : string;
    rating : number;
    liked : boolean;
}

export interface ReviewInfo {
    content: string;
    keywords: string[];
    likesCount: number;
    updatedAt: Date;
}

export interface ReviewPreview {
    basicInfo?: BasicInfo;
    dormitoryBasicInfo?: dormitoryBasicInfo;
    agencyReviewInfo?: agencyReviewInfo;
    reviewInfo: ReviewInfo;
    image?: string;
}

// 리뷰 프리뷰 상태관리
export const ReviewPreviewState = atom<ReviewPreview[]>({
  key: "ReviewPreviewState",
  default: [
    {
      basicInfo: {
        reviewId: 0,
        name: "",
        type: "",
        contractType: "",
        deposit: 0, // 보증금
        monthlyRent: 0, // 월세
        floor: "",
        space: 0.0, // area -> space 변경
        maintenanceCost: 0,
        rating: 0,
        liked: false, // false
      },
      dormitoryBasicInfo: {
        id: 0,
        name: "",
        type: "",
        university: "",
        floor: "",
        space: 0.0,
        capacity: 0,
        dormFee: 0,
        rating: 0,
        liked: false,
      },
      agencyReviewInfo: {
        id: 0,
        name: "",
        type: "",
        rating: 0,
        liked: false,
      },
      reviewInfo: {
        content: "",
        keywords: [],
        likesCount: 0,
        updatedAt: new Date(),
      },
      image: "",
    },
  ],
});