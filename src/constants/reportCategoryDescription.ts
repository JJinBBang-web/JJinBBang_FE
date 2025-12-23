export const CATEGORY_DESCRIPTION = {
  부동산: {
    title: "자취방 A to Z",
    sub: "자취방이 처음이라면? 필수 확인 목록들!",
  },
  자취꿀팁: {
    title: "자취 꿀팁 모음",
    sub: "초보 자취러를 위한 현실 꿀팁!",
  },
  대학생활: {
    title: "대학생활 잘하는 법",
    sub: "꿀같은 캠퍼스 라이프 만들기!",
  },
  이사관련: {
    title: "이사 준비 체크리스트",
    sub: "이사 전 꼭 해야 할 것들!",
  },
} as const;

export type KorCategory = keyof typeof CATEGORY_DESCRIPTION;
