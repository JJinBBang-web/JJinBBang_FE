import { MainCategoryType } from '@/screens/Main/store/useMainHomeStore'

export const MAIN_CATEGORY_TABS: { key: MainCategoryType; label: string }[] = [
  { key: 'university', label: '대학' },
  { key: 'subway', label: '지하철' },
  { key: 'region', label: '지역' },
];

export const MAIN_UNIVERSITIES = [
  { id: 'snu', shortName: '서울대', logoUrl: require('@/assets/icons/univ/SNU.png') },
  { id: 'pusan', shortName: '부산대', logoUrl: require('@/assets/icons/univ/PNU.png') },
  { id: 'kangwon', shortName: '강원대', logoUrl: require('@/assets/icons/univ/KWU.png') },
  { id: 'chungbuk', shortName: '충북대', logoUrl: require('@/assets/icons/univ/CBNU.png') },
  { id: 'chungnam', shortName: '충남대', logoUrl: require('@/assets/icons/univ/CNU.png') },
  { id: 'jeonbuk', shortName: '전북대', logoUrl: require('@/assets/icons/univ/JBNU.png') },
  { id: 'jeonnam', shortName: '전남대', logoUrl: require('@/assets/icons/univ/JNU.png') },
  { id: 'kyungbuk', shortName: '경북대', logoUrl: require('@/assets/icons/univ/KNU.png') },
  { id: 'gnu', shortName: '경상국립대', logoUrl: require('@/assets/icons/univ/GNU.png') },
  { id: 'jeju', shortName: '제주대', logoUrl: require('@/assets/icons/univ/JEJUNU.png') },
];
