import { CampusResponse } from "../../types/entity/user/UnivInterface";
import { api } from "../api";

export class UnivAPI {
    static async getUnivCampusList(): Promise<CampusResponse[]> {
        try {
            const res = await api.get("/api/v1/user/univ", {
                    params: { offset: 0, limit: 15 },
                    useAuth: false,
                });
        
                if (res.data.code !== 200 || !res.data.data) {
                    throw new Error("대학교 조회 실패");
                }
        
                return res.data.data;
        } catch (error) {
            console.error("UnivAPI.getUniversityList error:", error);
            throw error;
        }
    }
}