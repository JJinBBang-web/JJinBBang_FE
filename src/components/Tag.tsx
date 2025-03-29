// src/components/Tag.tsx
import PO_LO_01 from "../assets/image/PO_LO_01.svg";
import PO_LO_02 from "../assets/image/PO_LO_02.svg";
import PO_LO_03 from "../assets/image/PO_LO_03.svg";
import PO_LO_04 from "../assets/image/PO_LO_04.svg";
import PO_LO_05 from "../assets/image/PO_LO_05.svg";
import PO_LO_06 from "../assets/image/PO_LO_06.svg";
import PO_LO_07 from "../assets/image/PO_LO_07.svg";
import PO_LO_08 from "../assets/image/PO_LO_08.svg";

import PO_ST_01 from "../assets/image/PO_ST_01.svg";
import PO_ST_02 from "../assets/image/PO_ST_02.svg";
import PO_ST_03 from "../assets/image/PO_ST_03.svg";
import PO_ST_04 from "../assets/image/PO_ST_04.svg";
import PO_ST_05 from "../assets/image/PO_ST_05.svg";
import PO_ST_06 from "../assets/image/PO_ST_06.svg";
import PO_ST_07 from "../assets/image/PO_ST_07.svg";

import PO_MT_01 from "../assets/image/PO_MT_01.svg";
import PO_MT_02 from "../assets/image/PO_MT_02.svg";
import PO_MT_03 from "../assets/image/PO_MT_03.svg";
import PO_MT_04 from "../assets/image/PO_MT_04.svg";
import PO_MT_05 from "../assets/image/PO_MT_05.svg";
import PO_MT_06 from "../assets/image/PO_MT_06.svg";
import PO_MT_07 from "../assets/image/PO_MT_07.svg";

import NE_LO_01 from "../assets/image/NE_LO_01.svg";
import NE_LO_02 from "../assets/image/NE_LO_02.svg";
import NE_LO_03 from "../assets/image/NE_LO_03.svg";
import NE_LO_04 from "../assets/image/NE_LO_04.svg";
import NE_LO_05 from "../assets/image/NE_LO_05.svg";
import NE_LO_06 from "../assets/image/NE_LO_06.svg";
import NE_LO_07 from "../assets/image/NE_LO_07.svg";
import NE_LO_08 from "../assets/image/NE_LO_08.svg";

import NE_ST_01 from "../assets/image/NE_ST_01.svg";
import NE_ST_02 from "../assets/image/NE_ST_02.svg";
import NE_ST_03 from "../assets/image/NE_ST_03.svg";
import NE_ST_04 from "../assets/image/NE_ST_04.svg";
import NE_ST_05 from "../assets/image/NE_ST_05.svg";
import NE_ST_06 from "../assets/image/NE_ST_06.svg";
import NE_ST_07 from "../assets/image/NE_ST_07.svg";

import NE_MT_01 from "../assets/image/NE_MT_01.svg";
import NE_MT_02 from "../assets/image/NE_MT_02.svg";
import NE_MT_03 from "../assets/image/NE_MT_03.svg";
import NE_MT_04 from "../assets/image/NE_MT_04.svg";
import NE_MT_05 from "../assets/image/NE_MT_05.svg";
import NE_MT_06 from "../assets/image/NE_MT_06.svg";
import NE_MT_07 from "../assets/image/NE_MT_07.svg";

export const tagImages: { [key: string]: string } = {
  PO_LO_01, PO_LO_02, PO_LO_03, PO_LO_04, PO_LO_05, PO_LO_06, PO_LO_07, PO_LO_08,
  PO_ST_01, PO_ST_02, PO_ST_03, PO_ST_04, PO_ST_05, PO_ST_06, PO_ST_07,
  PO_MT_01, PO_MT_02, PO_MT_03, PO_MT_04, PO_MT_05, PO_MT_06, PO_MT_07,

  NE_LO_01, NE_LO_02, NE_LO_03, NE_LO_04, NE_LO_05, NE_LO_06, NE_LO_07, NE_LO_08,
  NE_ST_01, NE_ST_02, NE_ST_03, NE_ST_04, NE_ST_05, NE_ST_06, NE_ST_07,
  NE_MT_01, NE_MT_02, NE_MT_03, NE_MT_04, NE_MT_05, NE_MT_06, NE_MT_07,
};


