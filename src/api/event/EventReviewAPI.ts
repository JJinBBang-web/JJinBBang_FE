// src/api/event/EventReviewAPI.ts
import { postAPI } from "../baseAPI";

// Request Types
export type ContractType = "월세" | "전세";

export interface EventReviewRequest {
  review: {
    university: string;
    contractType: ContractType;
    deposit: number;
    monthlyRent: number;
    administrationCost: number;
    positiveKeywords: string[];
    negativeKeywords: string[];
    images: string[];
    content: string;
    address: string;
  };
  phoneNumber: string;
  hasAgreedToMarketing: boolean;
  hasAgreedToPrivacy: boolean;
}

// Response Types
export interface EventReviewResponse {
  code: number;
  message: string;
  data?: {
    reviewId?: number;
  };
}

// API Functions
export const eventReviewAPI = {
  /**
   * 이벤트 리뷰 제출
   * @param request - EventReviewRequest
   * @returns Promise<EventReviewResponse>
   */
  submitReview: async (
    request: EventReviewRequest
  ): Promise<EventReviewResponse> => {
    try {
      const response = await postAPI("/api/v1/event/review", request, false);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
