import styles from "./BuildingInfo.module.css"
import heartIconOn from "../../assets/image/heartIconOn.svg";
import heartIconOff from "../../assets/image/heartIconOff.svg";
import starIconOn from "../../assets/image/starIconOn.svg";
import starIconOff from "../../assets/image/starIconOff.svg";
import dlatl from "../../assets/image/PO_LO_01.svg"

const BuildingInfo: React.FC = () => {
    return (
        <div className={styles.content}>
            <div className={styles.typeAndLike}>
                <div className={styles.buildingType}>아파트</div>
                <div className={styles.likeContainer}>
                    <img
                        className={styles.likeButton}
                        onClick={(event) => {
                        event.stopPropagation(); // 부모 onClick 이벤트 전파 방지
                        //   setLikeCount((prev) => {
                        //     return isLiked ? prev - 1 : prev + 1;
                        //   });
                        //   setIsLiked((prev) => !prev);
                        }}
                        // src={isLiked ? heartIconOn : heartIconOff}
                        src={heartIconOn}
                        alt="heartIcon"
                    />
                </div>
            </div>
            <div className={styles.textWrap}>
                <p className={styles.buildingName}>진주가좌그린빌 주공아파트</p>
                <p className={styles.buildingAddress}>경남 진주시 내동로348번길 10 [가좌동 573-10]</p>
            </div>
            <div className={styles.reviewsInfo}>
                <div className={styles.buildingRating}>
                    {/* {[...Array(rating)].map((_, index) => ( */}
                    <img src={starIconOn} alt="rate"></img>
                    {/* ))}
                    {[...Array(5 - rating)].map((_, index) => ( */}
                    <img src={starIconOff} alt="rate"></img>
                    {/* ))} */}
                </div>
                <div className={styles.reviewCountDiv}>
                    <p>•</p>
                    <p>25</p>
                    <p>개의 찐빵</p>
                </div>
            </div>
            <div className={styles.keywordsWrap}>
                <div className={styles.keywordBack}>
                    <div className={styles.keywordContent}>
                        <img className={styles.keywordImg} src={dlatl}/>
                        <p className={styles.keyword}>교통이 편리해요</p>
                    </div>
                    <p className={styles.keywordCount}>10</p>
                </div>
                <div className={styles.keywordBack}>
                    <div className={styles.keywordContent}>
                        <img className={styles.keywordImg} src={dlatl}/>
                        <p className={styles.keyword}>교통이 편리해요</p>
                    </div>
                    <p className={styles.keywordCount}>10</p>
                </div>
            </div>
        </div>
    )
}

export default BuildingInfo;