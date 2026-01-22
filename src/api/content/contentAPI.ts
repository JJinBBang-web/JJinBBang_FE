// src/api/content/ContentAPI.ts

import { api } from "../api";
import { ReportListResponse, ReportCategory, ReportDetail } from "../../types/entity/content/ContentInterface";

export class ContentAPI {

  /**
   * 리포트 목록 조회 API
   * @param category 리포트 카테고리
   * @param options 커서 및 페이지 사이즈
   * @returns {Promise<ReportListResponse>}
   */
  static async getReportList(
    category: ReportCategory,
    options?: {
      cursor?: number | null;
      size?: number;
    }
  ): Promise<ReportListResponse> {
    try {
      const response = await api.get(`/api/v1/report`, {
        params: {
          category,
          cursor: options?.cursor ?? null,
          size: options?.size ?? 10,
        },
        useAuth: false,
      });

      if (!response.data || response.data.code !== 200) {
        throw new Error("리포트 목록 조회 실패");
      }

      return response.data.data;
    } catch (error) {
      console.error("ContentAPI.getReportList error:", error);
      throw error;
    }
  }

    /**
   * 리포트 상세 조회 API
   * @param reportId 조회할 리포트 ID
   * @returns {Promise<ReportDetail>}
   */
  static async getReportDetail(reportId: number): Promise<ReportDetail> {
    try {
      const response = await api.get(`/api/v1/report/${reportId}`, {
        useAuth: true,
      });

      if (!response.data || response.data.code !== 200) {
        throw new Error("리포트 상세 조회 실패");
      }

      return response.data.data;
    } catch (error) {
      console.error("ContentAPI.getReportDetail error:", error);
      throw error;
    }
  }

  // 좋아요 추가
  static async addLike(reportId: number): Promise<void> {
    try {
      const response = await api.post(
        `/api/v1/report/like/${reportId}`,
        {},
        { useAuth: true }
      );

      if (!response.data || response.data.code !== 200) {
        throw new Error("리포트 좋아요 추가 실패");
      }
    } catch (error) {
      console.error("ContentAPI.addLike error:", error);
      throw error;
    }
  }


  // 좋아요 삭제
  static async removeLike(reportId: number): Promise<void> {
    try {
      const response = await api.delete(`/api/v1/report/like/${reportId}`, {
        useAuth: true,
      });

      if (!response.data || response.data.code !== 200) {
        throw new Error("리포트 좋아요 삭제 실패");
      }
    } catch (error) {
      console.error("ContentAPI.removeLike error:", error);
      throw error;
    }
  }

}
