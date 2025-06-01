// src/recoil/util/filterRecoilState.ts

import { atom } from "recoil";

// ✅ 새로운 아이콘 이미지 import
import PO_BD_LO_01 from "../../assets/image/PO_BD_LO_01.svg";
import PO_BD_LO_02 from "../../assets/image/PO_BD_LO_02.svg";
import PO_BD_LO_03 from "../../assets/image/PO_BD_LO_03.svg";
import PO_BD_LO_04 from "../../assets/image/PO_BD_LO_04.svg";
import PO_BD_LO_05 from "../../assets/image/PO_BD_LO_05.svg";
import PO_BD_LO_06 from "../../assets/image/PO_BD_LO_06.svg";
import PO_BD_LO_07 from "../../assets/image/PO_BD_LO_07.svg";
import PO_BD_LO_08 from "../../assets/image/PO_BD_LO_08.svg";

import PO_BD_ST_01 from "../../assets/image/PO_BD_ST_01.svg";
import PO_BD_ST_02 from "../../assets/image/PO_BD_ST_02.svg";
import PO_BD_ST_03 from "../../assets/image/PO_BD_ST_03.svg";
import PO_BD_ST_04 from "../../assets/image/PO_BD_ST_04.svg";
import PO_BD_ST_05 from "../../assets/image/PO_BD_ST_05.svg";
import PO_BD_ST_06 from "../../assets/image/PO_BD_ST_06.svg";
import PO_BD_ST_07 from "../../assets/image/PO_BD_ST_07.svg";

import PO_BD_MT_01 from "../../assets/image/PO_BD_MT_01.svg";
import PO_BD_MT_02 from "../../assets/image/PO_BD_MT_02.svg";
import PO_BD_MT_03 from "../../assets/image/PO_BD_MT_03.svg";
import PO_BD_MT_04 from "../../assets/image/PO_BD_MT_04.svg";
import PO_BD_MT_05 from "../../assets/image/PO_BD_MT_05.svg";
import PO_BD_MT_06 from "../../assets/image/PO_BD_MT_06.svg";
import PO_BD_MT_07 from "../../assets/image/PO_BD_MT_07.svg";

import NE_BD_LO_01 from "../../assets/image/NE_BD_LO_01.svg";
import NE_BD_LO_02 from "../../assets/image/NE_BD_LO_02.svg";
import NE_BD_LO_03 from "../../assets/image/NE_BD_LO_03.svg";
import NE_BD_LO_04 from "../../assets/image/NE_BD_LO_04.svg";
import NE_BD_LO_05 from "../../assets/image/NE_BD_LO_05.svg";
import NE_BD_LO_06 from "../../assets/image/NE_BD_LO_06.svg";
import NE_BD_LO_07 from "../../assets/image/NE_BD_LO_07.svg";
import NE_BD_LO_08 from "../../assets/image/NE_BD_LO_08.svg";

import NE_BD_ST_01 from "../../assets/image/NE_BD_ST_01.svg";
import NE_BD_ST_02 from "../../assets/image/NE_BD_ST_02.svg";
import NE_BD_ST_03 from "../../assets/image/NE_BD_ST_03.svg";
import NE_BD_ST_04 from "../../assets/image/NE_BD_ST_04.svg";
import NE_BD_ST_05 from "../../assets/image/NE_BD_ST_05.svg";
import NE_BD_ST_06 from "../../assets/image/NE_BD_ST_06.svg";
import NE_BD_ST_07 from "../../assets/image/NE_BD_ST_07.svg";

import NE_BD_MT_01 from "../../assets/image/NE_BD_MT_01.svg";
import NE_BD_MT_02 from "../../assets/image/NE_BD_MT_02.svg";
import NE_BD_MT_03 from "../../assets/image/NE_BD_MT_03.svg";
import NE_BD_MT_04 from "../../assets/image/NE_BD_MT_04.svg";
import NE_BD_MT_05 from "../../assets/image/NE_BD_MT_05.svg";
import NE_BD_MT_06 from "../../assets/image/NE_BD_MT_06.svg";
import NE_BD_MT_07 from "../../assets/image/NE_BD_MT_07.svg";

