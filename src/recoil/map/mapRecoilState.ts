import { atom } from "recoil";

// 매물 유형 상태
export const housingTypeState = atom<string | null> ({
    key: "housingTypeState",
    default: "전체",
})

// 임시 변경 상태
export const selectedTypeState = atom<string | null> ({
    key: "selectedTypeState",
    default: null,
})

// 검색 키워드 상태
export const searchKeywordState = atom<string>({
    key: "searchKeywordState",
    default : "",
})

// 필터 상태 타입 정의
interface FilterStateType {
    reviewType: string;
    university: string;
    contractType: string;
}

// 필터 상태
export const filterState = atom<FilterStateType>({
    key: "filterState",
    default :  {
        reviewType: "후기별",
        university: "전체",
        contractType: "전체",
      },
})


// 지도 마커 데이터 상태
export const markersState = atom({
    key: "markersState",
    default: [],
  });

// 선택된 마커 정보 상태
export const selectedMarkerState = atom({
    key: "selectedMarkerState",
    default: null,
  });