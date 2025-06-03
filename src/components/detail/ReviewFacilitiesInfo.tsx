import { Review } from "../../recoil/detail/ReviewInfoRecoliState";
import styles from "./ReviewFacilitiesInfo.module.css"

interface Props {
    review: Review;
}

const ReviewFacilitiesInfo:React.FC<Props> = ({review}) => {
    const rest = review.facilities?.lounge == true ? "유" : "무"
    return (
        <div className={styles.content}>
            <p className={styles.title}>편의 시설</p>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>개인</p>
                <div className={styles.tagContainer}>
                {
                    review.facilities?.private.map((t, index) => (
                        <div key={index} className={styles.tag}>
                            <p className={styles.tagText}>{t}</p>
                        </div>
                    ))
                }
                </div>
            </div>
            <hr/>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>공용</p>
                <div className={styles.tagContainer}>
                {
                    review.facilities?.public.map((t, index) => (
                        <div key={index} className={styles.tag}>
                            <p className={styles.tagText}>{t}</p>
                        </div>
                    ))
                }
                </div>
            </div>
            <hr/>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>휴게시설</p>
                <p className={styles.infoContent}>{rest}</p>
            </div>   
        </div>
    )

}

export default ReviewFacilitiesInfo;
