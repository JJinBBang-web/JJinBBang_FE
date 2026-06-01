// components/MainReviewTag.tsx
import { Text, View } from 'react-native';

export type MainReviewTagProps = {
  label: string;
};

export const MainReviewTag = (props: MainReviewTagProps) => {
  const { label } = props;

  return (
    <View className="mr-2 rounded-lg bg-blue10 px-2 py-1">
      <Text className="font-pretendard text-[12px] font-medium text-primary">
        {label}
      </Text>
    </View>
  );
};