import { Text, TextInput, View } from 'react-native';

import { colors } from '@/constants/colors';

export type MainSearchBarProps = {
  value: string;
  onSearchTextChange: (text: string) => void;
};

export const MainSearchBar = (props: MainSearchBarProps) => {
  const { value, onSearchTextChange } = props;

  return (
    <View className="-mt-6 px-4">
      <View className="h-[52px] flex-row items-center rounded-full border-[1.5px] border-primary bg-white px-5">
        <TextInput
          className="flex-1 font-pretendard text-[16px] text-black100 focus:outline-none"
          value={value}
          onChangeText={onSearchTextChange}
          placeholder="지금 뜨는 매물 보기🔥"
          placeholderTextColor={colors.black40}
        />
        <Text className="text-[21px] text-black40">⌕</Text>
      </View>
    </View>
  );
};
