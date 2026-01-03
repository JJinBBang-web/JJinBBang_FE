import { useRecoilState } from "recoil";
import styles from "./BuildingReviewList.module.css";
import { useEffect, useState } from "react";
import BuildingPreviewReview from "./BuildingPreviewReview";
import { ReviewPreviewState } from "../../recoil/detail/PreviewReviewRecoilState";
import { useNavigate, useParams } from "react-router-dom";
import { useBuildingReviewList } from "../../hooks/useBuildingReviewList";

interface Props {
    isAgency : boolean;
}

const BuildingReviewList: React.FC<Props> = ({isAgency}) => {
  const { buildingId } = useParams();
  const [reviews, setReviews] = useRecoilState(ReviewPreviewState);
  const [selectedSort, setSelectedSort] = useState<
    "RCMND" | "LATEST" | "LIKES" | "STARS"
  >("RCMND");

  // 기본값: 최신순, 1페이지, 10개
  const { data, isLoading, isError } = useBuildingReviewList({
    buildingId: buildingId ?? "",
    sortBy: selectedSort,
    isAgency: isAgency,
  });

  useEffect(() => {
    if (data?.items) {
      const mapped = data.items.map((item) => ({
        ...item,
        reviewInfo: {
          ...item.reviewInfo,
        },
      }));

      setReviews(mapped);
    }
  }, [data]);
  
  if (data?.itemNum === 0) return null;
  if (isLoading) return <div>리뷰 불러오는 중...</div>;
  if (isError) return <div>리뷰 불러오기 실패</div>;

  return (
    <div>
      <hr/>
      <div className={styles.content}>
        <div className={styles.filterWrap}>
          {[
            { label: "추천순", value: "RCMND" },
            { label: "최신순", value: "LATEST" },
            { label: "좋아요순", value: "LIKES" },
            { label: "별점순", value: "STARS" },
          ].map((sortOption) => (
            <p
              key={sortOption.value}
              className={
                selectedSort === sortOption.value
                  ? styles.selectedText
                  : undefined
              }
              onClick={() =>
                setSelectedSort(sortOption.value as typeof selectedSort)
              }
            >
              <span>•</span>
              {sortOption.label}
            </p>
          ))}
        </div>
        {/* 리뷰 */}
        {reviews.map((review) => (
          <div
            key={
              review.generalReviewInfo?.id ??
              review.dormitoryReviewInfo?.id ??
              review.agencyReviewInfo?.id
            }
          >
            <div className={styles.line} />
            <BuildingPreviewReview review={review} trackStep="6.1_building_review" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuildingReviewList;
