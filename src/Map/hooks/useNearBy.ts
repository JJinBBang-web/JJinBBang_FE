import { useQuery } from "@tanstack/react-query";
import { NearByRequest, NearByResponse } from "../../types/entity/map/MapInterface";
import { MapAPI } from "../../api/Map/MapAPI";

export const useNearBy = (params?: NearByRequest) => {
  return useQuery<NearByResponse>({
    queryKey: ['nearByItems', params],
    queryFn: () => {
      if (!params) throw new Error('params is undefined');
      return MapAPI.fetchNearByMapItem(params);
    },
    staleTime: 1000 * 60 * 3,
    enabled: !!params,
  });
};