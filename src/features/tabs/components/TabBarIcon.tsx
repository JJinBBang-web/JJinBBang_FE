/**
 * TabBarIcon - 하단 탭 네비게이션 아이콘 및 라벨 컴포넌트
 *
 * @description 탭의 활성/비활성 상태에 따라 아이콘과 텍스트 컬러를 변경하여 표시합니다.
 * @param {TabBarIconProps} props - 아이콘 컴포넌트들, 라벨 텍스트, 포커스 여부
 * @returns {JSX.Element} 렌더링된 탭 아이콘 뷰
 */
import { Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";

type TabBarIconProps = {
  ActiveIcon: React.FC<{ width: number; height: number }>;
  InactiveIcon: React.FC<{ width: number; height: number }>;
  label: string;
  isFocused: boolean;
};

export const TabBarIcon = (props: TabBarIconProps) => {
  const { ActiveIcon, InactiveIcon, label, isFocused } = props;

  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      {isFocused ? (
        <ActiveIcon width={24} height={24} />
      ) : (
        <InactiveIcon width={24} height={24} />
      )}
      <Text
        numberOfLines={1}
        style={{
          fontSize: fonts.size.xs,
          fontFamily: fonts.pretendard,
          color: isFocused ? colors.primary : colors.gray40,
        }}
      >
        {label}
      </Text>
    </View>
  );
};
