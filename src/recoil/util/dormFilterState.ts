// src/recoil/util/dormFilterState.ts
import { atom } from 'recoil';

// ✅ 새로운 기숙사용 아이콘 이미지 import
import PO_LO_01 from '../../assets/image/D_PO_LO_01.svg';
import PO_LO_02 from '../../assets/image/D_PO_LO_02.svg';
import PO_LO_03 from '../../assets/image/D_PO_LO_03.svg';
import PO_LO_04 from '../../assets/image/D_PO_LO_04.svg';
import PO_LO_05 from '../../assets/image/D_PO_LO_05.svg';
import PO_LO_06 from '../../assets/image/D_PO_LO_06.svg';
import PO_LO_07 from '../../assets/image/D_PO_LO_07.svg';

import PO_ST_01 from '../../assets/image/D_PO_ST_01.svg';
import PO_ST_02 from '../../assets/image/D_PO_ST_02.svg';
import PO_ST_03 from '../../assets/image/D_PO_ST_03.svg';
import PO_ST_04 from '../../assets/image/D_PO_ST_04.svg';
import PO_ST_05 from '../../assets/image/D_PO_ST_05.svg';
import PO_ST_06 from '../../assets/image/D_PO_ST_06.svg';
import PO_ST_07 from '../../assets/image/D_PO_ST_07.svg';

import PO_MT_01 from '../../assets/image/D_PO_MT_01.svg';
import PO_MT_02 from '../../assets/image/D_PO_MT_02.svg';
import PO_MT_03 from '../../assets/image/D_PO_MT_03.svg';
import PO_MT_04 from '../../assets/image/D_PO_MT_04.svg';
import PO_MT_05 from '../../assets/image/D_PO_MT_05.svg';
import PO_MT_06 from '../../assets/image/D_PO_MT_06.svg';
import PO_MT_07 from '../../assets/image/D_PO_MT_07.svg';
import PO_MT_08 from '../../assets/image/D_PO_MT_08.svg';
import PO_MT_09 from '../../assets/image/D_PO_MT_09.svg';
import PO_MT_10 from '../../assets/image/D_PO_MT_10.svg';
import PO_MT_11 from '../../assets/image/D_PO_MT_11.svg';

import NE_LO_01 from '../../assets/image/D_NE_LO_01.svg';
import NE_LO_02 from '../../assets/image/D_NE_LO_02.svg';
import NE_LO_03 from '../../assets/image/D_NE_LO_03.svg';
import NE_LO_04 from '../../assets/image/D_NE_LO_04.svg';
import NE_LO_05 from '../../assets/image/D_NE_LO_05.svg';
import NE_LO_06 from '../../assets/image/D_NE_LO_06.svg';
import NE_LO_07 from '../../assets/image/D_NE_LO_07.svg';

import NE_ST_01 from '../../assets/image/D_NE_ST_01.svg';
import NE_ST_02 from '../../assets/image/D_NE_ST_02.svg';
import NE_ST_03 from '../../assets/image/D_NE_ST_03.svg';
import NE_ST_04 from '../../assets/image/D_NE_ST_04.svg';
import NE_ST_05 from '../../assets/image/D_NE_ST_05.svg';
import NE_ST_06 from '../../assets/image/D_NE_ST_06.svg';
import NE_ST_07 from '../../assets/image/D_NE_ST_07.svg';

import NE_MT_01 from '../../assets/image/D_NE_MT_01.svg';
import NE_MT_02 from '../../assets/image/D_NE_MT_02.svg';
import NE_MT_03 from '../../assets/image/D_NE_MT_03.svg';
import NE_MT_04 from '../../assets/image/NE_MT_04.svg';
import NE_MT_05 from '../../assets/image/D_NE_MT_05.svg';
import NE_MT_06 from '../../assets/image/D_NE_MT_06.svg';
import NE_MT_07 from '../../assets/image/NE_MT_07.svg';
import NE_MT_10 from '../../assets/image//D_NE_MT_10.svg';
import NE_MT_11 from '../../assets/image/D_NE_MT_11.svg';
import NE_MT_12 from '../../assets/image/D_NE_MT_12.svg';
import NE_MT_13 from '../../assets/image/D_NE_MT_13.svg';

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

