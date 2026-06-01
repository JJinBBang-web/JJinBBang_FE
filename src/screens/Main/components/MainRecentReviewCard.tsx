// components/MainRecentReviewCard.tsx
import { Image, Text, View } from 'react-native';

import { MainReviewTag } from './MainReviewTag';

import { ReviewItem } from '@/screens/Main/store/useMainHotHomeStore';

export type MainRecentReviewCardProps = {
  review: ReviewItem;
};

export const MainRecentReviewCard = (props: MainRecentReviewCardProps) => {
  const { review } = props;

  return (
    <View className="mx-5 mb-4 flex-row rounded-3xl border border-black10 bg-white p-4">
      <View className="relative">
        <Image
          source={{ uri: review.image }}
          className="h-[132px] w-[132px] rounded-2xl"
        />

        {review.isLiked && (
          <View className="absolute left-2 top-2">
            {/* HeartIcon placeholder */}
          </View>
        )}
      </View>

      <View className="ml-4 flex-1 justify-between">
        <View>
          <Text className="font-pretendard text-[13px] text-black40">
            {review.region}
          </Text>

          <Text className="mt-1 font-pretendard text-[22px] font-bold text-black100">
            {review.title}
          </Text>

          <View className="mt-2 flex-row items-center">
            <Text className="ml-1 font-pretendard text-[15px] font-semibold text-black80">
              {review.rating ?? '없음'}
            </Text>

            <Text className="ml-1 font-pretendard text-[15px] text-black40">
              ({review.reviewCount})
            </Text>
          </View>

          <View className="mt-3 flex-row items-center">
            <Text className="font-pretendard text-[16px] text-black40">
              보증금
            </Text>

            <Text className="ml-1 font-pretendard text-[18px] font-bold text-black100">
              {review.deposit}
            </Text>

            <Text className="ml-3 font-pretendard text-[16px] text-black40">
              월세
            </Text>

            <Text className="ml-1 font-pretendard text-[18px] font-bold text-black100">
              {review.monthlyRent}
            </Text>
          </View>
        </View>

        <View className="mt-3 flex-row flex-wrap">
          {review.tags.map((tag) => (
            <MainReviewTag key={tag} label={tag} />
          ))}
        </View>
      </View>
    </View>
  );
};