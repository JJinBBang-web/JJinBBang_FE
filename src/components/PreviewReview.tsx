import React, { useRef, useState, useEffect } from "react";
import styles from "./PreviewReview.module.css";
import heartIconOn from "../assets/image/heartIconOn.svg";
import heartIconOff from "../assets/image/heartIconOff.svg";
import starIconOn from "../assets/image/starIconOn.svg";
import starIconOff from "../assets/image/starIconOff.svg";
import PreviewReviewContent from "../components/PreviewReviewContent";
import { ReviewPreview } from "../recoil/detail/PreviewReviewRecoilState";

interface Props {
  review: ReviewPreview;
}

const PreviewReview: React.FC<Props> = ({
  review,
}) => {
  const liked = review.basicInfo?.liked ?? review.dormitoryBasicInfo?.liked;
  const name = review.basicInfo?.name ?? review.dormitoryBasicInfo?.name;
  const type = review.basicInfo?.type ?? review.dormitoryBasicInfo?.type;
  const rating = review.basicInfo?.rating ?? review.dormitoryBasicInfo?.rating;
  const floor = review.basicInfo?.floor ?? review.dormitoryBasicInfo?.floor;
  const space = review.basicInfo?.space ?? review.dormitoryBasicInfo?.space;

  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(review.reviewInfo.likesCount);

  useEffect(() => {
    setIsLiked(liked);
    setLikeCount(review.reviewInfo.likesCount);
  }, [liked, review.reviewInfo.likesCount, setIsLiked, setLikeCount]);

  return (
    <div
      className={styles.previewReviewContainer}
      onClick={() => {
        window.location.href = "https://www.naver.com"; // 현재 창에서 이동
      }}
    >
      <div className={styles.buildingContainer}>
        <img
          className={styles.buildingImg}
          src={review.reviewImage}
          alt={name}
        />
        <div className={styles.buildingContentContainer}>
          <div className={styles.buildingContent1}>
            <p className={styles.buildingName}>{name}</p>
            <div className={styles.likeContainer}>
              <img
                className={styles.likeButton}
                onClick={(event) => {
                  event.stopPropagation(); // 부모 onClick 이벤트 전파 방지
                  setLikeCount((prev) => {
                    return isLiked ? prev - 1 : prev + 1;
                  });
                  setIsLiked((prev) => !prev);
                }}
                src={isLiked ? heartIconOn : heartIconOff}
                alt="heartIcon"
              />
            </div>
          </div>
          <div className={styles.buildingContent2}>
            <div className={styles.buildingPrice}>{type}</div>
            {review.basicInfo && (
              <div className={styles.buildingPrice}>
                {review.basicInfo.contractType} {review.basicInfo.deposit}/
                {review.basicInfo.monthlyRent}
              </div>
            )}
            {review.dormitoryBasicInfo && (
              <div className={`${styles.buildingPrice} ${styles.dormitory}`}>
                {review.dormitoryBasicInfo.universityName}
              </div>
            )}
          </div>
          <p className={styles.buildingContent3}>
            {floor}층, {space}㎡,{" "}
            {review.basicInfo && `관리비 ${review.basicInfo.maintenanceCost}만`}{" "}
            {review.dormitoryBasicInfo &&
              `기숙사비 ${review.dormitoryBasicInfo.dormitoryFee}만`}
          </p>
          <div className={styles.buildingContent4}>
            {[...Array(rating ?? 0)].map((_, index) => (
              <img key={index} src={starIconOn} alt="rate"></img>
            ))}
            {[...Array(5 - (rating ?? 0))].map((_, index) => (
              <img key={index} src={starIconOff} alt="rate"></img>
            ))}
          </div>
        </div>
      </div>
      <PreviewReviewContent
        reviewInfo={review.reviewInfo}
      />
    </div>
  );
};

export default PreviewReview;
