import { Text, View } from 'react-native';

import { colors } from '@/constants/colors';

/**
 * 메인 배너 섹션 컴포넌트
 */
export const MainBannerSection = () => {
  return (
    <View
      className="px-12 pb-6 pt-10"
      style={{ backgroundColor: colors.blue40 }}>
      <Text className="font-pretendard text-[40px] font-bold text-black100">
        Banner 영역
      </Text>
      <Text className="font-pretendard text-[40px] font-bold text-black100">
        Banner 영역
      </Text>

      <Text className="mt-2 font-pretendard text-[14px] text-black100">
        지금 확인하기 {'>'}
      </Text>

      <View className="mt-4 flex-row items-center justify-end gap-2">
        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: colors.black30 }}>
          <Text className="font-pretendard text-[10px] text-white">
            {'< 1 / N >'}
          </Text>
        </View>
        <View
          className="h-5 w-5 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.black30 }}>
          <Text className="font-pretendard text-[10px] text-white">‖</Text>
        </View>
      </View>
    </View>
  );
};