import PO_AG_PD_01 from "../../assets/image/PO_AG_PD_01.svg";
import PO_AG_PD_02 from "../../assets/image/PO_AG_PD_02.svg";
import PO_AG_PD_03 from "../../assets/image/PO_AG_PD_03.svg";
import PO_AG_PD_04 from "../../assets/image/PO_AG_PD_04.svg";
import PO_AG_PD_05 from "../../assets/image/PO_AG_PD_05.svg";

import PO_AG_SO_01 from "../../assets/image/PO_AG_SO_01.svg";
import PO_AG_SO_02 from "../../assets/image/PO_AG_SO_02.svg";
import PO_AG_SO_03 from "../../assets/image/PO_AG_SO_03.svg";
import PO_AG_SO_04 from "../../assets/image/PO_AG_SO_04.svg";
import PO_AG_SO_05 from "../../assets/image/PO_AG_SO_05.svg";
import PO_AG_SO_06 from "../../assets/image/PO_AG_SO_06.svg";
import PO_AG_SO_07 from "../../assets/image/PO_AG_SO_07.svg";

import NE_AG_PD_01 from "../../assets/image/NE_AG_PD_01.svg";
import NE_AG_PD_02 from "../../assets/image/NE_AG_PD_02.svg";
import NE_AG_PD_03 from "../../assets/image/NE_AG_PD_03.svg";
import NE_AG_PD_04 from "../../assets/image/NE_AG_PD_04.svg";

import NE_AG_SO_01 from "../../assets/image/NE_AG_SO_01.svg";
import NE_AG_SO_02 from "../../assets/image/NE_AG_SO_02.svg";
import NE_AG_SO_03 from "../../assets/image/NE_AG_SO_03.svg";
import NE_AG_SO_04 from "../../assets/image/NE_AG_SO_04.svg";
import NE_AG_SO_05 from "../../assets/image/NE_AG_SO_05.svg";
import NE_AG_SO_06 from "../../assets/image/NE_AG_SO_06.svg";
import NE_AG_SO_07 from "../../assets/image/NE_AG_SO_07.svg";

export interface FilterItem {
  label: string;
  icon: string;
  key: string;
}

export interface FilterCategory {
  category: string;
  id: string;
  positiveFilters: FilterItem[];
  negativeFilters: FilterItem[];
}

