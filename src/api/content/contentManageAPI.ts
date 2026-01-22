// src/api/content/ContentManageAPI.ts
import { deleteAPI, postAPI, putAPI } from "../baseAPI";
import {
  RefortCreateRequest,
  ReportDetail,
} from "../../types/entity/content/ContentInterface";

export class ContentManageAPI {
  /**
   * 리포트 생성 API
   */
  static async createReport(
    reportData: RefortCreateRequest
  ): Promise<void> {
    const response = await postAPI(
      "/api/admin/report",
      reportData,
      true
    );

    return response.data;
  }

  /**
   * 리포트 수정 API
   */
  static async patchReport(
    reportId: number,
    reportData: RefortCreateRequest
  ): Promise<void> {
    const response = await putAPI(
      `/api/admin/report/${reportId}`,
      reportData,
      true
    );
    return response.data;
  }

  /**
   * 리포트 삭제 API
   */
  static async deleteReport(reportId: number): Promise<void> {
    const response = await deleteAPI(
      `/api/admin/report/${reportId}`,
      true,
    );
    return response.data;
  }
}

