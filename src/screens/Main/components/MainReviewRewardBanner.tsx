// components/MainReviewRewardBanner.tsx
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * 리뷰 작성 보상 안내 배너 컴포넌트
 */
export const MainReviewRewardBanner = () => {
  return (
    <View className="mx-5 mt-2 flex-row items-center justify-between rounded-full border border-primary bg-salmon px-6 py-5">
      <Text className="font-pretendard text-[20px] font-bold text-black100">
        리뷰쓰면 최대 <Text className="text-primary">25,000원!</Text>
      </Text>

      <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-black10">
        <Text className="text-[12px] text-black40">✕</Text>
      </TouchableOpacity>
    </View>
  );
};