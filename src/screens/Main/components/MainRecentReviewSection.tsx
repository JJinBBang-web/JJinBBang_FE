// components/MainRecentReviewSection.tsx
import { View } from 'react-native';

import { MainRecentReviewCard } from './MainRecentReviewCard';
import { MainReviewRewardBanner } from './MainReviewRewardBanner';
import { MainSectionTitle } from './MainSectionTitle';

import { ReviewItem } from '@/screens/Main/store/useMainHotHomeStore';

export type MainRecentReviewSectionProps = {
  reviews: ReviewItem[];
};

export const MainRecentReviewSection = (props: MainRecentReviewSectionProps) => {
  const { reviews } = props;

  return (
    <View className="mt-4 pb-8">
      <MainSectionTitle title="최근 본 후기" />

      {reviews.map((review) => (
        <MainRecentReviewCard key={review.id} review={review} />
      ))}

      <MainReviewRewardBanner />
    </View>
  );
};