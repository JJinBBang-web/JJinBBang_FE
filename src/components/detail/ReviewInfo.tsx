import styles from "./ReviewInfo.module.css"
import heartIconOn from "../../assets/image/heartIconOn.svg";
import heartIconOff from "../../assets/image/heartIconOff.svg";
import starIconOn from "../../assets/image/starIconOn.svg";
import starIconOff from "../../assets/image/starIconOff.svg";
import heartIcon from "../../assets/image/heartIcon.svg";

const ReviewInfo: React.FC = () => {
    return (
        <div className={styles.content}>
            <div className={styles.typeAndLike}>
                <div className={styles.buildingContent}>
                    <div className={styles.buildingType}>아파트</div>
                    <div className={styles.buildingType}>
                    월세 300/30
                    </div>
                </div>
                <div className={styles.likeContainer}>
                    <img
                        className={styles.likeButton}
                        onClick={(event) => {
                        // event.stopPropagation(); // 부모 onClick 이벤트 전파 방지
                        //   setIsLiked((prev) => !prev);
                        }}
                        // src={isLiked ? heartIconOn : heartIconOff
                        src={heartIconOff}
                        alt="heartIcon"
                    />
                </div>
            </div>
            <div className={styles.textWrap}>
                <div className={styles.nameAndBtn}>
                    <p className={styles.buildingName}>진주가좌그린빌 주공아파트</p>
                    <div className={styles.detailBtn}>건물 상세</div>
                </div>
                <p className={styles.buildingSize}>저층, 26.44m2, 관리비 11만</p>
            </div>
            <div className={styles.buildingRating}>
                {/* {[...Array(buildingInfo.basicInfo.rating)].map((_, index) => ( */}
                <img src={starIconOn} alt="rate"></img>
                {/* ))} */}
                {/* {[...Array(5 - Math.round(buildingInfo.basicInfo.rating))].map((_, index) => ( */}
                <img src={starIconOff} alt="rate" />
                {/* ))} */}
            </div>
            <div className={styles.reviewText}>
                경상국립대 근처 자취방에서 1년 동안 거주했습니다. 학교와 도보 10분 거리라 통학이 정말 편리했고, 근처에 편의점과 작은 마트가 있어서 기본적인 생활이 수월했어요. 방은 채광이 좋아 낮에는 불을 켤 필요가 없었고, 통풍도 괜찮아서 여름에도 쾌적했습니다. 다만 방음이 조금 아쉬워서 밤에 옆방 소리가 들리곤 했습니다. 관리비도 비교적 합리적이어서 부담 없이 생활할 수 있었어요. 전반적으로 위치와 가격 대비 만족스러운 자취방이었습니다. 초보 자취생에게 추천드려요!
            </div>
            <div className={styles.dateLikeContainer}>
                <p className={styles.date}>2025.02.18</p>
                <div className={styles.likeContainer}>
                    <img className={styles.likeImg} src={heartIcon} alt="heart" />
                    <p className={styles.likeNum}>
                        {/* {likesCount > 99 ? "99+" : likesCount} */}
                        99+
                    </p>
                </div>
            </div>
            <div className={styles.JjinTagsWrap}>
                <div className={styles.tagWrap}>
                    <p>장점</p>
                    <div className={styles.tagContainer}>
                        {/* <div key={index} className={styles.tag}>
                            <img src={tagImages[keyword]} alt={keyword} />
                            <p className={styles.tagText}>{tagMessages[keyword]}</p>
                        </div> */}
                    </div>
                </div>
                <div className={styles.tagWrap}>
                    <p>단점</p>
                    <div className={styles.tagContainer}>
                        {/* <div key={index} className={styles.tag}>
                            <img src={tagImages[keyword]} alt={keyword} />
                            <p className={styles.tagText}>{tagMessages[keyword]}</p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ReviewInfo;