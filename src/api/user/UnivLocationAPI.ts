import { getAPI } from "../baseAPI";
import { CampusResponse } from "../../types/entity/user/UnivInterface";

type NearUnivParams = {
  lat?: number | null;
  lng?: number | null;
};

const buildQuery = (params: NearUnivParams) => {
  const qs = new URLSearchParams();

  // lat/lng 둘 다 nullable이므로 "값이 있을 때만" query에 붙임
  if (params.lat !== null && params.lat !== undefined) qs.set("lat", String(params.lat));
  if (params.lng !== null && params.lng !== undefined) qs.set("lng", String(params.lng));

  const query = qs.toString();
  return query ? `?${query}` : "";
};

export const UnivLocationAPI = {
  /**
   * GET /api/v1/user/univ/location
   * - lat/lng 둘 중 하나라도 없으면 서버에서 활성 순 TOP10 반환
   */
  getNearUnivs: async (
    params: NearUnivParams = {},
    useAuthOption = false
  ): Promise<CampusResponse[]> => {
    const query = buildQuery(params);

    const response = await getAPI(`/api/v1/user/univ/location${query}`, useAuthOption);
    return response.data.universityList;
  },
};