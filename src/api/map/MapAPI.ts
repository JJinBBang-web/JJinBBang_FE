import { api } from "../api";
import { MarkerRequest, MarkerResponse, NearByRequest, NearByResponse, SearchRequest, SearchResponse } from "../../types/entity/map/MapInterface"


export class MapAPI {
  // 마커 조회 
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

  // 내 주변 찐빵 조회
  static async fetchNearByMapItem(body:NearByRequest) : Promise<NearByResponse>{
    try {
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

  // 검색 조회
  static async fetchSearch(body:SearchRequest) : Promise<SearchResponse>{
    try {
      console.log("📍 MapAPI.fetchSearch 요청 body:", body);
      const res = await api.post("/api/v1/map/search", body, {
        useAuth: false,
      });

      if (res.data.code !== 200 || !res.data.data) {
        throw new Error("검색 조회 실패");
      }

      return res.data.data;
    } catch (error) {
      console.error("MapAPI.fetchSearch error:", error);
      throw error;
    }
  }
}