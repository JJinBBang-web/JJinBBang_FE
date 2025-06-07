import styles from "./ReviewContractInfo.module.css"
import { Review } from "../../recoil/detail/ReviewInfoRecoliState";

interface Props {
    review: Review;
}


const ReveiwContractInfo:React.FC<Props> = ({review}) => {
    return (
        <div className={styles.content}>
            {review.generalReviewInfo && (
                <>
                <p className={styles.title}>계약 정보</p>
                <div className={styles.infoWrap}>
                    <p className={styles.subTitle}>계약 형태</p>
                    <p className={styles.infoContent}>{review.generalReviewInfo.contractType}</p>
                </div>
                <hr/>
                <div className={styles.infoWrap}>
                    <p className={styles.subTitle}>계약 조건</p>
                    {
                        review.generalReviewInfo.contractType == "전세" ?
                        <p className={styles.infoContent}>
                            전세 <span>{review.generalReviewInfo.deposit}</span>만원<br/>
                            관리비 <span>{review.generalReviewInfo.maintenanceCost}</span>만원<br/>
                        </p>
                        :
                        <p className={styles.infoContent}>
                            보증금 <span>{review.generalReviewInfo.deposit}</span>만원<br/>
                            월세 <span>{review.generalReviewInfo.monthlyRent}</span>만원<br/>
                            관리비 <span>{review.generalReviewInfo.maintenanceCost}</span>만원<br/>
                        </p>
                    }
                </div>
                </>
            )}
            {review.domitoryReviewInfo && (
                <>
                <p className={styles.title}>입주자 정보</p>
                <div className={styles.infoWrap2}>
                    <p className={styles.subTitle}>입주 조건</p>
                    <div className={styles.tagContainer}>
                        <div className={styles.tag}>
                            <p className={styles.tagText}>거주 지역</p>
                        </div>
                        <div className={styles.tag}>
                            <p className={styles.tagText}>학기 성적</p>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className={styles.infoWrap2}>
                    <p className={styles.subTitle}>거주 지역</p>
                    <p className={styles.infoContent}>{review.conditions?.currnet_region}</p>
                </div>
                <hr/>
                <div className={styles.infoWrap2}>
                    <p className={styles.subTitle}>학기 성적</p>
                    <p className={styles.infoContent}>{review.conditions?.currnet_grade}</p>
                </div>
                </>
            )}
        </div>
    )
}

export default ReveiwContractInfo