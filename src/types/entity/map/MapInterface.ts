import { PreviewBuildingReview } from "../../../recoil/detail/PreviewBuildingReviewRecoilState";

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
  latitude: number;
  longitude: number;
  isReviews: boolean;
}

export interface NearByRequest {
  num : number,
  page : number,
  type : "REVIEW"|"BUILDING",
  sortBy : "RCMND" | "LATEST" | "LIKES" | "STARS",
  idList : number[],
}

export interface NearByResponse {
  num : number,
  page : number,
  itemNum : number,
  items : PreviewBuildingReview[],
}