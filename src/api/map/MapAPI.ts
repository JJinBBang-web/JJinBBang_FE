import { api } from "../api";
import { MarkerRequest, MarkerResponse, NearByRequest, NearByResponse } from "../../types/entity/map/MapInterface"


export class MapAPI {
  static async fetchMarkers(body: MarkerRequest): Promise<MarkerResponse[]> {
    try {
      console.log("📍 MapAPI.fetchMarkers 요청 body:", body);
      const res = await api.post("/api/v1/map/markers", body, {
        useAuth: false,
      });

      if (res.data.code !== 200 || !res.data.data) {
        throw new Error("마커 조회 실패");
      }

      return res.data.data;
    } catch (error) {
      console.error("MapAPI.fetchMarkers error:", error);
      throw error;
    }
  }

  static async fetchNearByMapItem(body:NearByRequest) : Promise<NearByResponse>{
    try {
      // console.log("📍 MapAPI.fetchNearByMapItem 요청 body:", body);
      const res = await api.post("/api/v1/map/markers/nearby", body, {
        useAuth: false,
      });

      if (res.data.code !== 200 || !res.data.data) {
        throw new Error("내 주변 찐빵 조회 실패");
      }

      return res.data.data;
    } catch (error) {
      console.error("MapAPI.fetchNearByMapItem error:", error);
      throw error;
    }
  }
}

//     /**
//      * 수정 API
//      * @param id {string} 식별번호
//      * @returns {Promise<TestInterface>} 수정된 객체 Promise 객체
//      */
//     static async updateTest({ id, title, data }: MapInterface): Promise<MapInterface | null> {
//         const updatedTest = await api.patch('/tests', {
//             id,
//             title,
//         });

//         if (!updatedTest.data.success) {
//             throw new Error("조회 실패");
//         }

//         return updatedTest.data.data;
//     }

//     /**
//      * 삭제 API
//      * @param id {string} 식별번호
//      * @returns {Promise<boolean>} 삭제 요청 결과
//      */
//     static async deleteTest(id: string): Promise<boolean> {
//         const result = await api.delete(`/tests/${id}`);
//         if (!result.data.success) {
//             throw new Error("조회 실패");
//         }

//         return result.data.data;
//     }
// }