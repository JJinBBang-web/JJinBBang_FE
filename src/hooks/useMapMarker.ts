import { useQuery } from "@tanstack/react-query";
import { MarkerRequest, MarkerResponse } from "../types/entity/map/MapInterface"
import { MapAPI } from "../api/map/MapAPI";

export const useMapMarkers = (params?: MarkerRequest) => {
  return useQuery<MarkerResponse[]>({
    queryKey: ['mapMarkers', params],
    queryFn: () => {
      if (!params) throw new Error('params is undefined');
      return MapAPI.fetchMarkers(params);
    },
    staleTime: 1000 * 60 * 3,
    enabled: !!params,
  });
};