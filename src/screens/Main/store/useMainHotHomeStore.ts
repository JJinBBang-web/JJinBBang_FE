// store/useMainHotHomeStore.ts
import { create } from 'zustand';

export type HotContent = {
  id: number;
  image: string;
  title: string;
  likeCount: number;
  viewCount: number;
};

export type ReviewItem = {
  id: number;
  image: string;
  region: string;
  title: string;
  rating: number | null;
  reviewCount: number;
  deposit: number;
  monthlyRent: number;
  tags: string[];
  isLiked: boolean;
};

type MainHotHomeStore = {
  selectedCategory: string;
  searchText: string;

  hotContents: HotContent[];
  recentReviews: ReviewItem[];

  setSelectedCategory: (category: string) => void;
  setSearchText: (text: string) => void;
};

export const useMainHotHomeStore = create<MainHotHomeStore>((set) => ({
  selectedCategory: '전체',
  searchText: '',

  hotContents: [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      title: '원룸 계약 전 꼭 확인해야 할 체크리스트',
      likeCount: 156,
      viewCount: 2847,
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      title: '원룸 계약 전 꼭 확인해야 할 체크리스트',
      likeCount: 156,
      viewCount: 2847,
    },
  ],

  recentReviews: [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      region: '가좌동',
      title: '어반하임중대산단지',
      rating: 4.5,
      reviewCount: 3,
      deposit: 400,
      monthlyRent: 32,
      tags: ['깨끗함', '역세권', '공원인접'],
      isLiked: true,
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      region: '칠암동',
      title: '칠암동 원룸',
      rating: null,
      reviewCount: 0,
      deposit: 400,
      monthlyRent: 32,
      tags: ['깨끗함', '역세권', '공원인접'],
      isLiked: true,
    },
  ],

  setSelectedCategory: (category) =>
    set(() => ({ selectedCategory: category })),

  setSearchText: (text) => set(() => ({ searchText: text })),
}));