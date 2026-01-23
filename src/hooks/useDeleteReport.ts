import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContentManageAPI } from "../api/content/contentManageAPI";

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: number) =>
      ContentManageAPI.deleteReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reportList"],
      });
    },
  });
};