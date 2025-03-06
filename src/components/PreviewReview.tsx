import React, { useRef, useState, useEffect } from "react";
import styles from "./PreviewReview.module.css";
import heartIconOn from "../assets/image/heartIconOn.svg";
import heartIconOff from "../assets/image/heartIconOff.svg";
import starIconOn from "../assets/image/starIconOn.svg";
import starIconOff from "../assets/image/starIconOff.svg";
import PreviewReviewContent from "../components/PreviewReviewContent";

interface PreviewReviewProps {
  basicInfo?: {
    id: number; // 리뷰 ID
    name: string;
    type: string;
    contractType: string;
    deposit: number; // 보증금
    monthlyRent: number; // 월세
    floor: number; // 0: 옥탑, -1: 반지하, 1 이상: 층수
    space: number; // 면적 (㎡)
    maintenanceCost: number; // 관리비
    rating: number; // 평점
    liked: boolean; // 좋아요 여부
  };
  dormitoryBasicInfo?: {
    id: number; // 리뷰 ID
    name: string;
    type: string;
    universityName: string;
    floor: number; // 0: 옥탑, -1: 반지하, 1 이상: 층수
    space: number; // 면적 (㎡)
    DormitoryFee: number; // 관리비
    rating: number; // 평점
    liked: boolean; // 좋아요 여부
  };
  reviewInfo: {
    content: string; // 리뷰 내용
    keywords: string[]; // 태그 목록
    likesCount: number;
    updatedAt: Date;
  };
  image: string; // 이미지 URL
}

const PreviewReview: React.FC<PreviewReviewProps> = ({
  basicInfo,
  dormitoryBasicInfo,
  reviewInfo: { content, keywords, likesCount, updatedAt },
  image,
}) => {
  const liked = basicInfo?.liked ?? dormitoryBasicInfo?.liked;
  const name = basicInfo?.name ?? dormitoryBasicInfo?.name;
  const type = basicInfo?.type ?? dormitoryBasicInfo?.type;
  const rating = basicInfo?.rating ?? dormitoryBasicInfo?.rating;
  const floor = basicInfo?.floor ?? dormitoryBasicInfo?.floor;
  const space = basicInfo?.space ?? dormitoryBasicInfo?.space;

  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likesCount);

  useEffect(() => {
    setIsLiked(liked);
    setLikeCount(likesCount);
  }, [liked, likesCount, setIsLiked, setLikeCount]);

  return (
    <div
      className={styles.previewReviewContainer}
      onClick={() => {
        window.location.href = "https://www.naver.com"; // 현재 창에서 이동
      }}
    >
      <div className={styles.buildingContainer}>
        <img className={styles.buildingImg} src={image} alt={name} />
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
            {basicInfo && (
              <div className={styles.buildingPrice}>
                {basicInfo.contractType} {basicInfo.deposit}/
                {basicInfo.monthlyRent}
              </div>
            )}
            {dormitoryBasicInfo && (
              <div className={`${styles.buildingPrice} ${styles.dormitory}`}>
                {dormitoryBasicInfo.universityName}
              </div>
            )}
          </div>
          <p className={styles.buildingContent3}>
            {floor}층, {space}㎡,{" "}
            {basicInfo && `관리비 ${basicInfo.maintenanceCost}만`}{" "}
            {dormitoryBasicInfo &&
              `기숙사비 ${dormitoryBasicInfo.DormitoryFee}만`}
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
        reviewInfo={{
          content,
          keywords,
          likesCount: likeCount,
          updatedAt,
        }}
      />
    </div>
  );
};

export default PreviewReview;
