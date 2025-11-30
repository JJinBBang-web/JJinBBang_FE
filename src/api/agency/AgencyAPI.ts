// 공인중개사 조회 API

import { getAPI } from '../baseAPI';
import {
  AgencySearchParams,
  AgencySearchResponse,
} from '../../types/entity/agency/AgencyInterface';

// 개발 환경용 Mock 데이터 사용 여부
const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

export const AgencyAPI = {
  /**
   * 공인중개사 조회
   * @param params - 검색 파라미터 (상호명 필수)
   * @returns 공인중개사 목록
   */
  searchAgency: async (
    params: AgencySearchParams
  ): Promise<AgencySearchResponse> => {
    const { agencyName, num = 10, page = 1 } = params;

    // 개발 환경에서는 Mock 데이터 반환 (API 미구현 시)
    if (USE_MOCK_DATA) {
      // Mock 데이터 생성
      return new Promise((resolve) => {
        setTimeout(() => {
          // 검색어가 포함된 Mock 데이터 생성
          const mockItems = agencyName.includes('편한') || agencyName.includes('찐빵')
            ? [
                {
                  registerNumber: '1234567890',
                  companyName: `${agencyName}`,
                  brokerName: '홍길동',
                  roadAddress: '서울시 서초구 서초대로 74길 33',
                  jibunAddress: '서울시 서초구 서초동 1303-37',
                  latitude: 37.4833,
                  longitude: 127.0322,
                },
                {
                  registerNumber: '0987654321',
                  companyName: `${agencyName} 2호점`,
                  brokerName: '김철수',
                  roadAddress: '서울시 강남구 테헤란로 152',
                  jibunAddress: '서울시 강남구 역삼동 737-32',
                  latitude: 37.5012,
                  longitude: 127.0396,
                },
              ]
            : [];

          resolve({
            code: 200,
            message: '공인중개사 조회 성공 (Mock)',
            data: {
              items: mockItems,
              num,
              page,
              totalCount: mockItems.length,
            },
          });
        }, 500); // 실제 API 호출처럼 지연 시뮬레이션
      });
    }

    // 프로덕션 환경에서는 실제 API 호출
    // Query String 생성
    const queryParams = new URLSearchParams({
      agencyName,
      num: num.toString(),
      page: page.toString(),
    });

    const url = `/api/v1/agency/search?${queryParams.toString()}`;

    // Bearer Token 포함하여 GET 요청
    const response = await getAPI(url, true);
    return response;
  },
};
