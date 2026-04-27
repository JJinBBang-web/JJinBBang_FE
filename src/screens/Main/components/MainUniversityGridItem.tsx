import { Text, View } from 'react-native';

export type MainUniversityGridItemProps = {
  shortName: string;
  accentColor: string;
};

export const MainUniversityGridItem = (props: MainUniversityGridItemProps) => {
  const { shortName, accentColor } = props;

  return (
    <View className="w-1/4 items-center">
      <View
        className="mb-2 h-12 w-12 items-center justify-center rounded-full border-2 bg-white"
        style={{ borderColor: accentColor }}>
        <Text
          className="font-pretendard text-[11px] font-semibold"
          style={{ color: accentColor }}>
          {shortName.slice(0, 2)}
        </Text>
      </View>
      <Text className="font-pretendard text-[12px] text-black100">{shortName}</Text>
    </View>
  );
};
