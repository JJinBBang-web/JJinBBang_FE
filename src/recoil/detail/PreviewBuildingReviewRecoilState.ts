import { atom } from "recoil";
import { Boundary } from "../../types/entity/map/MapInterface";

// 리뷰 프리뷰 인터페이스
export interface GeneralBuildingInfo {
  id: number;
  name: string;
  type: string[];
  address: string;
  rating: number;
  liked: boolean;
  reviewCount: number;
}

export interface DormitoryBuildingInfo {
  id: number; // 리뷰 ID
  name: string;
  type: string;
  universityName: string;
  address: string;
  rating: number; // 평점
  reviewCount: number;
  liked: boolean; // 좋아요 여부
}

export interface AgencyBuildingInfo {
  id: number;
  name: string;
  type: string;
  address: string;
  rating: number;
  liked: boolean;
  reviewCount: number;
}

export interface ReviewInfo {
  content: string;
  keyword: string[];
  likeCount: number;
  updateAt: string;
}

export interface PreviewBuildingReviewInfo {
  generalBuildingInfo?: GeneralBuildingInfo;
  dormitoryBuildInfo?: DormitoryBuildingInfo;
  agencyBuildingInfo?: AgencyBuildingInfo;
  reviewInfo: ReviewInfo;
  image: string;
  boundInfo?:Boundary;
}

// 리뷰 프리뷰 상태관리
export const PreviewBuildingReviewState = atom<PreviewBuildingReviewInfo[]>({
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
