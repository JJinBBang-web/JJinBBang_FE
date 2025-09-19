// src/hooks/useReviewAutoSave.ts
import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { reviewState } from '../recoil/review/reviewAtoms';
import { dormitoryReviewState } from '../recoil/review/dormitoryReviewAtoms';
import { reviewAutoSave } from '../util/reviewAutoSave';

export const useReviewAutoSave = (currentStep?: string) => {
  const [review, setReview] = useRecoilState(reviewState);
  const [dormitoryReview, setDormitoryReview] = useRecoilState(dormitoryReviewState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<string>('');

  // 자동 저장 (500ms 디바운스 + 중복 실행 방지)
  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Create a hash to detect actual changes
    const currentHash = JSON.stringify({
      review: {
        ...review,
        images: review?.images?.length || 0 // Only track image count for hash
      },
      dormitoryReview: {
        ...dormitoryReview,
        images: dormitoryReview?.images?.length || 0
      },
      currentStep
    });

    // Only save if data actually changed
    if (currentHash !== lastSaveRef.current) {
      timeoutRef.current = setTimeout(async () => {
        try {
          await reviewAutoSave.save({
            reviewState: review,
            dormitoryReviewState: dormitoryReview,
            currentStep
          });
          lastSaveRef.current = currentHash;
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 500);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [review, dormitoryReview, currentStep]);

  // 페이지 로드 시 자동 저장된 데이터 복원
  const restoreAutoSavedData = () => {
    const savedData = reviewAutoSave.load();
    if (savedData) {
      if (savedData.reviewState) {
        setReview(savedData.reviewState);
      }
      if (savedData.dormitoryReviewState) {
        setDormitoryReview(savedData.dormitoryReviewState);
      }
      return true; // 복원됨
    }
    return false; // 복원할 데이터 없음
  };

  // 자동 저장 데이터 삭제
  const clearAutoSavedData = () => {
    reviewAutoSave.clear();
  };

  // 자동 저장된 데이터가 있는지 확인
  const hasAutoSavedData = () => {
    return reviewAutoSave.hasData();
  };

  return {
    restoreAutoSavedData,
    clearAutoSavedData,
    hasAutoSavedData
  };
};