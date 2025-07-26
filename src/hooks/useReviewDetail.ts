import { useQuery } from "@tanstack/react-query";
import { ReviewAPI } from "../api/building/ReviewAPI";

export const useReviewDetail = (reviewId: string, reviewType: string) => {
  return useQuery({
    queryKey: ["reviewDetail", reviewId, reviewType],
    queryFn: () => ReviewAPI.getReviewDetail(reviewId, reviewType),
    staleTime: 1000 * 60 * 5,
  });
};