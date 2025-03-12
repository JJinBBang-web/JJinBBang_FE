import { atom } from "recoil";

// 리뷰 상세 정보 인터페이스
export interface BasicInfo {
    reviewId: number, // 후기 id
    contractType: string, // 계약 형태 (월세, 전세)
    deposit: number, // 보증금
    monthlyRent: number|null, // 월세 (계약 형태가 전세인 경우 null)
    liked: boolean // 후기에 대한 사용자의 좋아요 유무
    floor: string, // 층수 (저층, 중층, 고층)
    space: number, // 면적 area -> space
    maintenanceCost: number, // 관리비
    rating: number, // 평점
    content: string, // 후기 내용
    likesCount: number, // 후기 좋아요 수
    updatedAt: Date
}

export interface ReviewImages {
    count : number, // 이미지 수
    imageUrl : string[]
}

export interface Building {
    buildingId : number, // 건물 id
    name : string, // 건물 이름
    type : string, // 건물 유형
    address : string, // 건물 주소
    latitude: number, // 건물 위도
    longitude: number, // 건물 경도
}

export interface Keywords {
    positive : string[],
    negative : string[]
}

export interface Review {
    basicInfo: BasicInfo;
    reviewImages: ReviewImages;
    building: Building;
    keywords : Keywords;
    authorId : number
}

// 빌딩 정보 상태관리
export const ReviewInfoState = atom<Review>({
    key : "ReviewInfoState",
    default : {
        basicInfo: {
            reviewId: 0, // 후기 id
            contractType: '', // 계약 형태 (월세, 전세)
            deposit: 0, // 보증금
            monthlyRent: null, // 월세 (계약 형태가 전세인 경우 null)
            liked: false, // 후기에 대한 사용자의 좋아요 유무
            floor: '', // 층수 (저층, 중층, 고층)
            space: 0, // 면적 area -> space
            maintenanceCost: 0, // 관리비
            rating: 0, // 평점
            content: '', // 후기 내용
            likesCount: 0, // 후기 좋아요 수
            updatedAt : new Date()
        },
        reviewImages: {
            count: 0,
            imageUrl: []
        },
        building : {
            buildingId : 0, // 건물 id
            name : '', // 건물 이름
            type : '', // 건물 유형
            address : '', // 건물 주소
            latitude: 0, // 건물 위도
            longitude: 0, // 건물 경도
        },
        keywords: {
            positive : [],
            negative : []
        },
        authorId : 1,
    }
})