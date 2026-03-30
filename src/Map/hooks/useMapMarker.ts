import { useQuery } from "@tanstack/react-query";
import { MarkerRequest, MarkerResponse } from "../../types/entity/map/MapInterface"
import { MapAPI } from "../../api/map/MapAPI";

export const useMapMarkers = (params?: MarkerRequest) => {
  return useQuery<MarkerResponse[]>({
    queryKey: ['mapMarkers', params?.bounds, params?.filters],
    queryFn: () => {
      if (!params) throw new Error('params is undefined');
      return MapAPI.fetchMarkers(params);
    },
    staleTime: 0,
    gcTime: 1000 * 5,
    enabled: !!params,
    placeholderData: [],
  });
};