// src/util/addressApi.ts
const KAKAO_API_KEY = process.env.REACT_APP_KAKAO_API_KEY || '';

interface KakaoAddressResult {
  address_name: string;
  road_address: {
    address_name: string;
    building_name: string;
    main_building_no?: string;
    sub_building_no?: string;
    building_code?: string;
  };
  address: {
    address_name: string;
    main_address_no?: string;
    sub_address_no?: string;
    building_code?: string;
  };
  x?: string; // longitude
  y?: string; // latitude
}

// 키워드 검색 API 응답 타입
interface KakaoKeywordDocument {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  category_group_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string; // longitude
  y: string; // latitude
  place_url: string;
  distance?: string;
}

interface KakaoKeywordResponse {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
    same_name?: {
      region: string[];
      keyword: string;
      selected_region: string;
    };
  };
  documents: KakaoKeywordDocument[];
}

export interface AddressResult {
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
  buildingCode?: string;
  latitude?: number;
  longitude?: number;
}

export const searchAddress = async (
  keyword: string
): Promise<AddressResult[]> => {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        keyword
      )}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('주소 검색에 실패했습니다');
    }

    const data = await response.json();

    return data.documents.map((item: KakaoAddressResult) => ({
      roadAddress: item.road_address?.address_name || '',
      jibunAddress: item.address.address_name,
      buildingName: item.road_address?.building_name || '',
      buildingCode: item.road_address?.building_code || item.address.building_code || '',
      latitude: item.y ? parseFloat(item.y) : undefined,
      longitude: item.x ? parseFloat(item.x) : undefined,
    }));
  } catch (error) {
    console.error('Address search error:', error);
    return [];
  }
};

// 키워드로 장소 검색 (기숙사용)
export const searchByKeyword = async (
  keyword: string,
  options?: {
    x?: number; // longitude (경도)
    y?: number; // latitude (위도)
    radius?: number; // 반경 (미터, 최대 20000)
    page?: number; // 페이지 번호 (1~45)
    size?: number; // 한 페이지 결과 수 (1~15)
    sort?: 'distance' | 'accuracy'; // 정렬 방식
  }
): Promise<AddressResult[]> => {
  try {
    // 쿼리 파라미터 구성
    const params = new URLSearchParams({
      query: keyword,
    });

    if (options?.x !== undefined) params.append('x', options.x.toString());
    if (options?.y !== undefined) params.append('y', options.y.toString());
    if (options?.radius !== undefined) params.append('radius', options.radius.toString());
    if (options?.page !== undefined) params.append('page', options.page.toString());
    if (options?.size !== undefined) params.append('size', options.size.toString());
    if (options?.sort) params.append('sort', options.sort);

    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?${params.toString()}`;
    console.log('키워드 검색 API 요청 URL:', url);
    console.log('API 키:', KAKAO_API_KEY ? `${KAKAO_API_KEY.substring(0, 10)}...` : 'undefined');

    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
    });

    console.log('API 응답 상태:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      throw new Error(`키워드 검색 실패: ${response.status} ${response.statusText}`);
    }

    const data: KakaoKeywordResponse = await response.json();
    console.log('API 응답 데이터:', data);
    console.log('검색 결과 수:', data.documents.length);

    return data.documents.map((item: KakaoKeywordDocument) => ({
      roadAddress: item.road_address_name || '',
      jibunAddress: item.address_name,
      buildingName: item.place_name, // 장소명을 건물명으로 사용
      buildingCode: item.id, // 카카오 키워드 검색 API의 장소 ID를 buildingCode로 사용
      latitude: parseFloat(item.y),
      longitude: parseFloat(item.x),
    }));
  } catch (error) {
    console.error('Keyword search error:', error);
    return [];
  }
};
