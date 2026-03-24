import { Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';

interface TabBarIconProps {
  ActiveIcon: React.FC<{ width: number; height: number }>;
  InactiveIcon: React.FC<{ width: number; height: number }>;
  label: string;
  focused: boolean;
}

export default function TabBarIcon({ ActiveIcon, InactiveIcon, label, focused }: TabBarIconProps) {
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      {focused
        ? <ActiveIcon width={24} height={24} />
        : <InactiveIcon width={24} height={24} />
      }
      <Text
        numberOfLines={1}
        style={{
          fontSize: fonts.size.xs,
          fontFamily: fonts.pretendard,
          color: focused ? colors.primary : colors.gray40,
        }}
      >
        {label}
      </Text>
    </View>
  );
}