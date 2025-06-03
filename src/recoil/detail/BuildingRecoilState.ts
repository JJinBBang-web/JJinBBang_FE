import { atom } from "recoil";

// 빌딩 정보 인터페이스
export interface generalBuildingInfo {
    liked: boolean;
    id: number | null;
    type: string[];
    name: string;
    address: string;
    rating: number;
    reviewCount: number;
}

export interface BuildingImages {
    count : number;
    imageUrl : string[];
}

export interface Keywords {
    key : string;
    count : number;
}

export interface agencyBuildingInfo{
    liked: boolean;
    id: number | null;
    type: string[];
    name: string;
    address: string;
    rating: number;
    reviewCount: number;
}

export interface dormBuildingInfo{
    liked: boolean;
    id: number | null;
    type: string[];
    name: string;
    campus: string;
    address: String;
    rating: number;
    reviewCount: number;
}

export interface Building{
    basicInfo : generalBuildingInfo | agencyBuildingInfo | dormBuildingInfo;
    buildingImages: BuildingImages;
    keywords : Keywords[];
}

// 빌딩 정보 상태관리
export const BuildingInfoState = atom<Building>({
    key : "BuildingInfoState",
    default : {
        basicInfo: {
            liked: false,
            id: null,
            type: [],
            name: "",
            address: "",
            rating: 0,
            reviewCount: 0,
            campus: "",
        },
        buildingImages: {
            count: 0,
            imageUrl: []
        },
        keywords: []
    }
})