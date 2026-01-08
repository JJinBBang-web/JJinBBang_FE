import { atom, selector } from "recoil";
import type { PriceValue } from "../../components/event/PriceInput";

export type EventReviewForm = {
  // 주소
  address: {
    keyword: string;        // 인풋에 보이는 텍스트
    roadAddress?: string;   // 실제 선택된 주소
    detail?: string;        // 상세 주소
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

  // UI 상태(선택): 제출 시 로딩/에러 등
  ui: {
    isSubmitting: boolean;
    submitError?: string;
  };
};

export const eventReviewFormState = atom<EventReviewForm>({
  key: "eventReviewFormState",
  default: {
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
    ui: { isSubmitting: false },
  },
});

// 버튼 활성화 같은 “계산 상태”는 selector로
export const eventReviewFormValidState = selector({
  key: "eventReviewFormValidState",
  get: ({ get }) => {
    const f = get(eventReviewFormState);

    const hasAddress = !!(f.address.roadAddress || f.address.keyword.trim());
    const hasPrice =
      f.price.deposit.trim() !== "" &&
      f.price.maintenanceFee.trim() !== "" &&
      (f.price.rentType === "JEONSE" ? true : f.price.monthlyRent.trim() !== "");

    const prosOk = f.pros.length >= 3 && f.pros.length <= 5;
    const consOk = f.cons.length >= 3 && f.cons.length <= 5;

    const reviewOk = f.reviewText.trim().length > 0;
    const phoneOk = f.phone.trim().length >= 10; // 필요하면 정규식으로 더 엄격하게

    return hasAddress && hasPrice && prosOk && consOk && reviewOk && phoneOk;
  },
});
