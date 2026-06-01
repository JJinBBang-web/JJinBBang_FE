// components/MainHotContentCard.tsx
import { Image, Text, View } from 'react-native';

import { HotContent } from '@/screens/Main/store/useMainHotHomeStore';

export type MainHotContentCardProps = {
  content: HotContent;
};

export const MainHotContentCard = (props: MainHotContentCardProps) => {
  const { content } = props;

  return (
    <View className="mr-4 w-[295px]">
      <Image
        source={{ uri: content.image }}
        className="h-[170px] w-full rounded-2xl"
      />

      <Text
        numberOfLines={2}
        className="mt-3 font-pretendard text-[22px] font-bold leading-[30px] text-black100">
        {content.title}
      </Text>

      <View className="mt-3 flex-row items-center">
        <View className="mr-4 flex-row items-center">
          <Text className="ml-1 font-pretendard text-[15px] text-black80">
            {content.likeCount}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className="ml-1 font-pretendard text-[15px] text-black80">
            {content.viewCount.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
};