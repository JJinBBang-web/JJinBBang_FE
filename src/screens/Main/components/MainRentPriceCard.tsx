import { Text, View } from 'react-native';

export type MainRentPriceDigitProps = {
  value: string;
};

const MainRentPriceDigit = (props: MainRentPriceDigitProps) => {
  const { value } = props;

  return (
    <View className="h-8 w-8 items-center justify-center rounded-md bg-white">
      <Text className="font-pretendard text-[16px] font-bold text-black100">
        {value}
      </Text>
    </View>
  );
};

export const MainRentPriceCard = () => {
  return (
    <View
      className="mx-4 mb-7 mt-2 rounded-xl border px-4 py-4"
      style={{ backgroundColor: '#f4e7c7', borderColor: '#ebdcb7' }}>
      <View className="flex-row items-center justify-between">
        <Text className="font-pretendard text-[16px] text-black100">
          경상국립대 가좌동 <Text className="font-bold text-primary">평균 원룸 월세</Text>는?
        </Text>
        <View className="flex-row items-center gap-1">
          <MainRentPriceDigit value="3" />
          <MainRentPriceDigit value="5" />
          <Text className="ml-[2px] font-pretendard text-[16px] text-black100">
            만원
          </Text>
        </View>
      </View>
    </View>
  );
};
