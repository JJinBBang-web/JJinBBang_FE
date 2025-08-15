export const typeToKorean: Record<string, string> = {
  ROOM: "원/투룸",
  HOUSE: "주택/빌라",
  OFFICETEL: "오피스텔",
  APARTMENT: "아파트",
  DORMITORY: "기숙사",
  BOARDING_HOUSE: "하숙집/고시원",
  AGENCY: "공인중개사",
};

export const koreanToType: Record<string, string> = Object.entries(typeToKorean)
  .reduce((acc, [eng, kor]) => {
    acc[kor] = eng;
    return acc;
  }, {} as Record<string, string>);

export const contractTypeToKorean: Record<string, string> = {
  MONTHLY_RENT: '월세',
  DEPOSIT_RENT: '전세',
};

export const koreanToContractType: Record<string, string> = Object.entries(contractTypeToKorean)
  .reduce((acc, [eng, kor]) => {
    acc[kor] = eng;
    return acc;
  }, {} as Record<string, string>);

export const floorToKorean: Record<string, string> = {
  HIGH: '고층',
  MID: '중층',
  LOW: '저층',
  BASEMENT : '반지하',
  ATTIC : '옥탑',
};

export const koreanToFloor: Record<string, string> = Object.entries(floorToKorean)
  .reduce((acc, [eng, kor]) => {
    acc[kor] = eng;
    return acc;
}, {} as Record<string, string>);