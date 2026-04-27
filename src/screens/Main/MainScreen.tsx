import { ScrollView, View } from 'react-native';

import { MainBannerSection } from '@/screens/Main/components/MainBannerSection';
import { MainCategoryTabs } from '@/screens/Main/components/MainCategoryTabs';
import { MainRentPriceCard } from '@/screens/Main/components/MainRentPriceCard';
import { MainSearchBar } from '@/screens/Main/components/MainSearchBar';
import { MainTopHeader } from '@/screens/Main/components/MainTopHeader';
import { MainUniversitySection } from '@/screens/Main/components/MainUniversitySection';
import { useMainHomeStore } from '@/screens/Main/store/useMainHomeStore';

export const MainScreen = () => {
  const selectedCategory = useMainHomeStore((state) => state.selectedCategory);
  const searchText = useMainHomeStore((state) => state.searchText);
  const setSelectedCategory = useMainHomeStore((state) => state.setSelectedCategory);
  const setSearchText = useMainHomeStore((state) => state.setSearchText);

  return (
    <View className="flex-1 bg-white">
      <MainTopHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}>
        <MainBannerSection />
        <MainSearchBar value={searchText} onChangeText={setSearchText} />
        <MainCategoryTabs
          selectedCategory={selectedCategory}
          onChangeCategory={setSelectedCategory}
        />
        <MainUniversitySection selectedCategory={selectedCategory} />
        <MainRentPriceCard />
      </ScrollView>
    </View>
  );
};
