import styles from "./PreviewBuildingReview.module.css"
import heartIconOn from "../../assets/image/heartIconOn.svg";
import heartIconOff from "../../assets/image/heartIconOff.svg";
import starIconOn from "../../assets/image/starIconOn.svg";
import starIconOff from "../../assets/image/starIconOff.svg";
import PreviewReviewContent from "../PreviewReviewContent";
import { tagMessages, tagImages } from "../Tag";
import { ReviewPreview } from "../../recoil/detail/PreviewReviewRecoilState";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

interface Props {
    review: ReviewPreview;
}

const PreviewBuildingReview:React.FC<Props> = ({review}) => {
    const [isLiked, setIsLiked] = useState(review.basicInfo.liked);
    const [likeCount, setLikeCount] = useState(review.reviewInfo.likesCount);
    
    useEffect(() => {
        setIsLiked(review.basicInfo.liked);
        setLikeCount(review.reviewInfo.likesCount);
    }, [review.basicInfo.liked, review.reviewInfo.likesCount, setIsLiked, setLikeCount]);

    return (
        <div className={styles.content}>
            <img src="" alt="" className={styles.buildingImg}/>
            <div className={styles.infoAndLike}>
                <div className={styles.buildingInfo}>{review.basicInfo.name}</div>
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
                <div className={styles.buildingPrice}>{review.basicInfo.type}</div>
                <div className={styles.buildingPrice}>
                {review.basicInfo.contractType} {review.basicInfo.deposit}/{review.basicInfo.monthlyRent}
                </div>
            </div>
            <div className={styles.buildingRating}>
                    {[...Array(review.basicInfo.rating)].map((_, index) => (
                    <img src={starIconOn} alt="rate"></img>
                    ))}
                    {[...Array(5 - Math.round(review.basicInfo.rating))].map((_, index) => (
                    <img key={index} src={starIconOff} alt="rate" />
                    ))}
            </div>
            <PreviewReviewContent
                reviewInfo={{
                    content : review.reviewInfo.content,
                    keywords : review.reviewInfo.keywords,
                    likesCount : likeCount,
                    updatedAt : review.reviewInfo.updatedAt
                }}
            />
        </div>
    )
}

export default PreviewBuildingReview;