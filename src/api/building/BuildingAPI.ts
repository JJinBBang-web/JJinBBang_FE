import {BuildingResponse} from "../../types/entity/building/BuilidngInterface"
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
      });

      if (!response.data || response.data.code !== 200) {
        throw new Error("건물 상세 조회 실패");
      }

      return response.data.data;
    } catch (error) {
      console.error("BuildingAPI.getBuildingDetail error:", error);
      throw error;
    }
  }
}