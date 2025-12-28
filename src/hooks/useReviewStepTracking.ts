import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Hook to track a step in the review writing funnel.
 * Fires a 'view_review_step' event when the component mounts.
 * 
 * @param stepName - The unique name of the step (e.g., '1_review_type_select', '2_address_input')
 * @param additionalParams - Any extra parameters to send with the event
 */
const useReviewStepTracking = (stepName: string, additionalParams: object = {}) => {
  useEffect(() => {
    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Push the event to the dataLayer
    window.dataLayer.push({
      event: 'view_review_step',
      step_name: stepName,
      ...additionalParams,
    });

    // Optional: Log to console for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[GA Tracking] Step: ${stepName}`, additionalParams);
    }
  }, [stepName, JSON.stringify(additionalParams)]); // Re-run if stepName or params change deeply
};

export default useReviewStepTracking;
