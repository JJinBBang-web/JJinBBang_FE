// components/MainReviewRewardBanner.tsx
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * 리뷰 작성 보상 안내 배너 컴포넌트
 */
export const MainReviewRewardBanner = () => {
  return (
    <View className="mx-4 mt-3 flex-row items-center justify-between rounded-full border border-primary bg-gradient-to-t from-gradientYellow-to to-white px-4 py-4">
      <Text className="flex-1 text-center font-pretendard text-[16px] font-semiBold text-black100">
        리뷰쓰면 최대 <Text className="text-primary font-bold">25,000원!</Text>
      </Text>

      <TouchableOpacity className="h-6 w-6 items-center justify-center rounded-full bg-white">
        <Text className="text-[12px] text-black40">✕</Text>
      </TouchableOpacity>
    </View>
  );
};