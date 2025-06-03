// src/recoil/util/dormFilterState.ts
import { atom } from 'recoil';

// ✅ 기숙사 리뷰 필터 상태 (기숙사 전용 이미지로 경로 및 파일명 수정)
import PO_DO_LO_01 from '../../assets/image/dorm/PO_DO_LO_01.svg';
import PO_DO_LO_02 from '../../assets/image/dorm/PO_DO_LO_02.svg';
import PO_DO_LO_03 from '../../assets/image/dorm/PO_DO_LO_03.svg';
import PO_DO_LO_05 from '../../assets/image/dorm/PO_DO_LO_05.svg';
import PO_DO_LO_06 from '../../assets/image/dorm/PO_DO_LO_06.svg';
import PO_DO_LO_07 from '../../assets/image/dorm/PO_DO_LO_07.svg';

import PO_DO_ST_01 from '../../assets/image/dorm/PO_DO_ST_01.svg';
import PO_DO_ST_02 from '../../assets/image/dorm/PO_DO_ST_02.svg';
import PO_DO_ST_03 from '../../assets/image/dorm/PO_DO_ST_03.svg';
import PO_DO_ST_04 from '../../assets/image/dorm/PO_DO_ST_04.svg';
import PO_DO_ST_05 from '../../assets/image/dorm/PO_DO_ST_05.svg';
import PO_DO_ST_06 from '../../assets/image/dorm/PO_DO_ST_06.svg';
import PO_DO_ST_07 from '../../assets/image/dorm/PO_DO_ST_07.svg';

import PO_DO_MT_01 from '../../assets/image/dorm/PO_DO_MT_01.svg';
import PO_DO_MT_02 from '../../assets/image/dorm/PO_DO_MT_02.svg';
import PO_DO_MT_03 from '../../assets/image/dorm/PO_DO_MT_03.svg';
import PO_DO_MT_04 from '../../assets/image/dorm/PO_DO_MT_04.svg';
import PO_DO_MT_05 from '../../assets/image/dorm/PO_DO_MT_05.svg';
import PO_DO_MT_06 from '../../assets/image/dorm/PO_DO_MT_06.svg';
import PO_DO_MT_07 from '../../assets/image/dorm/PO_DO_MT_07.svg';
// 신규 아이콘
import PO_DO_MT_08 from '../../assets/image/dorm/PO_DO_MT_08.svg'; // 공용시설이 쾌적해요
import PO_DO_MT_09 from '../../assets/image/dorm/PO_DO_MT_09.svg'; // 통금이 없어요
import PO_DO_MT_10 from '../../assets/image/dorm/PO_DO_MT_10.svg'; // 휴게시설이 충분해요
import PO_DO_MT_11 from '../../assets/image/dorm/PO_DO_MT_11.svg'; // 규칙이 유연해요

import NE_DO_LO_01 from '../../assets/image/dorm/NE_DO_LO_01.svg';
import NE_DO_LO_02 from '../../assets/image/dorm/NE_DO_LO_02.svg';
import NE_DO_LO_03 from '../../assets/image/dorm/NE_DO_LO_03.svg';
import NE_DO_LO_05 from '../../assets/image/dorm/NE_DO_LO_05.svg';
import NE_DO_LO_06 from '../../assets/image/dorm/NE_DO_LO_06.svg';
import NE_DO_LO_07 from '../../assets/image/dorm/NE_DO_LO_07.svg';

import NE_DO_ST_01 from '../../assets/image/dorm/NE_DO_ST_01.svg';
import NE_DO_ST_02 from '../../assets/image/dorm/NE_DO_ST_02.svg';
import NE_DO_ST_03 from '../../assets/image/dorm/NE_DO_ST_03.svg';
import NE_DO_ST_04 from '../../assets/image/dorm/NE_DO_ST_04.svg';
import NE_DO_ST_05 from '../../assets/image/dorm/NE_DO_ST_05.svg';
import NE_DO_ST_06 from '../../assets/image/dorm/NE_DO_ST_06.svg';
import NE_DO_ST_07 from '../../assets/image/dorm/NE_DO_ST_07.svg';

