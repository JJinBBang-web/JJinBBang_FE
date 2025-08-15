// src/hooks/useReviewList.ts
import { useQuery } from "@tanstack/react-query";
import { BuildingAPI } from "../api/building/BuildingAPI";
import { BuidlingReviewListResponse } from "../types/entity/building/BuildingReviewLIstInterface";

interface ReviewListParams {
  buildingId: string;
  num?: number;
  page?: number;
  sortBy?: 'LATEST' | 'LIKES' | 'STARS';
  isAgency?: boolean;
}

export const useBuildingReviewList = (params: ReviewListParams) => {
  return useQuery<BuidlingReviewListResponse>({
    queryKey: ['reviewList', params.buildingId, params.page, params.sortBy, params.isAgency],
    queryFn: () => BuildingAPI.getReviewList(params.buildingId, {
      num: params.num,
      page: params.page,
      sortBy: params.sortBy,
      isAgency: params.isAgency,
    }),
    staleTime: 1000 * 60 * 3,
  });
};
