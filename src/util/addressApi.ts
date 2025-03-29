// src/util/addressApi.ts
const KAKAO_API_KEY = process.env.REACT_APP_KAKAO_API_KEY || '';

interface KakaoAddressResult {
  address_name: string;
  road_address: {
    address_name: string;
    building_name: string;
  };
  address: {
    address_name: string;
  };
}

export interface AddressResult {
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
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
    }));
  } catch (error) {
    console.error('Address search error:', error);
    return [];
  }
};
