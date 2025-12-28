// src/hooks/content/useReportDetail.ts
import { useQuery } from "@tanstack/react-query";
import { ContentAPI } from "../api/content/contentAPI";
import { ReportDetail } from "../types/entity/content/ContentInterface";

export const useReportDetail = (reportId: number) => {
  return useQuery<ReportDetail>({
    queryKey: ["reportDetail", reportId],
    queryFn: () => ContentAPI.getReportDetail(reportId),
    enabled: !!reportId,
    staleTime: 0,
    refetchOnMount: "always",
  });
};
