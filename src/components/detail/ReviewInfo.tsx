import styles from "./ReviewInfo.module.css"
import heartIconOn from "../../assets/image/heartIconOn.svg";
import heartIconOff from "../../assets/image/heartIconOff.svg";
import starIconOn from "../../assets/image/starIconOn.svg";
import starIconOff from "../../assets/image/starIconOff.svg";
import heartIcon from "../../assets/image/heartIcon.svg";
import { Review } from "../../recoil/detail/ReviewInfoRecoliState";
import { tagImages, tagMessages } from "../Tag";
import { useEffect, useState } from "react";


interface Props {
    review: Review;
}

const ReviewInfo: React.FC<Props> = ({review}) => {
    const [isLiked, setIsLiked] = useState(review.basicInfo.liked);
    const [likeCount, setLikeCount] = useState(review.basicInfo.likesCount);
    
    useEffect(() => {
        setIsLiked(review.basicInfo.liked);
        setLikeCount(review.basicInfo.likesCount);
    },[review.basicInfo.liked, review.basicInfo.likesCount, setIsLiked, setLikeCount]);

    return (
        <div className={styles.content}>
            <div className={styles.typeAndLike}>
                <div className={styles.buildingContent}>
                    <div className={styles.buildingType}>{review.building.type}</div>
                    {
                        review.basicInfo.contractType == "전세" ?
                        <div className={styles.buildingType}>
                            {`${review.basicInfo.contractType} ${review.basicInfo.deposit}`}
                        </div>
                        :
                        <div className={styles.buildingType}>
                                {`${review.basicInfo.contractType} ${review.basicInfo.deposit}/${review.basicInfo.monthlyRent}`}

                        </div>
                    }
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
                    <p className={styles.buildingName}>{review.building.name}</p>
                    <div className={styles.detailBtn}>건물 상세</div>
                </div>
                <p className={styles.buildingSize}>{review.basicInfo.floor}, {review.basicInfo.space}m2, 관리비 {review.basicInfo.maintenanceCost}만</p>
            </div>
            <div className={styles.buildingRating}>
                {[...Array(review.basicInfo.rating)].map((_, index) => (
                <img src={starIconOn} alt="rate"></img>
                ))} 
                {[...Array(5 - Math.round(review.basicInfo.rating))].map((_, index) => (
                <img src={starIconOff} alt="rate" />
                ))} 
            </div>
            <div className={styles.reviewText}>
                {review.basicInfo.content}
            </div>
            <div className={styles.dateLikeContainer}>
                <p className={styles.date}>{review.basicInfo.updatedAt.toLocaleDateString("ko-KR")}</p>
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
                        review.keywords.positive.map((keyword, index) => (
                            <div key={index} className={styles.tag}>
                                <img src={tagImages[keyword]} alt={keyword} />
                                <p className={styles.tagText}>{tagMessages[keyword]}</p>
                            </div>
                        ))
                    }
                    </div>
                </div>
                <div className={styles.tagWrap}>
                    <p>단점</p>
                    <div className={styles.tagContainer}>
                    {
                        review.keywords.negative.map((keyword, index) => (
                            <div key={index} className={styles.tag}>
                                <img src={tagImages[keyword]} alt={keyword} />
                                <p className={styles.tagText}>{tagMessages[keyword]}</p>
                            </div>
                        ))
                    }
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ReviewInfo;