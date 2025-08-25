import styles from "./ReviewInfo.module.css"
import heartIconOn from "../../assets/image/heartIconOn.svg";
import heartIconOff from "../../assets/image/heartIconOff.svg";
import starIconOn from "../../assets/image/starIconOn.svg";
import starIconOff from "../../assets/image/starIconOff.svg";
import heartIcon from "../../assets/image/heartIcon.svg";
import { Review } from "../../recoil/detail/ReviewInfoRecoliState";
import { tagImages, tagMessages } from "../Tag";
import { useEffect, useState } from "react";
import { contractTypeToKorean, floorToKorean, typeToKorean } from "../../util/mapping";
import { useNavigate } from "react-router-dom";


interface Props {
    review: Review;
}

const ReviewInfo: React.FC<Props> = ({review}) => {
    const navigate = useNavigate();
    const liked = review.generalReviewInfo?.liked ?? review.dormitoryReviewInfo?.liked ?? review.agencyReviewInfo?.liked;
    const name = review.generalReviewInfo?.name ?? review.dormitoryReviewInfo?.name ?? review.agencyReviewInfo?.name;
    const rawType = review.generalReviewInfo?.type ?? review.dormitoryReviewInfo?.type ?? review.agencyReviewInfo?.type;
    const type = rawType && typeToKorean[rawType] ? typeToKorean[rawType] : rawType ?? "";
    const rating = review.generalReviewInfo?.rating ?? review.dormitoryReviewInfo?.rating ?? review.agencyReviewInfo?.rating ?? 0;
    const rawFloor = review.generalReviewInfo?.floor ?? review.dormitoryReviewInfo?.floor;
    const floor = rawFloor && floorToKorean[rawFloor] ? floorToKorean[rawFloor] : rawFloor ?? "";
    const rawConstractType = review.generalReviewInfo?.contractType;
    const constractType = rawConstractType && contractTypeToKorean[rawConstractType] ? contractTypeToKorean[rawConstractType] : rawConstractType ?? "" ;
    const buildingId = review.building.buildingId;

    const [isLiked, setIsLiked] = useState(liked);
    const [likeCount, setLikeCount] = useState(review.reviewInfo.likeCount);
    
    useEffect(() => {
        setIsLiked(liked);
        setLikeCount(review.reviewInfo.likeCount);
    },[liked, review.reviewInfo.likeCount, setIsLiked, setLikeCount]);

    const handleToBuilding = () => {
        navigate(`/building/${buildingId}`);
    };

    return (
        <div className={styles.content}>
            <div className={styles.typeAndLike}>
                <div className={styles.buildingContent}>
                    {review.generalReviewInfo && (
                        constractType === "전세" ?
                            <>
                                <div className={styles.buildingType}>{type}</div>
                                <div className={styles.buildingType}>
                                    {`${constractType} ${review.generalReviewInfo.deposit}`}
                                </div>
                            </>
                        :
                            <>
                                <div className={styles.buildingType}>{type}</div>
                                <div className={styles.buildingType}>
                                        {`${constractType} ${review.generalReviewInfo.deposit}/${review.generalReviewInfo.price}`}
                                </div>
                            </>
                    )}
                    {review.dormitoryReviewInfo && (
                        <>
                            <div className={styles.buildingType}>{type}</div>
                            <div className={styles.campusType}>{review.dormitoryReviewInfo.universityName}</div>
                        </>
                    )}
                    {review.agencyReviewInfo && (
                        <div className={styles.agencyType}>{type}</div>
                    )}
                </div>
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
            <div className={styles.textWrap}>
                <div className={styles.nameAndBtn}>
                    <p className={styles.buildingName}>{name}</p>
                    <div className={styles.detailBtn} onClick={handleToBuilding}>건물 상세</div>
                </div>
                {review.generalReviewInfo && (
                    <p className={styles.buildingSize}>{floor}, {review.generalReviewInfo.space}m2, 관리비 {review.generalReviewInfo.maintenanceCost}만</p>
                )}
                {review.dormitoryReviewInfo && (
                    <p className={styles.buildingSize}>{floor}, {review.dormitoryReviewInfo.capacity}인실, 기숙사비 {review.dormitoryReviewInfo.dormFee}만</p>

                )}
            </div>
            <div className={styles.buildingRating}>
                {[...Array(Math.round(rating))].map((_, index) => (
                    <img src={starIconOn} alt="rate"></img>
                    ))} 
                    {[...Array(5 - Math.round(rating))].map((_, index) => (
                    <img src={starIconOff} alt="rate" />
                ))}
            </div>
            <div className={styles.reviewText}>
                {review.reviewInfo.content}
            </div>
            <div className={styles.dateLikeContainer}>
                <p className={styles.date}>{new Date(review.reviewInfo.updateAt).toLocaleDateString("ko-KR")}</p>
                <div className={styles.likeContainer}>
                    <img className={styles.likeImg} src={heartIcon} alt="heart" />
                    <p className={styles.likeNum}>
                        {likeCount > 99 ? "99+" : likeCount}
                    </p>
                </div>
            </div>
            <div className={styles.JjinTagsWrap}>
                <div className={styles.tagWrap}>
                    <p>장점</p>
                    <div className={styles.tagContainer}>
                        {
                        review.keywords?.positive?.length ? (
                            review.keywords.positive.map((keyword, index) => (
                            <div key={index} className={styles.tag}>
                                <img src={tagImages[keyword]} alt={keyword} />
                                <p className={styles.tagText}>{tagMessages[keyword]}</p>
                            </div>
                            ))
                        ) : (
                            <p className={styles.noTag}>표시할 장점 태그가 없습니다.</p>
                        )
                        }
                    </div>
                </div>
                <div className={styles.tagWrap}>
                    <p>단점</p>
                    <div className={styles.tagContainer}>
                        {
                        review.keywords?.negative?.length ? (
                            review.keywords.negative.map((keyword, index) => (
                            <div key={index} className={styles.tag}>
                                <img src={tagImages[keyword]} alt={keyword} />
                                <p className={styles.tagText}>{tagMessages[keyword]}</p>
                            </div>
                            ))
                        ) : (
                            <p className={styles.noTag}>표시할 단점 태그가 없습니다.</p>
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ReviewInfo;