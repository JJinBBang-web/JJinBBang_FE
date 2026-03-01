import { BaseResponse } from "../baseType";

export interface getUniversityListResponse
  extends BaseResponse<{
    universityList: {
      id: number;
      universityName: string;
      logoImageUrl: string | null;
      campuses: {
        id: number;
        campusName: string;
        logoImageUrl: string | null;
        campusAddress: string;
        latitude: number;
        longitude: number;
      }[];
    }[];
  }> {}
