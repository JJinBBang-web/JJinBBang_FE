import { CampusResponse } from "../../types/entity/user/UnivInterface";
import { api } from "../api";
import { getAPI } from "../baseAPI";
import { getUniversityListResponse } from "./UserInterface";

export class UnivAPI {
  static async getUniversityList(): Promise<getUniversityListResponse> {
    try {
      const response = await getAPI("/api/v1/user/univ", true);
      return response;
    } catch (error) {
      throw error;
    }
  }


  static async getUnivCampusList(): Promise<CampusResponse[]> {
    try {
      const res = await api.get("/api/v1/user/univ", {
        params: { offset: 0, limit: 15 },
        useAuth: false,
      });

      if (res.data.code !== 200 || !res.data.data) {
        throw new Error("대학교 조회 실패");
      }
      console.log(res);
      console.log(res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("UnivAPI.getUniversityList error:", error);
      throw error;
    }
  }
}