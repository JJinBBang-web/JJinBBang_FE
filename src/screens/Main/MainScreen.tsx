// MainScreen.tsx
import { ScrollView, View } from 'react-native';

import { MainBannerSection } from '@/screens/Main/components/MainBannerSection';
import { MainCategoryTabs } from '@/screens/Main/components/MainCategoryTabs';
import { MainHotContentsSection } from '@/screens/Main/components/MainHotContentsSection';
import { MainRecentReviewSection } from '@/screens/Main/components/MainRecentReviewSection';
import { MainRentPriceCard } from '@/screens/Main/components/MainRentPriceCard';
import { MainSearchBar } from '@/screens/Main/components/MainSearchBar';
import { MainTopHeader } from '@/screens/Main/components/MainTopHeader';
import { MainUniversitySection } from '@/screens/Main/components/MainUniversitySection';
import { useMainHomeStore } from '@/screens/Main/store/useMainHomeStore';
import { useMainHotHomeStore } from '@/screens/Main/store/useMainHotHomeStore';

/**
 * 메인 홈 화면 컴포넌트
 * @description 찐빵 앱의 홈 화면으로 베너, 검색, 카테고리별 대학 목록, 콘텐츠, 후기 등을 표시합니다.
 */
export const MainScreen = () => {
  // Store state
  const selectedCategory = useMainHomeStore((state) => state.selectedCategory);
  const searchText = useMainHomeStore((state) => state.searchText);
  const hotContents = useMainHotHomeStore((state) => state.hotContents);
  const recentReviews = useMainHotHomeStore((state) => state.recentReviews);

  // Store actions
  const setSelectedCategory = useMainHomeStore(
    (state) => state.setSelectedCategory,
  );
  const setSearchText = useMainHomeStore((state) => state.setSearchText);

  // Handlers
  const handleCategoryChange = (category: any) => {
    setSelectedCategory(category);
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <View className="flex-1 bg-white">
      <MainTopHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}>
        <MainBannerSection />

        <MainSearchBar
          value={searchText}
          onSearchTextChange={handleSearchTextChange}
        />

        <MainCategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <MainUniversitySection selectedCategory={selectedCategory} />

        <MainRentPriceCard />

        <MainHotContentsSection contents={hotContents} />

        <MainRecentReviewSection reviews={recentReviews} />
      </ScrollView>
    </View>
  );
};