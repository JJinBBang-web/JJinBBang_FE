// components/MainHotContentCard.tsx
import { Image, Text, View } from 'react-native';

import { HotContent } from '@/screens/Main/store/useMainHotHomeStore';

export type MainHotContentCardProps = {
  content: HotContent;
};

export const MainHotContentCard = (props: MainHotContentCardProps) => {
  const { content } = props;

  return (
    <View className="mr-4 w-[208px]">
      <Image
        source={{ uri: content.image }}
        className="h-[120px] w-full rounded-md"
      />

      <Text
        numberOfLines={2}
        className="mt-3 font-pretendard text-[16px] font-medium leading-[140%] text-black100 px-3">
        {content.title}
      </Text>

      <View className="mt-3 px-3 flex-row items-center">
        <View className="mr-2 flex-row items-center">
          <Text className="ml-1 font-pretendard text-[12px] text-black80">
            {content.likeCount}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className="ml-1 font-pretendard text-[12px] text-black80">
            {content.viewCount.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
};