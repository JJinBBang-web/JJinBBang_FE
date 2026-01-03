import { api } from "../api";
import {
  MarkerRequest,
  MarkerResponse,
  NearByRequest,
  NearByResponse,
  SearchRequest,
  SearchResponse,
} from "../../types/entity/map/MapInterface";

export class MapAPI {
  // 마커 조회
  static async fetchMarkers(body: MarkerRequest): Promise<MarkerResponse[]> {
    try {
      const res = await api.post("/api/v1/map/markers", body, {
        useAuth: false,
      });

      if (res.data.code !== 200 || !res.data.data) {
        throw new Error("마커 조회 실패");
      }

      console.log(body);
      console.log(res.data.data);

      return res.data.data;
    } catch (error) {
      throw error;
    }
  }

  // 내 주변 찐빵 조회
  static async fetchNearByMapItem(
    body: NearByRequest
  ): Promise<NearByResponse> {
    try {
      // type에 따라 요청 body 구성
      // REVIEW: 모든 ID를 idList에 담음 (공인중개사 포함)
      // BUILDING: 일반 건물은 idList, 공인중개사는 agencyIdList로 분리
      const requestBody: any = {
        num: body.num,
        page: body.page,
        type: body.type,
        sortBy: body.sortBy,
        idList: body.idList,
      };

      // BUILDING 타입이고 agencyIdList가 있으면 추가
      if (body.agencyIdList && body.agencyIdList.length > 0) {
        requestBody.agencyIdList = body.agencyIdList;
      }

      const res = await api.post("/api/v1/map/markers/nearby", requestBody, {
        useAuth: true,
      });

      if (res.data.code !== 200 || !res.data.data) {
        throw new Error("내 주변 찐빵 조회 실패");
      }

      return res.data.data;
    } catch (error) {
      throw error;
    }
  }

  // 검색 조회
  static async fetchSearch(body: SearchRequest): Promise<SearchResponse> {
    try {
      const res = await api.post("/api/v1/map/search", body, {
        useAuth: true,
      });

      if (res.data.code !== 200 || !res.data.data) {
        throw new Error("검색 조회 실패");
      }

      return res.data.data;
    } catch (error) {
      throw error;
    }
  }
}
