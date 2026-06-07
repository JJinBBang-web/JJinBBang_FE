import { Text, View, Image, ImageSourcePropType} from 'react-native';

export type MainUniversityGridItemProps = {
  shortName: string;
  logoSource: ImageSourcePropType;
};

export const MainUniversityGridItem = (props: MainUniversityGridItemProps) => {
  const { shortName, logoSource } = props;

  return (
    <View className="w-1/4 items-center">
      <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-white">
      <Image
          source={logoSource}
          resizeMode="contain"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>
      <Text className="font-pretendard text-[12px] text-black100">{shortName}</Text>
    </View>
  );
};
