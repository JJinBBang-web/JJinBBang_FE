import { Tabs } from 'expo-router';

import TabsOffContent from '@/assets/icons/tabs/tabsOffContent.svg';
import TabsOffHeartList from '@/assets/icons/tabs/tabsOffHeartList.svg';
import TabsOffHome from '@/assets/icons/tabs/tabsOffHome.svg';
import TabsOffMyPage from '@/assets/icons/tabs/tabsOffMyPage.svg';
import TabsOffReview from '@/assets/icons/tabs/tabsOffReview.svg';
import TabsOnContent from '@/assets/icons/tabs/tabsOnContent.svg';
import TabsOnHeartList from '@/assets/icons/tabs/tabsOnHeartList.svg';
import TabsOnHome from '@/assets/icons/tabs/tabsOnHome.svg';
import TabsOnMyPage from '@/assets/icons/tabs/tabsOnMyPage.svg';
import TabsOnReview from '@/assets/icons/tabs/tabsOnReview.svg';
import { colors } from '@/constants/colors';
import { TabBarIcon } from '@/features/tabs/components/TabBarIcon';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.gray10,
          height: 84,
          paddingTop: 17,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="(main)/index"
        options={{
          tabBarIcon: ({ focused: isFocused }) => (
            <TabBarIcon
              ActiveIcon={TabsOnHome}
              InactiveIcon={TabsOffHome}
              label="홈"
              isFocused={isFocused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(heartList)/heartList"
        options={{
          tabBarIcon: ({ focused: isFocused }) => (
            <TabBarIcon
              ActiveIcon={TabsOnHeartList}
              InactiveIcon={TabsOffHeartList}
              label="관심 목록"
              isFocused={isFocused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(review)/review"
        options={{
          tabBarIcon: ({ focused: isFocused }) => (
            <TabBarIcon
              ActiveIcon={TabsOnReview}
              InactiveIcon={TabsOffReview}
              label="리뷰"
              isFocused={isFocused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(content)/content"
        options={{
          tabBarIcon: ({ focused: isFocused }) => (
            <TabBarIcon
              ActiveIcon={TabsOnContent}
              InactiveIcon={TabsOffContent}
              label="콘텐츠"
              isFocused={isFocused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(myPage)/myPage"
        options={{
          tabBarIcon: ({ focused: isFocused }) => (
            <TabBarIcon
              ActiveIcon={TabsOnMyPage}
              InactiveIcon={TabsOffMyPage}
              label="MY"
              isFocused={isFocused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
