// src/hooks/university/useDormitoriesByCampusId.ts
import { useQuery } from "@tanstack/react-query";
import { UniversityAPI } from "../api/review/UniversityAPI";

export const DORMITORY_QUERY_KEYS = {
  dormitories: (campusId: number) => ["dormitories", campusId] as const,
};

export function useDormitoriesByCampusId(params: {
  campusId: number | null | undefined;
  enabled?: boolean;
}) {
  const campusId = params.campusId;
  const enabled = (params.enabled ?? true) && typeof campusId === "number";

  return useQuery({
    queryKey: DORMITORY_QUERY_KEYS.dormitories(campusId ?? -1),
    queryFn: () => UniversityAPI.getDormitoriesByCampusId({ campusId: campusId! }),
    enabled,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
