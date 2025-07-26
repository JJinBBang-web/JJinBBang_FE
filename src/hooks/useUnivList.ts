// src/hooks/useUnivList.ts
import { useQuery } from "@tanstack/react-query";
import { UnivAPI } from "../api/user/UnivAPI"; // 실제 경로에 맞게 조정
import { CampusResponse } from "../types/entity/user/UnivInterface";

export const useUnivList = () => {
  return useQuery<CampusResponse[]>({
    queryKey: ["universityList"],
    queryFn: UnivAPI.getUnivCampusList,
    staleTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
