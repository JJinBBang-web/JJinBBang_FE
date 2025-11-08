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
  // 중요: currentStep은 여기서 업데이트하지 않음 (다음 버튼 클릭 시에만 업데이트)
  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Create a hash to detect actual changes (include image URLs for comparison)
    const currentHash = JSON.stringify({
      review: {
        ...review,
        images: review?.images || [] // Include actual image URLs for comparison
      },
      dormitoryReview: {
        ...dormitoryReview,
        images: dormitoryReview?.images || []
      }
    });

    // Only save if data actually changed
    if (currentHash !== lastSaveRef.current) {
      timeoutRef.current = setTimeout(async () => {
        try {
          // 기존 자동저장 데이터 로드
          const existingData = reviewAutoSave.load();

          // 내용만 업데이트하고 currentStep은 기존 값 유지
          await reviewAutoSave.save({
            reviewState: review,
            dormitoryReviewState: dormitoryReview,
            currentStep: existingData?.currentStep || currentStep
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
  }, [review, dormitoryReview]);

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