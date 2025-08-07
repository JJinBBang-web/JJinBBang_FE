import { PreviewBuildingReviewInfo } from "../../../recoil/detail/PreviewBuildingReviewRecoilState";
import { ReviewPreview } from "../../../recoil/detail/PreviewReviewRecoilState";

export interface MapBounds {
  neLat: number;
  neLng: number;
  swLat: number;
  swLng: number;
}

export interface MarkerFilter {
  viewType?: 'BUILDING' | 'REVIEW';
  buildType?: string[];
  contractType?: 'MONTHLY_RENT' | 'DEPOSIT_RENT' | null;
  campus?: string[] |  null;
  depositMin?: number | null;
  depositMax?: number | null;
  monthlyRentMin?: number | null;
  monthlyRentMax?: number | null;
  inMaintenanceCost?: boolean;
  reviewKeyword?: string[];
}

export interface MarkerRequest {
  bounds: MapBounds;
  filters: MarkerFilter;
}

export interface MarkerResponse {
  id: number;
  type: "ROOM" | "HOUSE" | "OFFICETEL" | "APARTMENT" | "BOARDING_HOUSE" | "DORMITORY" | "AGENCY";
  latitude: number;
  longitude: number;
}

export interface NearByRequest {
  num : number,
  page : number,
  type : "REVIEW"|"BUILDING",
  sortBy : "RCMND" | "LATEST" | "LIKES" | "STARS",
  idList : number[],
  AgencyIdList: number[] | null,
}

export interface NearByResponse {
  num : number,
  page : number,
  itemNum : number,
  items : PreviewBuildingReviewInfo[],
}

export interface SearchRequest {
  keyword: string,
  num : number,
  page : number,
  filters: MarkerFilter;
}

export interface Boundary {
  latitude : number,
  longitude : number,
}

export interface SearchResponse {
  num : number,
  page : number,
  itemNum : number,
  items : PreviewBuildingReviewInfo[];
}