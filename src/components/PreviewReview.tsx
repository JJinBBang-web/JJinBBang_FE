import React, { useRef, useState, useEffect } from "react";
import styles from "./PreviewReview.module.css";
import heartIconOn from "../assets/image/heartIconOn.svg";
import heartIconOff from "../assets/image/heartIconOff.svg";
import starIconOn from "../assets/image/starIconOn.svg";
import starIconOff from "../assets/image/starIconOff.svg";
import PreviewReviewContent from "../components/PreviewReviewContent";
import {
  ReviewPreview,
  GeneralReviewInfo,
  AgencyReviewInfo,
  DormitoryReviewInfo,
} from "../recoil/detail/PreviewReviewRecoilState";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getAPI, putAPI, deleteAPI, postAPI } from "../api/baseAPI";
import { useNavigate } from "react-router-dom";

interface Props {
  review: ReviewPreview;
}

const PreviewReview: React.FC<Props> = ({ review }) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

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
    onError: (error) => {},
  });
  const rawRating = activeReviewInfo?.rating;

  const numericRating = Number(rawRating) || 0;

  const rating = Math.round(numericRating);

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

  const [isLiked, setIsLiked] = useState(activeReviewInfo?.liked);
  const [likeCount, setLikeCount] = useState(review.reviewInfo.likeCount);

  useEffect(() => {
    setIsLiked(activeReviewInfo?.liked);
    setLikeCount(review.reviewInfo.likeCount);
  }, [
    activeReviewInfo?.liked,
    review.reviewInfo.likeCount,
    setIsLiked,
    setLikeCount,
  ]);

  return (
    <div
      className={styles.previewReviewContainer}
      onClick={() => navigate(`/building/review/${activeReviewInfo?.id}`)}
    >
      <div className={styles.buildingContainer}>
        <img
          className={styles.buildingImg}
          src={review.image}
          alt={activeReviewInfo?.name}
        />
        <div className={styles.buildingContentContainer}>
          <div className={styles.buildingContent1}>
            <p className={styles.buildingName}>{activeReviewInfo?.name}</p>
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
          <div className={styles.buildingContent2}>
            <div
              className={`${styles.buildingPrice} ${
                agencyInfo ? styles.agency : ""
              }`}
            >
              {type}
            </div>
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
          <p className={styles.buildingContent3}>
            {(generalInfo || dormitoryInfo) && `${floor}, `}
            {generalInfo &&
              `${generalInfo?.space}㎡, 관리비 ${generalInfo?.maintenanceCost}만`}
            {dormitoryInfo &&
              `${dormitoryInfo?.capacity}인실, 기숙사비 ${dormitoryInfo?.dormFee}만`}
          </p>
          <div className={styles.buildingContent4}>
            {[...Array(rating)].map((_, index) => (
              <img key={index} src={starIconOn} alt="rate"></img>
            ))}
            {[...Array(5 - rating)].map((_, index) => (
              <img key={index} src={starIconOff} alt="rate"></img>
            ))}
          </div>
        </div>
      </div>
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

export default PreviewReview;
