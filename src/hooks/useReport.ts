// src/hooks/useReport.ts
import { useMutation } from '@tanstack/react-query';
import { postAPI } from '../api/baseAPI';

export type FromType = 'review' | 'building';
export type OpinionType = 'REVIEW_REPORT' | 'BUILDING_REPORT';

export interface CreateReportPayload {
  targetId: string | number;
  opinionType: OpinionType;
  opinion: string; // 신고 의견
}

export interface ReportRequest {
  from: FromType;
  targetId: string | number;
  opinion: string;
}

// 엔드포인트는 프로젝트에 맞게 수정해줘요.
const REPORT_ENDPOINT = '/api/v1/user/getOpinion';

const mapFromToOpinionType = (from: FromType): OpinionType =>
  from === 'review' ? 'REVIEW_REPORT' : 'BUILDING_REPORT';

export const useReport = () => {
  const mutation = useMutation({
    mutationFn: async ({ from, targetId, opinion }: ReportRequest) => {
      const body: CreateReportPayload = {
        targetId,
        opinionType: mapFromToOpinionType(from),
        opinion,
      };

      console.log(body);
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
