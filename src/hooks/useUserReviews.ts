// src/hooks/useUserReviews.ts
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/user';

export const useUserReviews = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['userReview', page, size],
    queryFn: () =>
      userApi.getUserReviews({
        offset: page * size,
        limit: size,
        orderby: 'latest',
      }),
    staleTime: 1000 * 60 * 5,
  });
};
