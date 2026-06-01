import { Pressable, Text, View } from 'react-native';

import { MainCategoryType } from '@/screens/Main/store/useMainHomeStore';
import { MAIN_CATEGORY_TABS } from '@/screens/Main/types/mainData';
import { cn } from '@/utils/cn';

export type MainCategoryTabsProps = {
  selectedCategory: MainCategoryType;
  onCategoryChange: (category: MainCategoryType) => void;
};

export const MainCategoryTabs = (props: MainCategoryTabsProps) => {
  const { selectedCategory, onCategoryChange } = props;

  const handleTabPress = (category: MainCategoryType) => {
    onCategoryChange(category);
  };

  return (
    <View className="mt-4 flex-row border-b border-black10 px-4">
      {MAIN_CATEGORY_TABS.map((tab) => {
        const isSelected = tab.key === selectedCategory;

        return (
          <Pressable
            key={tab.key}
            onPress={() => handleTabPress(tab.key)}
            className={cn(
              'mr-6 border-b-2 pb-2',
              isSelected ? 'border-black' : 'border-transparent',
            )}>
            <Text
              className={cn(
                'font-pretendard text-[16px]',
                isSelected ? 'font-bold text-black' : 'font-medium text-black80',
              )}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
