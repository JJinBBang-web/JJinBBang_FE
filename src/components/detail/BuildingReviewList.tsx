import { useRecoilState } from "recoil";
import styles from "./BuildingReviewList.module.css";
import PreviewBuildingReview from "./PreviewBuildingReview";
import { PreviewBuildingReviewState } from "../../recoil/detail/PreviewBuildingReviewRecoilState";
import { useEffect } from "react";
import BuildingPreviewReview from "./BuildingPreviewReview";
import { ReviewPreviewState } from "../../recoil/detail/PreviewReviewRecoilState";

const mockData = [
  {
    basicInfo: {
      reviewId: 1,
      name: "다희빌",
      type: "원룸",
      contractType: "월세",
      deposit: 500,
      monthlyRent: 45,
      floor: "고층",
      space: 26.44,
      maintenanceCost: 10,
      rating: 3,
      liked: true,
    },
    reviewInfo: {
      content: "집이 너무 깔끔하고...",
      keywords: ["PO_BD_LO_01", "PO_BD_MT_01", "PO_BD_LO_04"],
      likesCount: 120,
      updatedAt: new Date("2025-02-23T04:06:00.000+09:00"),
    },
    reviewImage: "http://localhost:8080/image/1.jpg",
  },
  {
    agencyReviewInfo: {
      id: 1,
      name: "e편한공인중개사사무소",
      type: "공인중개사",
      rating: 3,
      liked: true, // false
    },
    reviewInfo: {
      content: "집이 너무 깔끔하고...",
      keywords: [
        "PO_AG_PD_01",
        "PO_AG_PD_01",
        "NE_AG_PD_01",
        "PO_AG_SO_04",
        "NE_AG_SO_04",
      ],
      likesCount: 120,
      updatedAt: new Date("2025-02-23T04:06:00.000+09:00"), //yyyy-MM-dd'T'HH:mm:ss.SSSXXX
    },
    image: "http://localhost:8080/image/1.jpg",
  },
  {
    dormitoryBasicInfo: {
      id: 3, // 리뷰 ID
      name: "지희관",
      type: "기숙사",
      university: "경상국립대",
      capacity: 2,
      floor: "중층",
      space: 26.44, // area -> space 변경
      dormFee: 10,
      rating: 3,
      liked: true,
    },
    reviewInfo: {
      content: "조용하고 좋은데, 편의점이 멀어요.",
      keywords: ["PO_BD_ST_01", "NE_BD_LO_07", "NE_BD_LO_01", "PO_BD_ST_05"],
      likesCount: 45,
      updatedAt: new Date("2025-02-20T11:30:00.000+09:00"),
    },
    image: "http://localhost:8080/image/2.jpg",
  },
];

const BuildingReviewList: React.FC = () => {
  const [reviews, setReviews] = useRecoilState(ReviewPreviewState);

  useEffect(() => {
    setReviews(mockData);
  }, []);

  return (
    <div className={styles.content}>
      <div className={styles.filterWrap}>
        <>
          <p className={styles.selectedText}>
            <span>•</span>최신순
          </p>
          <p>
            <span>•</span>좋아요순
          </p>
          <p>
            <span>•</span>별점순
          </p>
        </>
      </div>
      {/* 리뷰 */}
      {reviews.map((review) => (
        <div
          key={
            review.basicInfo?.reviewId ??
            review.dormitoryBasicInfo?.id ??
            review.agencyReviewInfo?.id
          }
        >
          <div className={styles.line} />
          <BuildingPreviewReview review={review} />
        </div>
      ))}
    </div>
  );
};

export default BuildingReviewList;
