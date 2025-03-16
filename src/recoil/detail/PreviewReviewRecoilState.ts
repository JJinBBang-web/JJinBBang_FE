import { atom } from "recoil";

// 리뷰 프리뷰 인터페이스
export interface BasicInfo {
    reviewId: number,
    name : string,
    type : string,
    contractType: string,
    deposit: number, // 보증금
    monthlyRent: number, // 월세
    floor: number, // 옥탑방은 0, 반지하는 -1
    space: number, // area -> space 변경
    maintenanceCost: number,
    rating: number,
    liked: boolean // false
}

export interface ReviewInfo {
    content: string;
    keywords: string[];
    likesCount: number;
    updatedAt: Date;
}

export interface ReviewPreview {
    basicInfo: BasicInfo;
    reviewInfo: ReviewInfo;
    reviewImage: string;
}

// 리뷰 프리뷰 상태관리
export const ReviewPreviewState = atom<ReviewPreview[]>({
    key : "ReviewPreviewState",
    default : [{
        basicInfo : {
                reviewId: 0,
                name : "",
                type : "",
                contractType: "",
                deposit: 0, // 보증금
                monthlyRent: 0, // 월세
                floor: 0, // 옥탑방은 0, 반지하는 -1
                space: 0.0, // area -> space 변경
                maintenanceCost: 0,
                rating: 0,
                liked: false // false
        },
        reviewInfo : {
                content: "",
                keywords: [],
                likesCount: 0,
                updatedAt: new Date(),
                },
        reviewImage: ""
    },]
})