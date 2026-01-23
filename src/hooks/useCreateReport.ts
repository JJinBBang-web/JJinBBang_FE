// src/hooks/content/useCreateReport.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContentManageAPI } from "../api/content/contentManageAPI";
import { RefortCreateRequest } from "../types/entity/content/ContentInterface";

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RefortCreateRequest) =>
      ContentManageAPI.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reportList"],
      });
    },
  });
};