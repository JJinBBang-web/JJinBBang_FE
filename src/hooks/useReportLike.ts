// src/hooks/content/useReportLike.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContentAPI } from "../api/content/contentAPI";

export const useAddReportLike = (reportId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => ContentAPI.addLike(reportId),

    onSuccess: () => {
      // 상세 페이지 갱신
      qc.invalidateQueries({ queryKey: ["reportDetail", reportId] });
    },
  });
};

export const useRemoveReportLike = (reportId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => ContentAPI.removeLike(reportId),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reportDetail", reportId] });
    },
  });
};
