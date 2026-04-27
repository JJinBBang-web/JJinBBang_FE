import { create } from 'zustand';

export type MainCategoryType = 'university' | 'subway' | 'region';

type MainHomeState = {
  selectedCategory: MainCategoryType;
  searchText: string;
  setSelectedCategory: (category: MainCategoryType) => void;
  setSearchText: (text: string) => void;
};

export const useMainHomeStore = create<MainHomeState>((set) => ({
  selectedCategory: 'university',
  searchText: '',
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },
  setSearchText: (text) => {
    set({ searchText: text });
  },
}));
