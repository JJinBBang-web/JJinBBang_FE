import { BuildingReviewResponse } from "../../types/entity/building/BuildingReviewInterface";
import { api } from "../api";

export class ReviewAPI {
    /**
       * 후기 상세 정보 조회 API
       * @param {string} reviewId - 조회할 후기 ID
       * @param {string} reviewType - 후기 유형
       * @returns {Promise<BuildingReviewResponse>} 후기 상세 정보
       */
      static async getReviewDetail(reviewId: string, reviewType: string): Promise<BuildingReviewResponse> {
        try {
          const response = await api.get(`/api/v1/review/${reviewId}`, {
            params: { reviewType },
            useAuth: true,
          });
    
          if (!response.data || response.data.code !== 200) {
            throw new Error("후기 상세 조회 실패");
          }
    
          console.log("✅ Axios Response:", response.data);
    
          return response.data.data;
        } catch (error) {
          console.error("ReviewAPI.getReviewDetail error:", error);
          throw error;
        }
      }
}