// 공인중개사 조회 API 인터페이스

// 공인중개사 정보
export interface AgencyInfo {
  registerNumber: string;  // 개설등록번호
  companyName: string;     // 상호명
  brokerName: string;      // 중개사명
  roadAddress: string;     // 도로명주소
  jibunAddress: string;    // 지번주소
  latitude: number;        // 위도
  longitude: number;       // 경도
}

// 공인중개사 조회 요청 파라미터
export interface AgencySearchParams {
  agencyName: string;      // 공인중개사 상호명 (필수)
  num?: number;            // 한 페이지에서 조회할 중개사 수 (선택, 기본 10, 1-10)
  page?: number;           // 페이지 번호 (선택, 기본 1)
}

// 공인중개사 조회 응답 데이터
export interface AgencySearchData {
  items: AgencyInfo[];     // 조회된 공인중개사 목록
  num: number;             // 요청한 페이지당 개수
  page: number;            // 현재 페이지 번호
  totalCount: number;      // 전체 검색 결과 수
}

// 공인중개사 조회 API 응답
export interface AgencySearchResponse {
  code: number;
  message: string;
  data: AgencySearchData;
}
