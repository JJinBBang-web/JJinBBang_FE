// src/hooks/content/useReportList.ts
import { useQuery } from "@tanstack/react-query";
import { ContentAPI } from "../api/content/contentAPI";
import { ReportCategory, ReportListResponse } from "../types/entity/content/ContentInterface";

interface ReportListParams {
  category: ReportCategory;
  cursor?: number | null;
  size?: number;
}

export const useReportList = (params: ReportListParams) => {
  return useQuery<ReportListResponse>({
    queryKey: ["reportList", params.category, params.cursor, params.size],
    queryFn: () =>
      ContentAPI.getReportList(params.category, {
        cursor: params.cursor,
        size: params.size,
      }),
    staleTime: 0,
    refetchOnMount: "always",
  });
};
