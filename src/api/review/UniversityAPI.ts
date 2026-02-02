import { CampusSearchResponse, DormitoryListResponse } from "../../types/entity/review/UnivAndDormitoryInterface";
import { getAPI } from "../baseAPI";


export class UniversityAPI {
  /**
   * 대학/캠퍼스 검색
   * - query 공백 제거 후 호출
   * - limit 기본 15, offset 기본 0
   */
  static async searchCampus(params: {
    query: string;
    limit?: number;
    offset?: number;
  }): Promise<CampusSearchResponse> {
    const q = (params.query ?? "").replace(/\s+/g, ""); // 공백 제거
    const limit = params.limit ?? 15;
    const offset = params.offset ?? 0;

    // query는 필수
    if (!q) {
      // 프로젝트 스타일에 맞게 throw 하거나 빈 결과로 처리해도 됨
      throw new Error("query는 필수입니다.");
    }

    const qs = new URLSearchParams({
      query: q,
      limit: String(limit),
      offset: String(offset),
    }).toString();

    try {
        const response = await getAPI(`/api/v1/user/univ/search?${qs}`, true);
        return response.data;
    } catch(e) {
        throw e;
    }

  }

  /**
   * 캠퍼스ID 기반 기숙사 목록 조회
   */
  static async getDormitoriesByCampusId(params: {
    campusId: number;
  }): Promise<DormitoryListResponse> {
    const qs = new URLSearchParams({
      campusId: String(params.campusId),
    }).toString();

    try {
        const response = await getAPI(`/api/v1/building/dormitory?${qs}`, true);
        return response.data;
    } catch(e) {
        throw e;
    }
  }
}