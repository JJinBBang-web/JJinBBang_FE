import { useQuery } from "@tanstack/react-query";
import { MapAPI } from "../../api/map/MapAPI";
import { SearchRequest, SearchResponse } from "../../types/entity/map/MapInterface";

export const useSearch = (params?: SearchRequest) => {
  return useQuery<SearchResponse>({
    queryKey: ['searchItems', params],
    queryFn: () => {
      if (!params) throw new Error('params is undefined');
      return MapAPI.fetchSearch(params);
    },
    staleTime: 1000 * 60 * 3,
    enabled: !!params,
  });
};