import styles from "./PreviewBuildingReview.module.css";
import heartIconOn from "../../assets/image/heartIconOn.svg";
import heartIconOff from "../../assets/image/heartIconOff.svg";
import starIconOn from "../../assets/image/starIconOn.svg";
import starIconOff from "../../assets/image/starIconOff.svg";
import PreviewReviewContent from "../PreviewReviewContent";
import { tagMessages, tagImages } from "../Tag";
import { BuildingReviewPreview } from "../../recoil/detail/PreviewBuildingReviewRecoilState";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

interface Props {
  review: BuildingReviewPreview;
}

const PreviewBuildingReview: React.FC<Props> = ({ review }) => {
  const name = review.basicInfo?.name ?? review.dormitoryBuildInfo?.name;
  const type = review.basicInfo?.type ?? review.dormitoryBuildInfo?.type;
  const rating = review.basicInfo?.rating ?? review.dormitoryBuildInfo?.rating;
  const address =
    review.basicInfo?.address ?? review.dormitoryBuildInfo?.address;
  const reviewCount =
    review.basicInfo?.reviewCount ?? review.dormitoryBuildInfo?.reviewCount;
  const liked = review.basicInfo?.liked ?? review.dormitoryBuildInfo?.liked;

  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(review.reviewInfo.likesCount);

  useEffect(() => {
    setIsLiked(liked);
    setLikeCount(review.reviewInfo.likesCount);
  }, [liked, review.reviewInfo.likesCount, setIsLiked, setLikeCount]);

  return (
    <div className={styles.content}>
      <img src="" alt="" className={styles.buildingImg} />
      <div className={styles.infoAndLike}>
        <div className={styles.buildingInfo}>{name}</div>
        <div className={styles.likeContainer}>
          <img
            className={styles.likeButton}
            onClick={(event) => {
              event.stopPropagation(); // 부모 onClick 이벤트 전파 방지
              console.log(likeCount);
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
      <div className={styles.buildingContent}>
        {review.basicInfo &&
          review.basicInfo.type.map((typeItem, index) => (
            <div key={index} className={styles.buildingPrice}>
              {typeItem}
            </div>
          ))}
        {review.dormitoryBuildInfo && (
          <>
            <div className={styles.buildingPrice}>
              {review.dormitoryBuildInfo.type}
            </div>
            <div className={`${styles.buildingPrice} ${styles.dormitory}`}>
              {review.dormitoryBuildInfo.universityName}
            </div>
          </>
        )}
      </div>
      <p className={styles.address}>{address}</p>
      <div className={styles.buildingRating}>
        <div>
          {[...Array(rating ?? 0)].map((_, index) => (
            <img key={index} src={starIconOn} alt="rate"></img>
          ))}
          {[...Array(5 - Math.round(rating ?? 0))].map((_, index) => (
            <img key={index} src={starIconOff} alt="rate" />
          ))}
        </div>
        <p className={styles.reviewCount}>• {reviewCount}개의 찐빵</p>
      </div>
      <PreviewReviewContent
        reviewInfo={{
          content: review.reviewInfo.content,
          keywords: review.reviewInfo.keywords,
          likesCount: likeCount,
          updatedAt: review.reviewInfo.updatedAt,
        }}
      />
    </div>
  );
};

export default PreviewBuildingReview;
