// src/hooks/useNearUniversities.ts
import { useQuery } from "@tanstack/react-query";
import { UnivLocationAPI } from "../api/user/UnivLocationAPI";

type Args = {
  lat?: number | null;
  lng?: number | null;
  useAuth?: boolean;

  /**
   * enabled=false면 쿼리 실행 안 함
   * 예: 위치 권한/로딩 중일 때 제어
   */
  enabled?: boolean;

  /**
   * 위치가 바뀌는 UI에서 깜빡임 줄이기
   */
  keepPreviousData?: boolean;
};

export const QUERY_KEYS = {
  nearUniv: (lat?: number | null, lng?: number | null) => ["NEAR_UNIV", lat ?? null, lng ?? null] as const,
};

export function useNearUniversities({
  lat = null,
  lng = null,
  useAuth = false,
  enabled = true,
  keepPreviousData = true,
}: Args) {
  return useQuery({
    queryKey: QUERY_KEYS.nearUniv(lat, lng),
    queryFn: () => UnivLocationAPI.getNearUnivs({ lat, lng }, useAuth),
    enabled,
    staleTime: 60 * 1000, // 1분 정도 캐시(원하면 조절)
    gcTime: 10 * 60 * 1000, // 10분
    placeholderData: keepPreviousData ? (prev) => prev : undefined,
  });
}