import NE_DO_MT_01 from '../../assets/image/dorm/NE_DO_MT_01.svg';
import NE_DO_MT_02 from '../../assets/image/dorm/NE_DO_MT_02.svg';
import NE_DO_MT_03 from '../../assets/image/dorm/NE_DO_MT_03.svg';
import NE_DO_MT_04 from '../../assets/image/dorm/NE_DO_MT_04.svg';
import NE_DO_MT_05 from '../../assets/image/dorm/NE_DO_MT_05.svg';
import NE_DO_MT_06 from '../../assets/image/dorm/NE_DO_MT_06.svg';
import NE_DO_MT_07 from '../../assets/image/dorm/NE_DO_MT_07.svg';
// 신규 아이콘
import NE_DO_MT_08 from '../../assets/image/dorm/NE_DO_MT_08.svg'; // 공용시설이 불편해요
import NE_DO_MT_09 from '../../assets/image/dorm/NE_DO_MT_09.svg'; // 통금이 있어요
import NE_DO_MT_10 from '../../assets/image/dorm/NE_DO_MT_10.svg'; // 휴게시설이 불충분해요
import NE_DO_MT_11 from '../../assets/image/dorm/NE_DO_MT_11.svg'; // 규칙이 엄격해요

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

export const DormFilterState = atom<FilterCategory[]>({
  key: 'DormFilterState',
  default: [
    {
      category: '위치/주변환경',
      id: 'location',
      positiveFilters: [
        { label: '교통이 편리해요', icon: PO_DO_LO_01, key: 'PO_DO_LO_01' },
        {
          label: '주변 환경이 깨끗해요',
          icon: PO_DO_LO_02,
          key: 'PO_DO_LO_02',
        },
        { label: '주변이 조용해요', icon: PO_DO_LO_03, key: 'PO_DO_LO_03' },
        { label: '생활권이 편리해요', icon: PO_DO_LO_05, key: 'PO_DO_LO_05' },
        { label: '학교와 가까워요', icon: PO_DO_LO_06, key: 'PO_DO_LO_06' },
        { label: '주변이 안전해요', icon: PO_DO_LO_07, key: 'PO_DO_LO_07' },
      ],
      negativeFilters: [
        { label: '교통이 불편해요', icon: NE_DO_LO_01, key: 'NE_DO_LO_01' },
        { label: '환경이 지저분해요', icon: NE_DO_LO_02, key: 'NE_DO_LO_02' },
        { label: '주변이 시끄러워요', icon: NE_DO_LO_03, key: 'NE_DO_LO_03' },
        { label: '생활권이 불편해요', icon: NE_DO_LO_05, key: 'NE_DO_LO_05' },
        { label: '학교와 멀어요', icon: NE_DO_LO_06, key: 'NE_DO_LO_06' },
        {
          label: '동네가 안전하지 않아요',
          icon: NE_DO_LO_07,
          key: 'NE_DO_LO_07',
        },
      ],
    },
    {
      category: '집 내부 상태',
      id: 'house',
      positiveFilters: [
        { label: '채광이 좋아요', icon: PO_DO_ST_01, key: 'PO_DO_ST_01' },
        { label: '통풍이 잘 돼요', icon: PO_DO_ST_02, key: 'PO_DO_ST_02' },
        { label: '방음이 잘 돼요', icon: PO_DO_ST_03, key: 'PO_DO_ST_03' },
        { label: '신축이라 세련됐어요', icon: PO_DO_ST_04, key: 'PO_DO_ST_04' },
        { label: '곰팡이가 없어요', icon: PO_DO_ST_05, key: 'PO_DO_ST_05' },
        { label: '냉난방이 잘 돼요', icon: PO_DO_ST_06, key: 'PO_DO_ST_06' },
        {
          label: '배수와 수압이 좋아요',
          icon: PO_DO_ST_07,
          key: 'PO_DO_ST_07',
        },
      ],
      negativeFilters: [
        { label: '채광이 부족해요', icon: NE_DO_ST_01, key: 'NE_DO_ST_01' },
        { label: '통풍이 안돼요', icon: NE_DO_ST_02, key: 'NE_DO_ST_02' },
        { label: '방음이 안돼요', icon: NE_DO_ST_03, key: 'NE_DO_ST_03' },
        { label: '건물이 낡았어요', icon: NE_DO_ST_04, key: 'NE_DO_ST_04' },
        { label: '곰팡이가 많아요', icon: NE_DO_ST_05, key: 'NE_DO_ST_05' },
        { label: '냉난방이 안돼요', icon: NE_DO_ST_06, key: 'NE_DO_ST_06' },
        {
          label: '배수와 수압이 약해요',
          icon: NE_DO_ST_07,
          key: 'NE_DO_ST_07',
        },
      ],
    },
    {
      category: '편의시설과 관리',
      id: 'management',
      positiveFilters: [
        { label: '주차가 편리해요', icon: PO_DO_MT_01, key: 'PO_DO_MT_01' },
        { label: '엘리베이터가 있어요', icon: PO_DO_MT_02, key: 'PO_DO_MT_02' },
        {
          label: '쓰레기 처리가 편해요',
          icon: PO_DO_MT_03,
          key: 'PO_DO_MT_03',
        },
        {
          label: '입주비가 합리적이에요',
          icon: PO_DO_MT_04,
          key: 'PO_DO_MT_04',
        },
        { label: '인터넷이 잘 돼요', icon: PO_DO_MT_05, key: 'PO_DO_MT_05' },
        { label: '관리가 정기적이에요', icon: PO_DO_MT_06, key: 'PO_DO_MT_06' },
        { label: '입주가 편했어요', icon: PO_DO_MT_07, key: 'PO_DO_MT_07' },
        { label: '공용시설이 쾌적해요', icon: PO_DO_MT_08, key: 'PO_DO_MT_08' },
        { label: '통금이 없어요', icon: PO_DO_MT_09, key: 'PO_DO_MT_09' },
        { label: '휴게시설이 충분해요', icon: PO_DO_MT_10, key: 'PO_DO_MT_10' },
        { label: '규칙이 유연해요', icon: PO_DO_MT_11, key: 'PO_DO_MT_11' },
      ],
      negativeFilters: [
        { label: '주차가 어려워요', icon: NE_DO_MT_01, key: 'NE_DO_MT_01' },
        { label: '엘리베이터가 없어요', icon: NE_DO_MT_02, key: 'NE_DO_MT_02' },
        {
          label: '쓰레기 처리가 불편해요',
          icon: NE_DO_MT_03,
          key: 'NE_DO_MT_03',
        },
        { label: '입주비가 비싸요', icon: NE_DO_MT_04, key: 'NE_DO_MT_04' },
        { label: '인터넷이 느려요', icon: NE_DO_MT_05, key: 'NE_DO_MT_05' },
        { label: '관리가 부족해요', icon: NE_DO_MT_06, key: 'NE_DO_MT_06' },
        { label: '입주가 힘들었어요', icon: NE_DO_MT_07, key: 'NE_DO_MT_07' },
        { label: '공용시설이 불편해요', icon: NE_DO_MT_08, key: 'NE_DO_MT_08' },
        { label: '통금이 있어요', icon: NE_DO_MT_09, key: 'NE_DO_MT_09' },
        {
          label: '휴게시설이 불충분해요',
          icon: NE_DO_MT_10,
          key: 'NE_DO_MT_10',
        },
        { label: '규칙이 엄격해요', icon: NE_DO_MT_11, key: 'NE_DO_MT_11' },
      ],
    },
  ],
});

// 다른 파일들과의 호환성을 위한 별칭
export const dormitoryReviewState = DormFilterState;
