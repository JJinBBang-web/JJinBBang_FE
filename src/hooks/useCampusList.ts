import { useQuery } from "@tanstack/react-query";
import { UnivAPI } from "../api/user/UnivAPI";
import { CampusInterface } from "../types/entity/user/UnivInterface";

export const useCampusList = (universityName: string | null) => {
  return useQuery<CampusInterface[]>({
    queryKey: ["campusList", universityName],
    queryFn: async () => {
      if (!universityName) return [];
      const response = await UnivAPI.getUnivCampusList(universityName);
      return response.campusList;
    },
    enabled: !!universityName,
    staleTime: 1000 * 60 * 5,
  });
};
