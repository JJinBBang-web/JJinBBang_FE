import styles from "./PreviewBuildingReview.module.css";
import heartIconOn from "../../assets/image/heartIconOn.svg";
import heartIconOff from "../../assets/image/heartIconOff.svg";
import starIconOn from "../../assets/image/starIconOn.svg";
import starIconOff from "../../assets/image/starIconOff.svg";
import emptyCharacterIcon from "../../assets/image/emptyCharacterIcon.svg";
import PreviewReviewContent from "../PreviewReviewContent";
import {
  AgencyBuildingInfo,
  DormitoryBuildingInfo,
  GeneralBuildingInfo,
  PreviewBuildingReviewInfo,
} from "../../recoil/detail/PreviewBuildingReviewRecoilState";
import { useEffect, useState } from "react";
import { typeToKorean } from "../../util/mapping";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postAPI } from "../../api/baseAPI";
import noBuildingImg from "../../assets/image/noBuildingImg.svg";

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
  } else if (review.dormitoryBuildingInfo) {
    activeReviewInfo = review.dormitoryBuildingInfo;
  } else if (review.agencyBuildingInfo) {
    activeReviewInfo = review.agencyBuildingInfo;
  }

  const generalInfo = review.generalBuildingInfo;
  const dormitoryInfo = review.dormitoryBuildingInfo;
  const agencyInfo = review.agencyBuildingInfo;

  const mutation = useMutation({
    mutationFn: async () => {
      return postAPI(
        `/api/v1/user/bookmark`,
        {
          type: agencyInfo ? "agency" : "building",
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
    onError: (error) => {console.log(error)},
  });

  const rawRating = activeReviewInfo?.rating;
  const numericRating = Number(rawRating) || 0;
  const rating = Math.round(numericRating);

  const name = activeReviewInfo?.name;
  const type =
    generalInfo?.type.map((type) => typeToKorean[type]) ??
    (dormitoryInfo?.type && typeToKorean[dormitoryInfo.type]) ??
    (agencyInfo?.type && typeToKorean[agencyInfo.type]);
  const address = activeReviewInfo?.address;
  const reviewCount = activeReviewInfo?.reviewCount;
  const liked = activeReviewInfo?.liked;
  const image = review.image;

  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(review.reviewInfo.likeCount);

  useEffect(() => {
    setIsLiked(liked);
    setLikeCount(review.reviewInfo.likeCount);
  }, [liked, review.reviewInfo.likeCount, setIsLiked, setLikeCount]);

  // 실제 사용할 이미지 URL 계산
  const rawImageUrl = review?.image || '';
  const actualImageUrl = !rawImageUrl || rawImageUrl.includes('localhost') 
    ? '' 
    : rawImageUrl;

  const handleError = (e:any) => {
      // 만약 대체 이미지도 로드에 실패할 경우, 다시 onError가 무한 호출되는 것을 방지
      e.target.onError = null;
      // 이미지 src를 미리 import 해둔 대체 이미지로 변경
      e.target.src = noBuildingImg;
    };

  const handleNavigation = () => {
    if (review.agencyBuildingInfo) {
      alert('공인중개사 후기는 준비중입니다.');
    } else {
      navigate(`/building/${activeReviewInfo?.id}`);
    }
  };

  return (
    <div
      className={styles.content}
      onClick={handleNavigation}
    >
      <div className={styles.imgWrap}>
          <img src={actualImageUrl} alt={name} className={styles.buildingImg} onError={handleError} />
          {
            review?.imageCount && review.imageCount > 0 ? (
              <div className={styles.imgNum}><p className={styles.count}>{review.imageCount}</p></div>
            ) : null
          }
      </div>
      <div className={styles.infoAndLike}>
        <div className={styles.buildingInfo}>{name}</div>
        <div className={styles.likeContainer}>
          <img
            className={styles.likeButton}
            onClick={(event) => {
              event.stopPropagation();
              mutation.mutate();
              // setLikeCount((prev) => {
              //   return isLiked ? prev - 1 : prev + 1;
              // });
              // setIsLiked((prev) => !prev);
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
          <div
            className={
              agencyInfo
                ? `${styles.buildingPrice} ${styles.agency}`
                : styles.buildingPrice
            }
          >
            {type}
          </div>
        )}
        {dormitoryInfo && (
          <div className={`${styles.buildingPrice} ${styles.dormitory}`}>
            {dormitoryInfo.universityName.slice(0, -2)}
          </div>
        )}
      </div>
      <p className={styles.address}>{address}</p>
      {review.reviewInfo.keyword && (
        <div>
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
      )}
    </div>
  );
};

export default PreviewBuildingReview;
