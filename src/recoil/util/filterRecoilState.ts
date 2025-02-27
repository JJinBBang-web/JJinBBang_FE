// src/recoil/util/filterRecoilState.ts
import { atom } from 'recoil';

// ✅ 새로운 아이콘 이미지 import
import PO_LO_01 from '../../assets/image/PO_LO_01.svg';
import PO_LO_02 from '../../assets/image/PO_LO_02.svg';
import PO_LO_03 from '../../assets/image/PO_LO_03.svg';
import PO_LO_04 from '../../assets/image/PO_LO_04.svg';
import PO_LO_05 from '../../assets/image/PO_LO_05.svg';
import PO_LO_06 from '../../assets/image/PO_LO_06.svg';
import PO_LO_07 from '../../assets/image/PO_LO_07.svg';
import PO_LO_08 from '../../assets/image/PO_LO_08.svg';
import PO_ST_01 from '../../assets/image/PO_ST_01.svg';
import PO_ST_02 from '../../assets/image/PO_ST_02.svg';
import PO_ST_03 from '../../assets/image/PO_ST_03.svg';
import PO_ST_04 from '../../assets/image/PO_ST_04.svg';
import PO_ST_05 from '../../assets/image/PO_ST_05.svg';
import PO_ST_06 from '../../assets/image/PO_ST_06.svg';
import PO_ST_07 from '../../assets/image/PO_ST_07.svg';
import PO_MT_01 from '../../assets/image/PO_MT_01.svg';
import PO_MT_02 from '../../assets/image/PO_MT_02.svg';
import PO_MT_03 from '../../assets/image/PO_MT_03.svg';
import PO_MT_04 from '../../assets/image/PO_MT_04.svg';
import PO_MT_05 from '../../assets/image/PO_MT_05.svg';
import PO_MT_06 from '../../assets/image/PO_MT_06.svg';
import PO_MT_07 from '../../assets/image/PO_MT_07.svg';

// 필터 아이템 인터페이스 정의
export interface FilterItem {
  label: string;
  icon: string;
}

// 필터 카테고리 인터페이스 정의
export interface FilterCategory {
  category: string;
  id: string;
  filter: FilterItem[];
}

// ✅ 필터 상태 설정
export const JjinFilterState = atom<FilterCategory[]>({
  key: 'JjinFilterState',
  default: [
    {
      category: '위치/주변환경',
      id: 'location',
      filter: [
        { label: '교통이 편리해요', icon: PO_LO_01 },
        { label: '주변 환경이 깨끗해요', icon: PO_LO_02 },
        { label: '동네가 조용해요', icon: PO_LO_03 },
        { label: '공원이 가까워요', icon: PO_LO_04 },
        { label: '생활권이 편리해요', icon: PO_LO_05 },
        { label: '학교와 가까워요', icon: PO_LO_06 },
        { label: '동네가 안전해요', icon: PO_LO_07 },
        { label: '이웃들이 친절해요', icon: PO_LO_08 },
      ],
    },
    {
      category: '집 내부 상태',
      id: 'house',
      filter: [
        { label: '채광이 좋아요', icon: PO_ST_01 },
        { label: '통풍이 잘 돼요', icon: PO_ST_02 },
        { label: '방음이 잘 돼요', icon: PO_ST_03 },
        { label: '신축이라 세련됐어요', icon: PO_ST_04 },
        { label: '냉난방이 잘 돼요', icon: PO_ST_05 },
        { label: '배수와 수압이 좋아요', icon: PO_ST_06 },
        { label: '곰팡이가 없어요', icon: PO_ST_07 },
      ],
    },
    {
      category: '편의시설과 관리',
      id: 'management',
      filter: [
        { label: '주차가 편리해요', icon: PO_MT_01 },
        { label: '엘리베이터가 있어요', icon: PO_MT_02 },
        { label: '관리비가 합리적이에요', icon: PO_MT_03 },
        { label: '쓰레기 처리가 편해요', icon: PO_MT_04 },
        { label: '인터넷이 잘 돼요', icon: PO_MT_05 },
        { label: '관리가 정기적이에요', icon: PO_MT_06 },
        { label: '이사가 편했어요', icon: PO_MT_07 },
      ],
    },
  ],
});
