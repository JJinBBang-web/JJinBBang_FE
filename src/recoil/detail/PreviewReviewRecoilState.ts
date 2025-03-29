import { atom } from "recoil";

// 리뷰 프리뷰 인터페이스
export interface BasicInfo {
  id: number;
  name: string;
  type: string;
  contractType: string;
  deposit: number; // 보증금
  monthlyRent: number; // 월세
  floor: number; // 옥탑방은 0, 반지하는 -1
  space: number; // area -> space 변경
  maintenanceCost: number;
  rating: number;
  liked: boolean; // false
}

export interface DormitoryBasicInfo {
  id: number; // 리뷰 ID
  name: string;
  type: string;
  universityName: string;
  floor: number; // 0: 옥탑, -1: 반지하, 1 이상: 층수
  space: number; // 면적 (㎡)
  DormitoryFee: number; // 관리비
  rating: number; // 평점
  liked: boolean; // 좋아요 여부
}

export interface ReviewInfo {
  content: string;
  keywords: string[];
  likesCount: number;
  updatedAt: Date;
}

export interface ReviewPreview {
  basicInfo?: BasicInfo;
  dormitoryBasicInfo?: DormitoryBasicInfo;
  reviewInfo: ReviewInfo;
  image: string;
}

// 리뷰 프리뷰 상태관리
export const ReviewPreviewState = atom<ReviewPreview[]>({
  key: "ReviewPreviewState",
  default: [
    {
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
