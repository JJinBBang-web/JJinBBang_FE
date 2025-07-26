// src/api/user.ts
import { api } from './api';

export interface UserInfoResponse {
  code: number;
  message: string;
  data: {
    id: number;
    email: string | null;
    university: string | null;
    univAuthentication: '미인증' | '대기' | '인증완료';
  };
}

export interface Review {
  id: number;
  title: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  buildingName?: string;
  roomType?: string;
}

export interface UserReviewsResponse {
  code: number;
  message: string;
  data: {
    reviews: Review[];
    total: number;
    hasNext: boolean;
  };
}

export interface ReviewQueryParams {
  offset?: number;
  limit?: number;
  orderby?: 'latest' | 'oldest';
}

export const userApi = {
  getUserInfo: async (): Promise<UserInfoResponse> => {
    const response = await api.get('/api/v1/user', { useAuth: true });
    return response.data;
  },

  getUserReviews: async (
    params: ReviewQueryParams = {}
  ): Promise<UserReviewsResponse> => {
    const { offset = 0, limit = 10, orderby = 'latest' } = params;
    const queryString = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
      orderby,
    }).toString();

    const response = await api.get(`/api/v1/user/review?${queryString}`, {
      useAuth: true,
    });
    return response.data;
  },
};
