// components/MainHotContentsSection.tsx
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';

import { MainHotContentCard } from './MainHotContentCard';
import { MainSectionTitle } from './MainSectionTitle';

import { HotContent } from '@/screens/Main/store/useMainHotHomeStore';

export type MainHotContentsSectionProps = {
  contents: HotContent[];
};

export const MainHotContentsSection = (props: MainHotContentsSectionProps) => {
  const { contents } = props;

  return (
    <View className="mt-5 mb-3">
      <MainSectionTitle
        title="🔥 핫한 콘텐츠"
        rightElement={
          <View className="flex-row items-center gap-2">
            <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-[4px] border border-black10">
              <Text>L</Text>
            </TouchableOpacity>

            <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-[4px] border border-black10">
              <Text>R</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16 }}>
        {contents.map((content) => (
          <MainHotContentCard key={content.id} content={content} />
        ))}
      </ScrollView>
    </View>
  );
};