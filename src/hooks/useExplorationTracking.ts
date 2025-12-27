import { useEffect } from 'react';

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
export const trackExplorationStep = (stepName: string, additionalParams: object = {}) => {
  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];

  // Get verification status from sessionStorage
  const verificationStatus = sessionStorage.getItem('verificationStatus') || 'unverified';

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
