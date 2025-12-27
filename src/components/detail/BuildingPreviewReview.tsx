import styles from "./BuildingPreviewReview.module.css";
import heartIconOn from "../../assets/image/heartIconOn.svg";
import heartIconOff from "../../assets/image/heartIconOff.svg";
import starIconOn from "../../assets/image/starIconOn.svg";
import starIconOff from "../../assets/image/starIconOff.svg";
import PreviewReviewContent from "../PreviewReviewContent";
import { tagMessages, tagImages } from "../Tag";
import {
  ReviewPreview,
  GeneralReviewInfo,
  AgencyReviewInfo,
  DormitoryReviewInfo,
} from "../../recoil/detail/PreviewReviewRecoilState";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postAPI } from "../../api/baseAPI";
import { trackExplorationStep } from "../../hooks/useExplorationTracking";

interface Props {
  review: ReviewPreview;
  trackStep: string;
}

const BuildingPreviewReview: React.FC<Props> = ({ review, trackStep }) => {
  let activeReviewInfo:
    | GeneralReviewInfo
    | AgencyReviewInfo
    | DormitoryReviewInfo
    | undefined;

  if (review.generalReviewInfo) {
    activeReviewInfo = review.generalReviewInfo;
  } else if (review.dormitoryReviewInfo) {
    activeReviewInfo = review.dormitoryReviewInfo;
  } else if (review.agencyReviewInfo) {
    activeReviewInfo = review.agencyReviewInfo;
  }

  const generalInfo = review.generalReviewInfo;
  const dormitoryInfo = review.dormitoryReviewInfo;
  const agencyInfo = review.agencyReviewInfo;

  const rawRating = activeReviewInfo?.rating;
  const numericRating = Number(rawRating) || 0;
  const rating = Math.round(numericRating);

  const mutation = useMutation({
    mutationFn: async () => {
      return postAPI(
        `/api/v1/user/bookmark`,
        {
          type: "review",
          id: activeReviewInfo?.id,
          bookmark: !isLiked,
        },
        true
      );
    },
    onSuccess: (data) => {
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    },
  });

  let type;
  if (activeReviewInfo?.type === "ROOM") {
    type = "원룸";
  } else if (activeReviewInfo?.type === "APARTMENT") {
    type = "아파트";
  } else if (activeReviewInfo?.type === "DORMITORY") {
    type = "기숙사";
  } else if (activeReviewInfo?.type === "HOUSE") {
    type = "빌라";
  } else if (activeReviewInfo?.type === "AGENCY") {
    type = "공인중개사";
  } else if (activeReviewInfo?.type === "OFFICETEL") {
    type = "오피스텔";
  } else if (activeReviewInfo?.type === "BOARDING_HOUSE") {
    type = "하숙집";
  }

  const floorinfo = generalInfo ?? dormitoryInfo;
  let floor = "";
  if (floorinfo?.floor === "HIGH") {
    floor = "고층";
  } else if (floorinfo?.floor === "LOW") {
    floor = "저층";
  } else if (floorinfo?.floor === "MID") {
    floor = "중층";
  } else if (floorinfo?.floor === "ATTIC") {
    floor = "옥탑";
  } else if (floorinfo?.floor === "BASEMENT") {
    floor = "반지하";
  }
  // const liked = review.basicInfo?.liked ?? review.dormitoryBasicInfo?.liked ?? review.agencyReviewInfo?.liked;
  // const type = review.basicInfo?.type ?? review.dormitoryBasicInfo?.type ?? review.agencyReviewInfo?.type;
  // const rating = review.basicInfo?.rating ?? review.dormitoryBasicInfo?.rating ?? review.agencyReviewInfo?.rating ?? 0;
  // const floor = review.basicInfo?.floor ?? review.dormitoryBasicInfo?.floor;
  // const space = review.basicInfo?.space;
  // const fee = review.basicInfo?.maintenanceCost ?? review.dormitoryBasicInfo?.dormFee;
  // const capacity = review.dormitoryBasicInfo?.capacity;

  const [isLiked, setIsLiked] = useState(activeReviewInfo?.liked);
  const [likeCount, setLikeCount] = useState(review.reviewInfo.likeCount);

  console.log(activeReviewInfo);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLiked(activeReviewInfo?.liked);
    setLikeCount(review.reviewInfo.likeCount);
  }, [
    activeReviewInfo?.liked,
    review.reviewInfo.likeCount,
    setIsLiked,
    setLikeCount,
  ]);

  // 공인중개사 프리뷰

  // 기숙사 프리뷰

  // 일반 프리뷰

  return (
    <div
      className={styles.content}
      onClick={() => {
        trackExplorationStep(trackStep);
        navigate(`/building/review/${activeReviewInfo?.id}`);
        window.scrollTo(0, 0);
      }}
    >
      <img src={review.image} alt="" className={styles.buildingImg} />
      <div className={styles.infoAndLike}>
        {generalInfo && (
          <div className={styles.buildingInfo}>
            {floor}, {generalInfo.space}m2, 관리비 {generalInfo.maintenanceCost}
            만
          </div>
        )}
        {dormitoryInfo && (
          <div className={styles.buildingInfo}>
            {floor}, {dormitoryInfo.capacity}인실, 기숙사비{" "}
            {dormitoryInfo.dormFee}만
          </div>
        )}
        {agencyInfo && (
          <div className={styles.buildingRating}>
            {[...Array(rating)].map((_, index) => (
              <img key={`on-${index}`} src={starIconOn} alt="rate" />
            ))}
            {[...Array(5 - rating)].map((_, index) => (
              <img key={`off-${index}`} src={starIconOff} alt="rate" />
            ))}
          </div>
        )}
        <div className={styles.likeContainer}>
          <img
            className={styles.likeButton}
            onClick={(event) => {
              event.stopPropagation(); // 부모 onClick 이벤트 전파 방지
              mutation.mutate();
            }}
            src={isLiked ? heartIconOn : heartIconOff}
            alt="heartIcon"
          />
        </div>
      </div>
      {(generalInfo || dormitoryInfo) && (
        <>
          <div className={styles.buildingContent}>
            <div className={styles.buildingPrice}>{type}</div>
            {generalInfo && (
              <div className={styles.buildingPrice}>
                {
                  generalInfo.contractType === "MONTHLY_RENT"
                    ? "월세" // contractType이 'MONTHLY_RENT'일 경우 표시
                    : generalInfo.contractType === "DEPOSIT_RENT"
                    ? "전세" // contractType이 'DEPOSIT_RENT'일 경우 표시
                    : generalInfo.contractType // 둘 다 아닐 경우 원래 값 표시
                }{" "}
                {generalInfo?.deposit}/{generalInfo?.price}
              </div>
            )}
            {dormitoryInfo && (
              <div className={`${styles.buildingPrice} ${styles.dormitory}`}>
                {dormitoryInfo.universityName.slice(0, -2)}
              </div>
            )}

          </div>
          <div className={styles.buildingRating}>
            {[...Array(rating)].map((_, index) => (
              <img key={`on-${index}`} src={starIconOn} alt="rate" />
            ))}
            {[...Array(5 - rating)].map((_, index) => (
              <img key={`off-${index}`} src={starIconOff} alt="rate" />
            ))}
          </div>
        </>
      )}
      
      {/* {review.dormitoryBasicInfo && (
        <>
          <div className={styles.buildingContent}>
            <div className={`${styles.buildingPrice}`}>
              {review.dormitoryBasicInfo.type}
            </div>
            <div className={`${styles.buildingPrice} ${styles.dormitory}`}>
              {review.dormitoryBasicInfo.university}
            </div>
          </div>
          <div className={styles.buildingRating}>
            {[...Array(rating)].map((_, index) => (
              <img key={`on-${index}`} src={starIconOn} alt="rate" />
            ))}
            {[...Array(5 - rating)].map((_, index) => (
              <img key={`off-${index}`} src={starIconOff} alt="rate" />
            ))}
          </div>
        </>
      )} */}
      <PreviewReviewContent
        reviewInfo={{
          content: review.reviewInfo.content,
          keyword: review.reviewInfo.keyword,
          likeCount: likeCount,
          updateAt: review.reviewInfo.updateAt,
        }}
      />
    </div>
  );
};

export default BuildingPreviewReview;