// ✅ 필터 상태 설정
export const JjinFilterState = atom<FilterCategory[]>({
  key: "JjinFilterState",
  default: [
    {
      category: "위치/주변환경",
      id: "location",
      positiveFilters: [
        { label: "교통이 편리해요", icon: PO_BD_LO_01, key: "PO_BD_LO_01" },
        {
          label: "주변 환경이 깨끗해요",
          icon: PO_BD_LO_02,
          key: "PO_BD_LO_02",
        },
        { label: "동네가 조용해요", icon: PO_BD_LO_03, key: "PO_BD_LO_03" },
        { label: "공원이 가까워요", icon: PO_BD_LO_04, key: "PO_BD_LO_04" },
        { label: "생활권이 편리해요", icon: PO_BD_LO_05, key: "PO_BD_LO_05" },
        { label: "학교와 가까워요", icon: PO_BD_LO_06, key: "PO_BD_LO_06" },
        { label: "동네가 안전해요", icon: PO_BD_LO_07, key: "PO_BD_LO_07" },
        { label: "이웃들이 친절해요", icon: PO_BD_LO_08, key: "PO_BD_LO_08" },
      ],
      negativeFilters: [
        { label: "교통이 불편해요", icon: NE_BD_LO_01, key: "NE_BD_LO_01" },
        { label: "환경이 지저분해요", icon: NE_BD_LO_02, key: "NE_BD_LO_02" },
        { label: "동네가 시끄러워요", icon: NE_BD_LO_03, key: "NE_BD_LO_03" },
        { label: "공원이 멀어요", icon: NE_BD_LO_04, key: "NE_BD_LO_04" },
        { label: "생활권이 불편해요", icon: NE_BD_LO_05, key: "NE_BD_LO_05" },
        { label: "학교와 멀어요", icon: NE_BD_LO_06, key: "NE_BD_LO_06" },
        {
          label: "동네가 안전하지 않아요",
          icon: NE_BD_LO_07,
          key: "NE_BD_LO_07",
        },
        { label: "이웃들이 불친절해요", icon: NE_BD_LO_08, key: "NE_BD_LO_08" },
      ],
    },
    {
      category: "집 내부 상태",
      id: "house",
      positiveFilters: [
        { label: "채광이 좋아요", icon: PO_BD_ST_01, key: "PO_BD_ST_01" },
        { label: "통풍이 잘 돼요", icon: PO_BD_ST_02, key: "PO_BD_ST_02" },
        { label: "방음이 잘 돼요", icon: PO_BD_ST_03, key: "PO_BD_ST_03" },
        { label: "신축이라 세련됐어요", icon: PO_BD_ST_04, key: "PO_BD_ST_04" },
        { label: "곰팡이가 없어요", icon: PO_BD_ST_05, key: "PO_BD_ST_05" },
        { label: "냉난방이 잘 돼요", icon: PO_BD_ST_06, key: "PO_BD_ST_06" },
        {
          label: "배수와 수압이 좋아요",
          icon: PO_BD_ST_07,
          key: "PO_BD_ST_07",
        },
      ],
      negativeFilters: [
        { label: "채광이 부족해요", icon: NE_BD_ST_01, key: "NE_BD_ST_01" },
        { label: "통풍이 안돼요", icon: NE_BD_ST_02, key: "NE_BD_ST_02" },
        { label: "방음이 안돼요", icon: NE_BD_ST_03, key: "NE_BD_ST_03" },
        { label: "집 상태가 낡았어요", icon: NE_BD_ST_04, key: "NE_BD_ST_04" },
        { label: "곰팡이가 많아요", icon: NE_BD_ST_05, key: "NE_BD_ST_05" },
        { label: "냉난방이 안돼요", icon: NE_BD_ST_06, key: "NE_BD_ST_06" },
        {
          label: "배수와 수압이 약해요",
          icon: NE_BD_ST_07,
          key: "NE_BD_ST_07",
        },
      ],
    },
    {
      category: "편의시설과 관리",
      id: "management",
      positiveFilters: [
        { label: "주차가 편리해요", icon: PO_BD_MT_01, key: "PO_BD_MT_01" },
        { label: "엘리베이터가 있어요", icon: PO_BD_MT_02, key: "PO_BD_MT_02" },
        {
          label: "쓰레기 처리가 편해요",
          icon: PO_BD_MT_03,
          key: "PO_BD_MT_03",
        },
        {
          label: "관리비가 합리적이에요",
          icon: PO_BD_MT_04,
          key: "PO_BD_MT_04",
        },
        { label: "인터넷이 잘 돼요", icon: PO_BD_MT_05, key: "PO_BD_MT_05" },
        { label: "관리가 정기적이에요", icon: PO_BD_MT_06, key: "PO_BD_MT_06" },
        { label: "이사가 편했어요", icon: PO_BD_MT_07, key: "PO_BD_MT_07" },
      ],
      negativeFilters: [
        { label: "주차가 어려워요", icon: NE_BD_MT_01, key: "NE_BD_MT_01" },
        { label: "엘리베이터가 없어요", icon: NE_BD_MT_02, key: "NE_BD_MT_02" },
        {
          label: "쓰레기 처리가 불편해요",
          icon: NE_BD_MT_03,
          key: "NE_BD_MT_03",
        },
        { label: "관리비가 비싸요", icon: NE_BD_MT_04, key: "NE_BD_MT_04" },
        { label: "인터넷이 느려요", icon: NE_BD_MT_05, key: "NE_BD_MT_05" },
        { label: "관리가 부족해요", icon: NE_BD_MT_06, key: "NE_BD_MT_06" },
        { label: "이사가 힘들었어요", icon: NE_BD_MT_07, key: "NE_BD_MT_07" },
      ],
    },
  ],
});

