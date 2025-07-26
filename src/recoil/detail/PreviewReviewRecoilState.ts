import { atom } from "recoil";

// 리뷰 프리뷰 인터페이스
export interface GeneralReviewInfo {
  id: number;
  name: string;
  type: string;
  contractType: string;
  deposit: number; // 보증금
  monthlyRent: number; // 월세
  floor: string;
  space: number; // area -> space 변경
  maintenanceCost: number;
  rating: number;
  liked: boolean; // false
}

export interface DormitoryReviewInfo {
  id: number; // 리뷰 ID
  name: string;
  type: string;
  universityName: string;
  floor: string;
  capacity: number;
  space: number; // area -> space 변경
  dormFee: number;
  rating: number; // 평점
  liked: boolean; // 좋아요 여부
}

export interface AgencyReviewInfo {
    id : number;
    name : string;
    type : string;
    rating : number;
    liked : boolean;
}

export interface ReviewInfo {
  content: string;
  keyword: string[];
  likeCount: number;
  updateAt: string;

}

export interface ReviewPreview {
  generalReviewInfo?: GeneralReviewInfo;
  dormitoryReviewInfo?: DormitoryReviewInfo;
  agencyReviewInfo?: AgencyReviewInfo;
  reviewInfo: ReviewInfo;
  image?: string;
}

// 리뷰 프리뷰 상태관리
export const ReviewPreviewState = atom<ReviewPreview[]>({
  key: "ReviewPreviewState",
  default: [
    {
      reviewInfo: {
        content: "",
        keyword: [],
        likeCount: 0,
        updateAt: "",

      },
      image: "",
    },
  ],
});