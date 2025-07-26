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
