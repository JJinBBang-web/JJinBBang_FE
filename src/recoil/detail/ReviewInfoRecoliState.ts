import { atom } from "recoil";

// 리뷰 상세 정보 인터페이스
export interface BasicInfo {
    id: number, // 후기 id
    name: string,
    type: string,
    contractType: string, // 계약 형태 (월세, 전세)
    deposit: number, // 보증금
    monthlyRent: number|null, // 월세 (계약 형태가 전세인 경우 null)
    floor: string, // 층수 (저층, 중층, 고층)
    space: number, // 면적 area -> space
    maintenanceCost: number, // 관리비
    rating: number, // 평점
    liked: boolean // 후기에 대한 사용자의 좋아요 유무
}

export interface DormInfo {
    id : number,
    name : string,
    type: string,
    university: string,
    floor: string,
    capacity: number,
    dormFee: number,
    rating: number,
    liked:boolean,
}

export interface AgencyInfo {
    id : number,
    name: string,
    type: string,
    rating: number,
    liked: boolean
}

export interface reviewInfo {
    content: string,
    keywords: null,
    likesCount: number,
    updatedAt: Date
}

export interface ReviewImages {
    count : number, // 이미지 수
    imageUrl : string[]
}

export interface GeneralBuilding {
    buildingId : number, // 건물 id
    buildingCode: string,
    name : string, // 건물 이름
    type : string, // 건물 유형
    address : string, // 건물 주소
    latitude: number, // 건물 위도
    longitude: number, // 건물 경도
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

export interface Conditions {
    currnet_region : string,
    currnet_grade : string,
}

export interface Facilities {
    private: string[],
    public : string[],
    lounge: boolean,
}

export interface Review {
    generalReviewInfo?: BasicInfo;
    domitoryReviewInfo?: DormInfo;
    agencyReviewInfo?: AgencyInfo;
    reviewInfo: reviewInfo;
    reviewImages: ReviewImages;
    building: GeneralBuilding | Building;
    keywords : Keywords;
    authorId : number
    conditions?: Conditions,
    facilities?: Facilities,
}

// 빌딩 정보 상태관리
export const ReviewInfoState = atom<Review>({
    key : "ReviewInfoState",
    default : {
        generalReviewInfo : {
            id: 0,
            name: "",
            type: "",
            contractType: "",
            deposit: 0,
            monthlyRent: null,
            floor: "",
            space: 0,
            maintenanceCost: 0,
            rating: 0,
            liked: false
        },
        domitoryReviewInfo : {
            id: 0,
            name: "",
            type: "",
            university: "",
            floor: "",
            capacity: 0,
            dormFee: 0,
            rating: 0,
            liked: false
        },
        agencyReviewInfo : {
            id: 0,
            name: "",
            type: "",
            rating: 0,
            liked: false
        },
        reviewInfo : {
            content: "",
            keywords: null,
            likesCount: 0,
            updatedAt: new Date()
        },
        reviewImages: {
            count: 0,
            imageUrl: []
        },
        building : {
            buildingId : 0, // 건물 id
            buildingCode: '0000',
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
        conditions: {
            currnet_region: "",
            currnet_grade: ""
        },
        facilities:{
            private: [],
            public: [],
            lounge: false
        },
        authorId : 1,
    }
})