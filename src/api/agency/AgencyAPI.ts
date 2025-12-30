// 공인중개사 조회 API

import { getAPI } from '../baseAPI';
import {
  AgencySearchParams,
  AgencySearchResponse,
} from '../../types/entity/agency/AgencyInterface';

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
    if (!agencyName || agencyName.trim() === '') {
      throw new Error('상호명을 입력해주세요.');
    }

    if (num < 1 || num > 10) {
      throw new Error('조회 개수는 1 이상 10 이하여야 합니다.');
    }

    // Query String 생성
    const queryParams = new URLSearchParams({
      agencyName: agencyName.trim(),
      num: num.toString(),
      page: page.toString(),
    });

    // cursor가 있으면 추가
    if (cursor) {
      queryParams.set('cursor', cursor);
    }

    const url = `/api/v1/agency/search?${queryParams.toString()}`;

    console.log('🔍 [AgencyAPI] 요청 정보:', {
      url,
      queryParams: {
        agencyName: agencyName.trim(),
        num,
        page,
      },
      fullUrl: `${process.env.REACT_APP_API_URL || ''}${url}`,
    });

    try {
      // Bearer Token 포함하여 GET 요청
      const response = await getAPI(url, true);
      console.log('✅ [AgencyAPI] 응답 성공:', response);
      return response;
    } catch (error: any) {
      console.error('❌ [AgencyAPI] 에러 발생:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url,
      });
      console.error('❌ [AgencyAPI] 서버 응답 데이터:', error.response?.data);

      // 에러 상태 코드에 따른 처리
      if (error.response?.status === 400) {
        throw new Error('잘못된 요청입니다. 입력값을 확인해주세요.');
      } else if (error.response?.status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      } else if (error.response?.status === 503) {
        throw new Error('서비스가 일시적으로 중단되었습니다. 잠시 후 다시 시도해주세요.');
      } else if (error.response?.status === 500) {
        throw new Error('서버 오류가 발생했습니다.');
      }

      throw error;
    }
  },
};
