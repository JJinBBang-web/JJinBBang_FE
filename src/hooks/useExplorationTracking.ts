import { useEffect } from 'react';
import { getAPI } from '../api/baseAPI';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Standalone function to track exploration steps.
 * Use this in event handlers where hooks cannot be called.
 * 
 * @param stepName - The unique name of the step
 * @param additionalParams - Any extra parameters to send with the event
 */
export const trackExplorationStep = async (stepName: string, additionalParams: object = {}) => {
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

  // Push the event to the dataLayer
  window.dataLayer.push({
    event: 'view_exploration_step',
    step_name: stepName,
    verification_status: verificationStatus,
    ...additionalParams,
  });

  // Optional: Log to console for debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[GA Exploration Tracking] Step: ${stepName}`, { verificationStatus, ...additionalParams });
  }
};

/**
 * Hook to track a step in the review exploration funnel.
 * Fires a 'view_exploration_step' event when the component mounts.
 * 
 * @param stepName - The unique name of the step (e.g., '1_map_view', '2_building_detail', '3_review_detail')
 * @param additionalParams - Any extra parameters to send with the event
 */
const useExplorationTracking = (stepName: string, additionalParams: object = {}) => {
  useEffect(() => {
    trackExplorationStep(stepName, additionalParams);
  }, [stepName, JSON.stringify(additionalParams)]); // Re-run if stepName or params change deeply
};

export default useExplorationTracking;
