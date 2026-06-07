// components/MainSectionTitle.tsx
import { Text, View } from 'react-native';

export type MainSectionTitleProps = {
  title: string;
  rightElement?: React.ReactNode;
};

export const MainSectionTitle = (props: MainSectionTitleProps) => {
  const { title, rightElement } = props;

  return (
    <View className="mb-5 flex-row items-center justify-between px-4">
      <Text className="font-pretendard text-[18px] font-semibold text-black100">
        {title}
      </Text>

      {rightElement}
    </View>
  );
};