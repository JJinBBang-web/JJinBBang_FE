// src/hooks/university/useCampusSearch.ts
import { useQuery } from "@tanstack/react-query";
import { UniversityAPI } from "../api/review/UniversityAPI";

export const UNIVERSITY_QUERY_KEYS = {
  campusSearch: (query: string, limit: number, offset: number) =>
    ["campusSearch", query, limit, offset] as const,
};

export function useCampusSearch(params: {
  query: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}) {
  const cleanedQuery = (params.query ?? "").replace(/\s+/g, "");
  const limit = params.limit ?? 15;
  const offset = params.offset ?? 0;

  const enabled =
    (params.enabled ?? true) && cleanedQuery.length > 0;

  return useQuery({
    queryKey: UNIVERSITY_QUERY_KEYS.campusSearch(cleanedQuery, limit, offset),
    queryFn: async () => {
    const result = await UniversityAPI.searchCampus({
      query: cleanedQuery,
      limit,
      offset,
    });

    console.log("searchCampus result:", result);

    if (!result) throw new Error("searchCampus returned undefined");

    return result;
  },
    enabled,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
