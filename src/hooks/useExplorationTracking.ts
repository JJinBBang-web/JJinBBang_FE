import { useEffect } from 'react';
import { getAPI } from '../api/baseAPI';
import { useRecoilState } from 'recoil';
import { explorationFrequencyState } from '../recoil/util/explorationFrequencyState';
import { getRecoil, setRecoil } from '../util/RecoilNexus';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

// 빈도수 구간 계산 헬퍼 함수
const getFrequencyRange = (count: number) => {
  if (count <= 5) return '0-5회';
  if (count <= 10) return '6-10회';
  if (count <= 50) return '11-50회';
  return '51회 이상';
};


/**
 * Standalone function to track exploration steps.
 * Uses RecoilNexus to access global Recoil state.
 * 
 * @param stepName - The unique name of the step
 */
export const trackExplorationStep = async (stepName: string) => {
  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];


  // Get verification status from sessionStorage
  let verificationStatus = sessionStorage.getItem('verificationStatus') || 'unverified';
  
  // If not verified, check with API
  if (verificationStatus !== 'verified') {
    try {
      const response = await getAPI(`/api/v1/user`, true);
      if (response.data.univAuthentication === "인증완료") {
        sessionStorage.setItem("verificationStatus", "verified");
        verificationStatus = 'verified';
      }
    } catch (error) {
    }
  }

  let currentCount = 0;
  try {
      if(verificationStatus === 'verified') {
    const frequencyMap = getRecoil(explorationFrequencyState);
      currentCount = (frequencyMap[stepName] || 0) + 1;      
      
      // 2. Update frequency via RecoilNexus
      setRecoil(explorationFrequencyState, (prev) => ({
          ...prev,
          [stepName]: currentCount
      }));
      }
  } catch (e) {
      console.warn("RecoilNexus not initialized yet, skipping state update", e);
      currentCount = 1;
  }
  if(verificationStatus === 'verified') {
  // Push the event to the dataLayer
  window.dataLayer.push({
    event: 'view_exploration_step',
    step_name: stepName,
    verification_status: verificationStatus,
    frequency: currentCount,
    frequency_range: getFrequencyRange(currentCount),
  });

  // Optional: Log to console for debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[GA Exploration Tracking] Step: ${stepName}`, { 
      verificationStatus, 
      frequency: currentCount,
      frequency_range: getFrequencyRange(currentCount),
    });
    }
  }
};

/**
 * Hook to track a step in the review exploration funnel.
 * Fires a 'view_exploration_step' event when the component mounts.
 * 
 * @param stepName - The unique name of the step (e.g., '1_map_view', '2_building_detail', '3_review_detail')
 */
const useExplorationTracking = (stepName: string) => {
  useEffect(() => {
    trackExplorationStep(stepName);
  }, [stepName]); // Re-run if stepName changes
};

export default useExplorationTracking;
