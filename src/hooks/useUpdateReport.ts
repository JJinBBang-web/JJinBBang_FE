import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContentManageAPI } from "../api/content/contentManageAPI";
import { RefortCreateRequest } from "../types/entity/content/ContentInterface";

type UpdateReportParams = {
  reportId: number;
  data: RefortCreateRequest;
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, data }: UpdateReportParams) =>
      ContentManageAPI.patchReport(reportId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reportList"],
      });
    },
  });
};
