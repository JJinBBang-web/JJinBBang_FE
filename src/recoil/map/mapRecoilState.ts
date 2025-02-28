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

// 임시 변경 상태 (계약)
export const selectedContractState = atom<string> ({
    key: "selectedContractState",
    default: "ALL",
})
// 임시 변경 상태 (관리비)
export const maintenanceCostState = atom<boolean | undefined>({
    key: "maintenanceCostState",
    default : false,
})

// 임시 변경 상태 (대학교)
export const selectedTypeNumState = atom<number | null> ({
    key: "selectedTypeNumState",
    default: null,
})

// 임시 변경 상태 (찐필터)
export const selectedJjinFilterState = atom<[string, string] | null>({
    key : "selectedJjinFilterState",
    default : null,
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
    depositMin : number | null;
    depositMax : number | null;
    monthlyRentMin : number | null;
    monthlyRentMax : number | null;
    inMaintenanceCost : boolean | undefined;
    reviewKeyword : [string, string] | null;
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
        reviewKeyword : null,
      },
})

// 계약/가격 조건 필터 상태
export const depositRangeState = atom<[number|null, number|null]>({
    key : "depositRangeState",
    default : [0, null],
})

export const monthlyRentRangeState = atom<[number|null, number|null]>({
    key : "monthlyRentRangeState",
    default : [0, null],
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