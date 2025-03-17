import { useRecoilState } from "recoil";
import styles from "./BuildingReviewList.module.css";
import PreviewBuildingReview from "./PreviewBuildingReview";
import { PreviewBuildingReviewState } from "../../recoil/detail/PreviewBuildingReviewRecoilState";
import { useEffect } from "react";

const mockData = [
  {
    basicInfo: {
      id: 1,
      name: "다희빌",
      type: ["원룸", "아파트"],
      address: "서울시 강남구",
      rating: 3,
      reviewCount: 10,
      liked: true,
    },
    reviewInfo: {
      content: "집이 너무 깔끔하고...",
      keywords: ["PO_LO_01", "PO_MT_01", "PO_MT_04"],
      likesCount: 120,
      updatedAt: new Date("2025-02-23T04:06:00.000+09:00"),
    },
    reviewImage: "http://localhost:8080/image/1.jpg",
  },
  {
    dormitoryBuildInfo: {
      id: 2,
      name: "한빛원룸",
      type: "기숙사",
      universityName: "서울대학교",
      address: "서울시 관악구",
      rating: 4,
      reviewCount: 20,
      liked: false,
    },
    reviewInfo: {
      content: "조용하고 좋은데, 편의점이 멀어요.",
      keywords: ["PO_ST_02", "NE_LO_07"],
      likesCount: 45,
      updatedAt: new Date("2025-02-20T11:30:00.000+09:00"),
    },
    reviewImage: "http://localhost:8080/image/2.jpg",
  },
];

const BuildingReviewList: React.FC = () => {
  const [reviews, setReviews] = useRecoilState(PreviewBuildingReviewState);

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
        <div key={review.basicInfo?.id ?? review.dormitoryBuildInfo?.id}>
          <div className={styles.line} />
          <PreviewBuildingReview review={review} />
        </div>
      ))}
    </div>
  );
};

export default BuildingReviewList;
