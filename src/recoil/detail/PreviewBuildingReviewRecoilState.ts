import { atom } from "recoil";

// 리뷰 프리뷰 인터페이스
export interface BasicInfo {
  id: number;
  name: string;
  type: string[];
  address: string;
  rating: number;
  reviewCount: number;
  liked: boolean;
}

export interface DormitoryBuildInfo {
  id: number; // 리뷰 ID
  name: string;
  type: string;
  universityName: string;
  address: string;
  rating: number; // 평점
  reviewCount: number;
  liked: boolean; // 좋아요 여부
}

export interface ReviewInfo {
  content: string;
  keywords: string[];
  likesCount: number;
  updatedAt: Date;
}

export interface BuildingReviewPreview {
  basicInfo?: BasicInfo;
  dormitoryBuildInfo?: DormitoryBuildInfo;
  reviewInfo: ReviewInfo;
  reviewImage: string;
}

// 리뷰 프리뷰 상태관리
export const PreviewBuildingReviewState = atom<BuildingReviewPreview[]>({
  key: "ReviewPreviewState",
  default: [
    {
      reviewInfo: {
        content: "",
        keywords: [],
        likesCount: 0,
        updatedAt: new Date(),
      },
      reviewImage: "",
    },
  ],
});
