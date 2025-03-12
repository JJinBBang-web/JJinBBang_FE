import styles from "./ReviewContractInfo.module.css"
import { Review } from "../../recoil/detail/ReviewInfoRecoliState";

interface Props {
    review: Review;
}


const ReveiwContractInfo:React.FC<Props> = ({review}) => {
    return (
        <div className={styles.content}>
            <p className={styles.title}>계약 정보</p>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>계약 형태</p>
                <p className={styles.infoContent}>{review.basicInfo.contractType}</p>
            </div>
            <hr/>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>계약 조건</p>
                {
                    review.basicInfo.contractType == "전세" ?
                    <p className={styles.infoContent}>
                        전세 <span>{review.basicInfo.deposit}</span>만원<br/>
                        관리비 <span>{review.basicInfo.maintenanceCost}</span>만원<br/>
                    </p>
                    :
                    <p className={styles.infoContent}>
                        보증금 <span>{review.basicInfo.deposit}</span>만원<br/>
                        월세 <span>{review.basicInfo.monthlyRent}</span>만원<br/>
                        관리비 <span>{review.basicInfo.maintenanceCost}</span>만원<br/>
                    </p>
                }
            </div>
        </div>
    )
}

export default ReveiwContractInfo