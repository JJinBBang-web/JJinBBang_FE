import styles from "./ReviewMapInfo.module.css"
import { Review } from "../../recoil/detail/ReviewInfoRecoliState";



interface Props {
    review: Review;
}

const ReviewMapInfo:React.FC<Props> = ({review}) => {
    return (
        <div className={styles.content}>
            <p className={styles.title}>단지 정보</p>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>유형</p>
                <p className={styles.infoContent}>{review.building.type}</p>
            </div>
            <hr/>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>주소</p>
                <p className={styles.infoContent}>
                    {review.building.address}
                </p>
            </div>
            <hr/>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>상세주소</p>
                <p className={styles.infoContent}>
                    {review.building.name}<br/>
                    {review.basicInfo.floor}           
                </p>
            </div>
            <div className={styles.map}>
                지도사진
            </div>
        </div>
    )
}

export default ReviewMapInfo