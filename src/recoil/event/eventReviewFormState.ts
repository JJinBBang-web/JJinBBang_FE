import { atom, selector } from "recoil";
import type { PriceValue } from "../../components/event/PriceInput";

export type EventReviewForm = {
  // 대학교
  university: string;

  // 주소
  address: {
    keyword: string; // 인풋에 보이는 텍스트
    roadAddress?: string; // 실제 선택된 주소
    detail?: string; // 상세 주소
    lat?: number;
    lng?: number;
  };

  // 가격
  price: PriceValue;

  // 장단점
  pros: string[];
  cons: string[];

  // 사진
  photos: string[];

  // 후기 텍스트
  reviewText: string;

  // 이벤트 참여 정보
  phone: string;
  agreeMarketing: boolean;
  agreePrivacy: boolean;

  // UI 상태(선택): 제출 시 로딩/에러 등
  ui: {
    isSubmitting: boolean;
    submitError?: string;
  };
};

export const eventReviewFormState = atom<EventReviewForm>({
  key: "eventReviewFormState",
  default: {
    university: "",
    address: { keyword: "" },
    price: {
      rentType: "MONTHLY",
      deposit: "",
      monthlyRent: "",
      maintenanceFee: "",
    },
    pros: [],
    cons: [],
    photos: [],
    reviewText: "",
    phone: "",
    agreeMarketing: false,
    agreePrivacy: false,
    ui: { isSubmitting: false },
  },
});

// 1단계 버튼 활성화 (대학교 ~ 방 사진 인증까지)
export const eventReviewStep1ValidState = selector({
  key: "eventReviewStep1ValidState",
  get: ({ get }) => {
    const f = get(eventReviewFormState);

    // 대학교 선택 여부
    const hasUniversity = f.university.trim() !== "";
    // 주소 입력 여부
    const hasAddress = !!(f.address.roadAddress || f.address.keyword.trim());
    const hasPrice =
      f.price.deposit.trim() !== "" &&
      f.price.maintenanceFee.trim() !== "" &&
      (f.price.rentType === "JEONSE"
        ? true
        : f.price.monthlyRent.trim() !== "");

    const prosOk = f.pros.length >= 3 && f.pros.length <= 5;
    const consOk = f.cons.length >= 3 && f.cons.length <= 5;

    return (
      hasUniversity &&
      hasAddress &&
      hasPrice &&
      prosOk &&
      consOk
    );
  },
});

// 2단계 버튼 활성화 (찐 후기 작성 + 이벤트 참여 정보)
export const eventReviewStep2ValidState = selector({
  key: "eventReviewStep2ValidState",
  get: ({ get }) => {
    const f = get(eventReviewFormState);

    const reviewOk = f.reviewText.trim().length >= 20;
    // 휴대폰 번호는 하이픈 제거 후 정확히 11자리여야 함
    const phoneNumbersOnly = f.phone.replace(/[^\d]/g, "");
    const phoneOk = phoneNumbersOnly.length === 11;
    const agreeOk = f.agreeMarketing && f.agreePrivacy;

    return reviewOk && phoneOk && agreeOk;
  },
});

// 전체 버튼 활성화 같은 "계산 상태"는 selector로
export const eventReviewFormValidState = selector({
  key: "eventReviewFormValidState",
  get: ({ get }) => {
    const step1Valid = get(eventReviewStep1ValidState);
    const step2Valid = get(eventReviewStep2ValidState);

    return step1Valid && step2Valid;
  },
});
