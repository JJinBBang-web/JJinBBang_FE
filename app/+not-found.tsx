import { View, Text } from 'react-native';

import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>페이지를 찾을 수 없어요.</Text>
      <Link href="/">홈으로 가기</Link>
    </View>
  );
}