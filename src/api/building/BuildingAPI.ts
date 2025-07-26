import {BuildingResponse} from "../../types/entity/building/BuilidngInterface"
import {BuidlingReviewListResponse} from "../../types/entity/building/BuildingReviewLIstInterface"
import { api } from "../api";


export class BuildingAPI {
    /**
   * 건물 상세 정보 조회 API
   * @param {string} buildingId - 조회할 건물 ID
   * @param {boolean} isAgency - 공인중개사 여부
   * @returns {Promise<BuildingResponse>} 건물 상세 정보
   */
  static async getBuildingDetail(buildingId: string, isAgency: boolean): Promise<BuildingResponse> {
    try {
      const response = await api.get(`/api/v1/building/${buildingId}`, {
        params: { isAgency },
        useAuth: true,
      });

      if (!response.data || response.data.code !== 200) {
        throw new Error("건물 상세 조회 실패");
      }

      console.log("✅ Axios Response:", response.data);


      return response.data.data;
    } catch (error) {
      console.error("BuildingAPI.getBuildingDetail error:", error);
      throw error;
    }
  }

  /**
   * 리뷰 목록 리스트 조회 API
   * @param {string} buildingId - 건물 ID
   * @param options - 쿼리 파라미터
   * @returns {Promise<BuidlingReviewListResponse>}
   */
  static async getReviewList(
    buildingId: string,
    options?: {
      num?: number;
      page?: number;
      sortBy?: 'LATEST' | 'LIKES' | 'STARS';
      isAgency?: boolean;
    }
  ): Promise<BuidlingReviewListResponse> {
    try {
      const response = await api.get(`/api/v1/building/${buildingId}/review`, {
        params: {
          num: options?.num ?? 10,
          page: options?.page ?? 0,
          sortBy: options?.sortBy ?? 'LATEST',
          isAgency: options?.isAgency ?? false,
        },
        useAuth: true,
      });

      console.log("Review API 호출 파라미터", {
        buildingId,
        ...options
      });

      if (!response.data || response.data.code !== 200) {
        throw new Error("리뷰 목록 조회 실패");
      }

      return response.data.data;
    } catch (error) {
      console.error("BuildingAPI.getReviewList error:", error);
      throw error;
    }
  }
}