// types/entity/building/ReviewInterface.ts
import { ReviewPreview } from "../../../recoil/detail/PreviewReviewRecoilState";
export type ViewSort = 'LATEST' | 'LIKES' | 'STARS';
export type ContractType = 'MONTHLY_RENT' | 'DEPOSIT_RENT'; // 실제 서버와 맞게 수정



// 전체 응답
export interface BuidlingReviewListResponse {
  num: number;
  page: number;
  itemNum: number;
  items: ReviewPreview[];
}