// ✅ 기숙사 리뷰 필터 상태
export const DormFilterState = atom<FilterCategory[]>({
  key: 'DormFilterState',
  default: [
    {
      category: '위치/주변환경',
      id: 'location',
      positiveFilters: [
        { label: '교통이 편리해요', icon: PO_LO_01, key: 'PO_LO_01' },
        { label: '주변 환경이 깨끗해요', icon: PO_LO_02, key: 'PO_LO_02' },
        { label: '동네가 조용해요', icon: PO_LO_03, key: 'PO_LO_03' },
        { label: '공원이 가까워요', icon: PO_LO_04, key: 'PO_LO_04' },
        { label: '생활권이 편리해요', icon: PO_LO_05, key: 'PO_LO_05' },
        { label: '학교와 가까워요', icon: PO_LO_06, key: 'PO_LO_06' },
        { label: '주변이 안전해요', icon: PO_LO_07, key: 'PO_LO_07' },
      ],
      negativeFilters: [
        { label: '교통이 불편해요', icon: NE_LO_01, key: 'NE_LO_01' },
        { label: '환경이 지저분해요', icon: NE_LO_02, key: 'NE_LO_02' },
        { label: '주변이 시끄러워요', icon: NE_LO_03, key: 'NE_LO_03' },
        { label: '공원이 멀어요', icon: NE_LO_04, key: 'NE_LO_04' },
        { label: '생활권이 불편해요', icon: NE_LO_05, key: 'NE_LO_05' },
        { label: '학교와 멀어요', icon: NE_LO_06, key: 'NE_LO_06' },
        { label: '동네가 안전하지 않아요', icon: NE_LO_07, key: 'NE_LO_07' },
      ],
    },
    {
      category: '집 내부 상태',
      id: 'house',
      positiveFilters: [
        { label: '채광이 좋아요', icon: PO_ST_01, key: 'PO_ST_01' },
        { label: '통풍이 잘 돼요', icon: PO_ST_02, key: 'PO_ST_02' },
        { label: '방음이 잘 돼요', icon: PO_ST_03, key: 'PO_ST_03' },
        { label: '신축이라 세련됐어요', icon: PO_ST_04, key: 'PO_ST_04' },
        { label: '곰팡이가 없어요', icon: PO_ST_05, key: 'PO_ST_05' },
        { label: '냉난방이 잘 돼요', icon: PO_ST_06, key: 'PO_ST_06' },
        { label: '배수와 수압이 좋아요', icon: PO_ST_07, key: 'PO_ST_07' },
      ],
      negativeFilters: [
        { label: '채광이 부족해요', icon: NE_ST_01, key: 'NE_ST_01' },
        { label: '통풍이 안돼요', icon: NE_ST_02, key: 'NE_ST_02' },
        { label: '방음이 안돼요', icon: NE_ST_03, key: 'NE_ST_03' },
        { label: '집 상태가 낡았어요', icon: NE_ST_04, key: 'NE_ST_04' },
        { label: '곰팡이가 많아요', icon: NE_ST_05, key: 'NE_ST_05' },
        { label: '냉난방이 안돼요', icon: NE_ST_06, key: 'NE_ST_06' },
        { label: '배수와 수압이 약해요', icon: NE_ST_07, key: 'NE_ST_07' },
      ],
    },
    {
      category: '편의시설과 관리',
      id: 'management',
      positiveFilters: [
        { label: '주차가 편리해요', icon: PO_MT_01, key: 'PO_MT_01' },
        { label: '엘리베이터가 있어요', icon: PO_MT_02, key: 'PO_MT_02' },
        { label: '쓰레기 처리가 편해요', icon: PO_MT_03, key: 'PO_MT_03' },
        { label: '입주비가 합리적이에요', icon: PO_MT_04, key: 'PO_MT_04' },
        { label: '인터넷이 잘 돼요', icon: PO_MT_05, key: 'PO_MT_05' },
        { label: '관리가 정기적이에요', icon: PO_MT_06, key: 'PO_MT_06' },
        { label: '입주가 편했어요', icon: PO_MT_07, key: 'PO_MT_07' },
        { label: '공용시설이 쾌적해요', icon: PO_MT_08, key: 'PO_MT_08' },
        { label: '통금이 없어요', icon: PO_MT_09, key: 'PO_MT_09' },
        { label: '휴게시설이 충분해요', icon: PO_MT_10, key: 'PO_MT_10' },
        { label: '규칙이 유연해요', icon: PO_MT_11, key: 'PO_MT_11' },
      ],
      negativeFilters: [
        { label: '주차가 어려워요', icon: NE_MT_01, key: 'NE_MT_01' },
        { label: '엘리베이터가 없어요', icon: NE_MT_02, key: 'NE_MT_02' },
        { label: '쓰레기 처리가 불편해요', icon: NE_MT_03, key: 'NE_MT_03' },
        { label: '입주비가 비싸요', icon: NE_MT_04, key: 'NE_MT_04' },
        { label: '인터넷이 느려요', icon: NE_MT_05, key: 'NE_MT_05' },
        { label: '관리가 부족해요', icon: NE_MT_06, key: 'NE_MT_06' },
        { label: '입주가 힘들었어요', icon: NE_MT_07, key: 'NE_MT_7' },
        { label: '공용시설이 불편해요', icon: NE_MT_10, key: 'NE_MT_10' },
        { label: '통금이 있어요', icon: NE_MT_11, key: 'NE_MT_11' },
        { label: '휴게시설이 불충분해요', icon: NE_MT_12, key: 'NE_MT_12' },
        { label: '규칙이 엄격해요', icon: NE_MT_13, key: 'NE_MT_13' },
      ],
    },
  ],
});
