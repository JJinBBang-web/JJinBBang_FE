// 공인중개사 조회 API

import { getAPI } from "../baseAPI";
import {
  AgencySearchParams,
  AgencySearchResponse,
} from "../../types/entity/agency/AgencyInterface";

export const AgencyAPI = {
  /**
   * 공인중개사 조회
   * @param params - 검색 파라미터 (상호명 필수)
   * @returns 공인중개사 목록
   */
  searchAgency: async (
    params: AgencySearchParams
  ): Promise<AgencySearchResponse> => {
    const { agencyName, num = 10, page = 1, cursor } = params;

    // 입력값 검증
    if (!agencyName || agencyName.trim() === "") {
      throw new Error("상호명을 입력해주세요.");
    }

    if (num < 1 || num > 10) {
      throw new Error("조회 개수는 1 이상 10 이하여야 합니다.");
    }

    // Query String 생성
    const queryParams = new URLSearchParams({
      agencyName: agencyName.trim(),
      num: num.toString(),
      page: page.toString(),
    });

    // cursor가 있으면 추가
    if (cursor) {
      queryParams.set("cursor", cursor);
    }

    const url = `/api/v1/agency/search?${queryParams.toString()}`;

    // Bearer Token 포함하여 GET 요청
    const response = await getAPI(url, true);
    return response;
  },
};