export const tagMessages: { [key: string]: string } = {
  // ✅ 긍정 키워드
  PO_LO_01: "교통 편리",
  PO_LO_02: "깨끗한 환경",
  PO_LO_03: "조용한 동네",
  PO_LO_04: "가까운 공원",
  PO_LO_05: "편의 가까움",
  PO_LO_06: "학교 가까움",
  PO_LO_07: "안전한 동네",
  PO_LO_08: "친절한 이웃",

  PO_ST_01: "좋은 채광",
  PO_ST_02: "좋은 통풍",
  PO_ST_03: "좋은 방음",
  PO_ST_04: "세련된 신축",
  PO_ST_05: "곰팡이 없음",
  PO_ST_06: "냉난방 좋음",
  PO_ST_07: "배수,수압 좋음",

  PO_MT_01: "주차 편리",
  PO_MT_02: "엘리베이터",
  PO_MT_03: "쓰레기 용이",
  PO_MT_04: "관리비 합리",
  PO_MT_05: "인터넷 용이",
  PO_MT_06: "정기적 관리",
  PO_MT_07: "편리한 이사",

  // ✅ 부정 키워드
  NE_LO_01: "교통 불편",
  NE_LO_02: "환경 나쁨",
  NE_LO_03: "동네 시끄러움",
  NE_LO_04: "공원 멂",
  NE_LO_05: "생활권 불편",
  NE_LO_06: "학교 멂",
  NE_LO_07: "불안한 동네",
  NE_LO_08: "불친절한 이웃",

  NE_ST_01: "채광 부족",
  NE_ST_02: "통풍 안됨",
  NE_ST_03: "방음 안됨",
  NE_ST_04: "집이 낡음",
  NE_ST_05: "곰팡이 많음",
  NE_ST_06: "냉난방 나쁨",
  NE_ST_07: "배수,수압 약함",

  NE_MT_01: "주차 불편",
  NE_MT_02: "계단만 있음",
  NE_MT_03: "쓰레기 불편",
  NE_MT_04: "관리비 비쌈",
  NE_MT_05: "인터넷 느림",
  NE_MT_06: "관리 부족",
  NE_MT_07: "불편한 이사",
};

export const tagLongMessages: { [key: string]: string } = {
  // ✅ 긍정 키워드
  PO_LO_01: "교통이 편리해요",
  PO_LO_02: "주변 환경이 깨끗해요",
  PO_LO_03: "동네가 조용해요",
  PO_LO_04: "공원이 가까워요",
  PO_LO_05: "생활권이 편리해요",
  PO_LO_06: "학교와 가까워요",
  PO_LO_07: "동네가 안전해요",
  PO_LO_08: "이웃들이 친절해요",

  PO_ST_01: "채광이 좋아요",
  PO_ST_02: "통풍이 잘 돼요",
  PO_ST_03: "방음이 잘 돼요",
  PO_ST_04: "신축이라 세련됐어요",
  PO_ST_05: "곰팡이가 없어요",
  PO_ST_06: "냉난방이 잘 돼요",
  PO_ST_07: "배수와 수압이 좋아요",

  PO_MT_01: "주차가 편리해요",
  PO_MT_02: "엘리베이터가 있어요",
  PO_MT_03: "쓰레기 처리가 편해요",
  PO_MT_04: "관리비가 합리적이에요",
  PO_MT_05: "인터넷이 잘 돼요",
  PO_MT_06: "관리가 정기적이에요",
  PO_MT_07: "이사가 편했어요",

  // ✅ 부정 키워드
  NE_LO_01: "교통이 불편해요",
  NE_LO_02: "환경이 지저분해요",
  NE_LO_03: "동네가 시끄러워요",
  NE_LO_04: "공원이 멀어요",
  NE_LO_05: "생활권이 불편해요",
  NE_LO_06: "학교와 멀어요",
  NE_LO_07: "동네가 안전하지 않아요",
  NE_LO_08: "이웃들이 불친절해요",

  NE_ST_01: "채광이 부족해요",
  NE_ST_02: "통풍이 안돼요",
  NE_ST_03: "방음이 안돼요",
  NE_ST_04: "집 상태가 낡았어요",
  NE_ST_05: "곰팡이가 많아요",
  NE_ST_06: "냉난방이 안돼요",
  NE_ST_07: "배수와 수압이 약해요",

  NE_MT_01: "주차가 어려워요",
  NE_MT_02: "엘리베이터가 없어요",
  NE_MT_03: "쓰레기 처리가 불편해요",
  NE_MT_04: "관리비가 비싸요",
  NE_MT_05: "인터넷이 느려요",
  NE_MT_06: "관리가 부족해요",
  NE_MT_07: "이사가 힘들었어요",
};