export const JjinAgencyFilterState = atom<FilterCategory[]>({
  key: "JjinAgencyFilterState",
  default: [
    {
      category: "매물",
      id: "product",
      positiveFilters: [
        { label: "매물이 다양해요", icon: PO_AG_PD_01, key: "PO_AG_PD_01" },
        {
          label: "검증된 매물을 소개해줘요",
          icon: PO_AG_PD_02,
          key: "PO_AG_PD_02",
        },
        {
          label: "조건에 맞는 매물을 추천해줘요",
          icon: PO_AG_PD_03,
          key: "PO_AG_PD_03",
        },
        {
          label: "수수료가 합리적이에요",
          icon: PO_AG_PD_04,
          key: "PO_AG_PD_04",
        },
        {
          label: "매물 비교를 잘해줘요",
          icon: PO_AG_PD_05,
          key: "PO_AG_PD_05",
        },
      ],
      negativeFilters: [
        {
          label: "매물이 한정되어 있어요",
          icon: NE_AG_PD_01,
          key: "NE_AG_PD_01",
        },
        {
          label: "허위 매물을 소개했어요",
          icon: NE_AG_PD_02,
          key: "NE_AG_PD_02",
        },
        {
          label: "조건에 맞지 않은 매물만 추천했어요",
          icon: NE_AG_PD_03,
          key: "NE_AG_PD_03",
        },
        { label: "수수료가 높았어요", icon: NE_AG_PD_04, key: "NE_AG_PD_04" },
      ],
    },
    {
      category: "서비스/기타",
      id: "services/others",
      positiveFilters: [
        { label: "친절하게 응대해요", icon: PO_AG_SO_01, key: "PO_AG_SO_01" },
        { label: "설명이 자세했어요", icon: PO_AG_SO_02, key: "PO_AG_SO_02" },
        {
          label: "대화가 잘 통했어요",
          icon: PO_AG_SO_03,
          key: "PO_AG_SO_03",
        },
        {
          label: "신뢰가 느껴졌어요",
          icon: PO_AG_SO_04,
          key: "PO_AG_SO_04",
        },
        {
          label: "거래 방식이 안전했어요",
          icon: PO_AG_SO_05,
          key: "PO_AG_SO_05",
        },
        {
          label: "계약 과정이 투명했어요",
          icon: PO_AG_SO_06,
          key: "PO_AG_SO_06",
        },
        {
          label: "사후 대응이 잘 되었어요",
          icon: PO_AG_SO_07,
          key: "PO_AG_SO_07",
        },
      ],
      negativeFilters: [
        {
          label: "응대가 불친절했어요",
          icon: NE_AG_SO_01,
          key: "NE_AG_SO_01",
        },
        { label: "설명이 부족했어요", icon: NE_AG_SO_02, key: "NE_AG_SO_02" },
        { label: "정보를 숨겼어요", icon: NE_AG_SO_03, key: "NE_AG_SO_03" },
        {
          label: "처리 속도가 느렸어요",
          icon: NE_AG_SO_04,
          key: "NE_AG_SO_04",
        },
        {
          label: "계약을 강요했어요",
          icon: NE_AG_SO_05,
          key: "NE_AG_SO_05",
        },
        {
          label: "계약 내용 안내가 불충분했어요",
          icon: NE_AG_SO_06,
          key: "NE_AG_SO_06",
        },
        {
          label: "사후 대응이 잘 안되었어요",
          icon: NE_AG_SO_07,
          key: "NE_AG_SO_07",
        },
      ],
    },
  ],
});
