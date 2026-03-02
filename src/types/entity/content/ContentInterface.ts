// src/types/entity/content/ContentInterface.ts

export type ReportCategory =
  | 'ALL'           // 전체
  | 'REAL_ESTATE'   // 부동산
  | 'TIPS'          // 자취꿀팁
  | 'CAMPUS_LIFE'   // 대학 생활
  | 'MOVING'        // 이사 관련

export interface ReportItem {
  id: number;
  coverImage: string;
  category: ReportCategory;  // 서버에서 문자열(한글)로 내려주므로 string
  title: string;
  createdAt: string; // "2025.11.10"
  likeCount: number;
  viewCount: number;
  isLiked?: boolean;
}

export interface ReportListPageInfo {
  nextCursor: number | null;
  hasNext: boolean;
}

export interface ReportListResponse {
  reportList: ReportItem[];
  pageInfo: ReportListPageInfo;
}

// 리포트 상세 조회
export interface ReportDetail {
  id: number;
  category: ReportCategory;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
  shareCount: number;
  isLiked: boolean;
}

// 리포트 작성 & 수정 요청
export interface RefortCreateRequest {
    category: ReportCategory;
    coverImage?: string;
    title: string;
    content: string;
}
