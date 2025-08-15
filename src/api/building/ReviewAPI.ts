// src/api/building/ReviewAPI.ts
import {
  CreateReviewRequest,
  ReviewCreateResponse,
  GeneralReviewRequest,
  DormitoryReviewRequest,
  AgencyReviewRequest,
} from '../../types/entity/building/ReviewCreateInterface';
import { BuildingReviewResponse } from '../../types/entity/building/BuildingReviewInterface';
import { api } from '../api';

export class ReviewAPI {
  /**
   * 후기 상세 정보 조회 API
   * @param {string} reviewId - 조회할 후기 ID
   * @param {string} reviewType - 후기 유형
   * @returns {Promise<BuildingReviewResponse>} 후기 상세 정보
   */
  static async getReviewDetail(
    reviewId: string,
    reviewType: string
  ): Promise<BuildingReviewResponse> {
    try {
      const response = await api.get(`/api/v1/review/${reviewId}`, {
        params: { reviewType },
        useAuth: true,
      });

      if (!response.data || response.data.code !== 200) {
        throw new Error('후기 상세 조회 실패');
      }

      console.log('✅ Axios Response:', response.data);

      return response.data.data;
    } catch (error) {
      console.error('ReviewAPI.getReviewDetail error:', error);
      throw error;
    }
  }

  /**
   * 리뷰 작성 API
   * @param {CreateReviewRequest} reviewData - 리뷰 작성 데이터
   * @returns {Promise<ReviewCreateResponse>} 리뷰 작성 결과
   */
  static async createReview(
    reviewData: CreateReviewRequest
  ): Promise<ReviewCreateResponse> {
    try {
      const response = await api.post('/api/v1/review', reviewData, {
        useAuth: true,
      });

      if (!response.data || response.data.code !== 200) {
        throw new Error('리뷰 작성 실패');
      }

      console.log('✅ 리뷰 작성 성공:', response.data);

      return response.data.data;
    } catch (error) {
      console.error('ReviewAPI.createReview error:', error);
      throw error;
    }
  }

  /**
   * 일반 리뷰 작성
   * @param {GeneralReviewRequest} reviewData - 일반 리뷰 데이터
   * @returns {Promise<ReviewCreateResponse>}
   */
  static async createGeneralReview(
    reviewData: GeneralReviewRequest
  ): Promise<ReviewCreateResponse> {
    return this.createReview(reviewData);
  }

  /**
   * 기숙사 리뷰 작성
   * @param {DormitoryReviewRequest} reviewData - 기숙사 리뷰 데이터
   * @returns {Promise<ReviewCreateResponse>}
   */
  static async createDormitoryReview(
    reviewData: DormitoryReviewRequest
  ): Promise<ReviewCreateResponse> {
    return this.createReview(reviewData);
  }

  /**
   * 공인중개사 리뷰 작성
   * @param {AgencyReviewRequest} reviewData - 공인중개사 리뷰 데이터
   * @returns {Promise<ReviewCreateResponse>}
   */
  static async createAgencyReview(
    reviewData: AgencyReviewRequest
  ): Promise<ReviewCreateResponse> {
    return this.createReview(reviewData);
  }

  /**
   * 사용자 작성 리뷰 목록 조회
   * @param options - 페이징 옵션
   * @returns {Promise<any>} 사용자 리뷰 목록
   */
  static async getUserReviews(options?: { page?: number; size?: number }) {
    try {
      const response = await api.get('/api/v1/user/review', {
        params: {
          page: options?.page ?? 0,
          size: options?.size ?? 10,
        },
        useAuth: true,
      });

      if (!response.data || response.data.code !== 200) {
        throw new Error('사용자 리뷰 목록 조회 실패');
      }

      console.log('✅ 사용자 리뷰 목록:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('ReviewAPI.getUserReviews error:', error);
      throw error;
    }
  }
}
