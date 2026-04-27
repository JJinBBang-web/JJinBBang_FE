import { Text, TextInput, View } from 'react-native';

export type MainSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export const MainSearchBar = (props: MainSearchBarProps) => {
  const { value, onChangeText } = props;

  return (
    <View className="-mt-6 px-4">
      <View className="h-[46px] flex-row items-center rounded-full border-[1.5px] border-primary bg-white px-5">
        <TextInput
          className="flex-1 font-pretendard text-[16px] text-black100"
          value={value}
          onChangeText={onChangeText}
          placeholder="지금 뜨는 매물 보기🔥"
          placeholderTextColor="#b2b5ba"
        />
        <Text className="text-[21px] text-black40">⌕</Text>
      </View>
    </View>
  );
};
