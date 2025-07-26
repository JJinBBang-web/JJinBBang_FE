import styles from "./PreviewBuildingReview.module.css";
import heartIconOn from "../../assets/image/heartIconOn.svg";
import heartIconOff from "../../assets/image/heartIconOff.svg";
import starIconOn from "../../assets/image/starIconOn.svg";
import starIconOff from "../../assets/image/starIconOff.svg";
import PreviewReviewContent from "../PreviewReviewContent";
import { AgencyBuildingInfo, DormitoryBuildingInfo, GeneralBuildingInfo, PreviewBuildingReviewInfo } from "../../recoil/detail/PreviewBuildingReviewRecoilState";
import { useEffect, useState } from "react";
import { typeToKorean } from "../../util/mapping";
import { useNavigate } from "react-router-dom";

interface Props {
  review: PreviewBuildingReviewInfo;
}

const PreviewBuildingReview: React.FC<Props> = ({ review }) => {
  const navigate = useNavigate();

  let activeReviewInfo:
      | GeneralBuildingInfo
      | AgencyBuildingInfo
      | DormitoryBuildingInfo
      | undefined;

  if (review.generalBuildingInfo) {
    activeReviewInfo = review.generalBuildingInfo;
  } else if (review.dormitoryBuildInfo) {
    activeReviewInfo = review.dormitoryBuildInfo;
  } else if (review.agencyBuildingInfo) {
    activeReviewInfo = review.agencyBuildingInfo;
  }

  const generalInfo = review.generalBuildingInfo;
  const dormitoryInfo = review.dormitoryBuildInfo;
  const agencyInfo = review.agencyBuildingInfo;

  const rawRating = activeReviewInfo?.rating;
  const numericRating = Number(rawRating) || 0;
  const rating = Math.round(numericRating);


  const name = activeReviewInfo?.name;
  const type = generalInfo?.type.map((type) => typeToKorean[type]) ?? dormitoryInfo?.type ?? agencyInfo?.type;
  const address = activeReviewInfo?.address;
  const reviewCount = activeReviewInfo?.reviewCount;
  const liked = activeReviewInfo?.liked;

  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(review.reviewInfo.likeCount);

  useEffect(() => {
    setIsLiked(liked);
    setLikeCount(review.reviewInfo.likeCount);
  }, [liked, review.reviewInfo.likeCount, setIsLiked, setLikeCount]);

  return (
    <div className={styles.content}
      onClick={()=> navigate(`/building/${activeReviewInfo?.id}`)}
    >
      <img src="" alt="" className={styles.buildingImg} />
      <div className={styles.infoAndLike}>
        <div className={styles.buildingInfo}>{name}</div>
        <div className={styles.likeContainer}>
          <img
            className={styles.likeButton}
            onClick={(event) => {
              event.stopPropagation();
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
        {Array.isArray(type) ? (
          type.map((typeItem, index) => (
            <div key={index} className={styles.buildingPrice}>
              {typeItem}
            </div>
          ))
        ) : (
          <div className={`${styles.buildingPrice} ${styles.agency}`}>{type}</div>
        )}
        {dormitoryInfo && (
          <div className={`${styles.buildingPrice} ${styles.dormitory}`}>
            {dormitoryInfo.universityName}
          </div>
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
          keyword: review.reviewInfo.keyword,
          likeCount: likeCount,
          updateAt: review.reviewInfo.updateAt,
        }}
      />
    </div>
  );
};

export default PreviewBuildingReview;
