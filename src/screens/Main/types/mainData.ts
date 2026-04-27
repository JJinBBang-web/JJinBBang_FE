import { MainCategoryType } from '@/screens/Main/store/useMainHomeStore'

export const MAIN_CATEGORY_TABS: { key: MainCategoryType; label: string }[] = [
  { key: 'university', label: '대학' },
  { key: 'subway', label: '지하철' },
  { key: 'region', label: '지역' },
];

export const MAIN_UNIVERSITIES = [
  { id: 'snu', shortName: '서울대', accentColor: '#1f4f9a' },
  { id: 'pusan', shortName: '부산대', accentColor: '#4da0d8' },
  { id: 'kangwon', shortName: '강원대', accentColor: '#3b82f6' },
  { id: 'chungbuk', shortName: '충북대', accentColor: '#a43152' },
  { id: 'chungnam', shortName: '충남대', accentColor: '#4f8ed1' },
  { id: 'jeonbuk', shortName: '전북대', accentColor: '#be2f6d' },
  { id: 'jeonnam', shortName: '전남대', accentColor: '#2cb878' },
  { id: 'kyungbuk', shortName: '경북대', accentColor: '#e3342f' },
  { id: 'gnu', shortName: '경상국립대', accentColor: '#47a9ff' },
  { id: 'jeju', shortName: '제주대', accentColor: '#42b883' },
];
