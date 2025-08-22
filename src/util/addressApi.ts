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
