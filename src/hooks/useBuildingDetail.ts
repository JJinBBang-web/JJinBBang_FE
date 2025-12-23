import { useQuery } from "@tanstack/react-query";
import { BuildingAPI } from "../api/building/BuildingAPI";

export const useBuildingDetail = (buildingId: string, isAgency: boolean, isLogin: boolean) => {
  return useQuery({
    queryKey: ["buildingDetail", buildingId, isAgency],
    queryFn: () => BuildingAPI.getBuildingDetail(buildingId, isAgency),
    staleTime: 0,
    enabled: !!buildingId && isLogin,
    refetchOnMount: "always",
  });
};