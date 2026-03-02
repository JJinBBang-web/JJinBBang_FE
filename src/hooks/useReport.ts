// src/hooks/useReport.ts
import { useMutation } from '@tanstack/react-query';
import { postAPI } from '../api/baseAPI';

export type FromType = 'review' | 'building' | 'general'; // 신고 대상이 리뷰인지 건물인지 일반적인 신고인지 구분하는 타입
export type OpinionType = 'REVIEW_REPORT' | 'BUILDING_REPORT' | 'GENERAL';

export interface CreateReportPayload {
  targetId: string | number | null;
  opinionType: OpinionType;
  opinion: string; // 신고 의견
}

export interface ReportRequest {
  from: FromType;
  targetId: string | number | null;
  opinion: string;
}

// 엔드포인트는 프로젝트에 맞게 수정해줘요.
const REPORT_ENDPOINT = '/api/v1/user/getOpinion';

const mapFromToOpinionType = (from: FromType): OpinionType =>
  from === 'general' ? 'GENERAL' : from === 'review' ? 'REVIEW_REPORT' : 'BUILDING_REPORT';

export const useReport = () => {
  const mutation = useMutation({
    mutationFn: async ({ from, targetId, opinion }: ReportRequest) => {
      const body: CreateReportPayload = {
        targetId: from === 'general' ? null : targetId,
        opinionType: mapFromToOpinionType(from),
        opinion,
      };

      const res = await postAPI(REPORT_ENDPOINT, body, true);
      return res;
    },
  });

  return {
    report: mutation.mutate,
    reportAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error as unknown,
    data: mutation.data as unknown,
  };
};
