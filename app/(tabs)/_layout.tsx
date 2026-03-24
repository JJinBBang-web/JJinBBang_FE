import { Tabs } from 'expo-router';
import { colors } from '@/constants/colors';
import TabBarIcon from '@/components/tabs/tabBarIcon';

import TabsOnHome from '@/assets/icons/tabs/tabsOnHome.svg';
import TabsOffHome from '@/assets/icons/tabs/tabsOffHome.svg';
import TabsOnHeartList from '@/assets/icons/tabs/tabsOnHeartList.svg';
import TabsOffHeartList from '@/assets/icons/tabs/tabsOffHeartList.svg';
import TabsOnReview from '@/assets/icons/tabs/tabsOnReview.svg';
import TabsOffReview from '@/assets/icons/tabs/tabsOffReview.svg';
import TabsOnContent from '@/assets/icons/tabs/tabsOnContent.svg';
import TabsOffContent from '@/assets/icons/tabs/tabsOffContent.svg';
import TabsOnMyPage from '@/assets/icons/tabs/tabsOnMyPage.svg';
import TabsOffMyPage from '@/assets/icons/tabs/tabsOffMyPage.svg';

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
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              ActiveIcon={TabsOnHome}
              InactiveIcon={TabsOffHome}
              label="홈"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="heartList"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              ActiveIcon={TabsOnHeartList}
              InactiveIcon={TabsOffHeartList}
              label="관심 목록"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              ActiveIcon={TabsOnReview}
              InactiveIcon={TabsOffReview}
              label="리뷰"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="content"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              ActiveIcon={TabsOnContent}
              InactiveIcon={TabsOffContent}
              label="콘텐츠"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="myPage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              ActiveIcon={TabsOnMyPage}
              InactiveIcon={TabsOffMyPage}
              label="MY"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}