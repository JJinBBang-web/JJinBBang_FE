// src/hooks/useCreateReview.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewAPI } from '../api/building/ReviewAPI';
import {
  CreateReviewRequest,
  ReviewCreateResponse,
} from '../types/entity/building/ReviewCreateInterface';
import { reviewAutoSave } from '../util/reviewAutoSave';

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<ReviewCreateResponse, Error, CreateReviewRequest>({
    mutationFn: (reviewData: CreateReviewRequest) =>
      ReviewAPI.createReview(reviewData),
    onSuccess: (data) => {
      // 리뷰 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['reviewList'],
      });

      // 건물 상세 정보 캐시 무효화 (평점 업데이트)
      queryClient.invalidateQueries({
        queryKey: ['buildingDetail'],
      });

      // 리뷰 생성 성공 시 자동저장 데이터 정리
      reviewAutoSave.clear();
    },
  });
};
