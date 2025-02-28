import { atom } from "recoil";

// 매물 유형 상태
export const housingTypeState = atom<string | null> ({
    key: "housingTypeState",
    default: "전체",
})

// 임시 변경 상태 (하우징)
export const selectedTypeState = atom<string | null> ({
    key: "selectedTypeState",
    default: null,
})

// 임시 변경 상태 (하우징)
export const selectedContractState = atom<string> ({
    key: "selectedContractState",
    default: "ALL",
})

// 임시 변경 상태 (대학교)
export const selectedTypeNumState = atom<number | null> ({
    key: "selectedTypeNumState",
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
    university: number | null;
    contractType: string;
    depositMin : number;
    depositMax : number | null;
    monthlyRentMin : number;
    monthlyRentMax : number | null;
    inMaintenanceCost : Boolean;
}

// 필터 상태
export const filterState = atom<FilterStateType>({
    key: "filterState",
    default :  {
        reviewType: "후기별",
        university: null,
        contractType: "ALL",
        depositMin : 0,
        depositMax : null,
        monthlyRentMin : 0,
        monthlyRentMax : null,
        inMaintenanceCost : false,
      },
})

// 계약/가격 조건 필터 상태
export const depositRangeState = atom<[number, number]>({
    key : "depositRangeState",
    default : [0, 5000],
})

export const monthlyRentRangeState = atom<[number, number]>({
    key : "monthlyRentRangeState",
    default : [0, 500],
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