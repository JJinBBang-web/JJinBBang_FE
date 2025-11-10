export type BuildingType = 'ROOM' | 'APARTMENT' | 'OFFICETEL' | 'BOARDING_HOUSE' | 'AGENCY' | 'DORMITORY';

export interface ReviewImage {
  count: number;
  imageUrl: string[];
}

export interface Keyword {
  key: string;
  count: number;
}

interface CommonBuildingInfo {
  id: number;
  name: string;
  address: string;
  type: BuildingType[];
  rating: number;
  liked: boolean;
  reviewCount: number;
}

export type GeneralBuildingInfo = CommonBuildingInfo

export type AgencyBuildingInfo = CommonBuildingInfo

export interface DormitoryBuildingInfo extends Omit<CommonBuildingInfo, 'address'> {
  campus: string;
  address: string;
}

export interface BuildingResponse {
  generalBuildingInfo?: GeneralBuildingInfo;
  agencyBuildingInfo?: AgencyBuildingInfo;
  dormitoryBuildingInfo?: DormitoryBuildingInfo;
  reviewImages: ReviewImage;
  keywords: Keyword[];
}