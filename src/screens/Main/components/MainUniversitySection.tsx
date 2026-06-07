import { Text, View } from 'react-native';

import { MainUniversityGridItem } from '@/screens/Main/components/MainUniversityGridItem';
import { MainCategoryType } from '@/screens/Main/store/useMainHomeStore';
import { MAIN_UNIVERSITIES } from '@/screens/Main/types/mainData';

export type MainUniversitySectionProps = {
  selectedCategory: MainCategoryType;
};

export const MainUniversitySection = (props: MainUniversitySectionProps) => {
  const { selectedCategory } = props;

  if (selectedCategory !== 'university') {
    return (
      <View className="px-4 py-5">
        <Text className="font-pretendard text-[14px] text-black80">
          준비 중인 카테고리예요.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-y-6 px-4 pb-7 pt-5">
      {MAIN_UNIVERSITIES.map((university) => (
        <MainUniversityGridItem
          key={university.id}
          shortName={university.shortName}
          logoSource={university.logoUrl}
        />
      ))}
    </View>
  );
};
