import { Text, View } from 'react-native';

export const MainTopHeader = () => {
  return (
    <View className="flex-row items-center justify-between bg-white px-4 pb-3 pt-3">
      <View className="flex-row items-center gap-2">
        <View className="h-7 w-7 items-center justify-center rounded-full bg-primary">
          <Text className="font-pretendard text-[12px] font-bold text-white">
            찐
          </Text>
        </View>
        <Text className="font-pretendard text-[30px] font-bold text-black">
          찐빵
        </Text>
      </View>

      <View className="relative">
        <Text className="text-[22px]">🔔</Text>
        <View className="absolute right-[2px] top-[1px] h-[5px] w-[5px] rounded-full bg-pink" />
      </View>
    </View>
  );
};
