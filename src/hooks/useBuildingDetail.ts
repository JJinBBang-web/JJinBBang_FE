import { useQuery } from "@tanstack/react-query";
import { BuildingAPI } from "../api/building/BuildingAPI";

export const useBuildingDetail = (buildingId: string, isAgency: boolean) => {
  return useQuery({
    queryKey: ["buildingDetail", buildingId, isAgency],
    queryFn: () => BuildingAPI.getBuildingDetail(buildingId, isAgency),
    staleTime: 1000 * 60 * 5,
  });
};