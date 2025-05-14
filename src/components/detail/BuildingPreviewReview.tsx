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
import { useNavigate } from "react-router-dom";

interface Props {
    review: ReviewPreview;
}

const BuildingPreviewReview:React.FC<Props> = ({review}) => {
    const liked = review.basicInfo?.liked ?? review.dormitoryBasicInfo?.liked;
    const type = review.basicInfo?.type ?? review.dormitoryBasicInfo?.type;
    const rating = review.basicInfo?.rating ?? review.dormitoryBasicInfo?.rating ?? 0;
    const floor = review.basicInfo?.floor ?? review.dormitoryBasicInfo?.floor;
    const space = review.basicInfo?.space ?? review.dormitoryBasicInfo?.space;
    const fee = review.basicInfo?.maintenanceCost ?? review.dormitoryBasicInfo?.dormitoryFee;

    const [isLiked, setIsLiked] = useState(liked);
    const [likeCount, setLikeCount] = useState(review.reviewInfo.likesCount);

    const navigate = useNavigate();


    useEffect(() => {
        setIsLiked(liked);
        setLikeCount(review.reviewInfo.likesCount);
    }, [liked, review.reviewInfo.likesCount, setIsLiked, setLikeCount]);

    return (
        <div className={styles.content} onClick={()=> {navigate('/building/rv'); window.scrollTo(0, 0);}}>
            <img src="" alt="" className={styles.buildingImg}/>
            <div className={styles.infoAndLike}>
                <div className={styles.buildingInfo}>{floor}, {space}m2, 관리비{fee}만</div>
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
                <div className={styles.buildingPrice}>{type}</div>
                {review.basicInfo && (
                review.basicInfo.contractType === "월세" ? (
                    <div className={styles.buildingPrice}>
                    {review.basicInfo.contractType} {review.basicInfo.deposit}/
                    {review.basicInfo.monthlyRent}
                    </div>
                ) : (
                    <div className={styles.buildingPrice}>
                    {review.basicInfo.contractType} {review.basicInfo.deposit}
                    </div>
                )
                )}
                {review.dormitoryBasicInfo && (
                <div className={`${styles.buildingPrice} ${styles.dormitory}`}>
                    {review.dormitoryBasicInfo.universityName}
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

export default BuildingPreviewReview;