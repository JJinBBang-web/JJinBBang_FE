import styles from "./ReviewContractInfo.module.css"

const ReveiwContractInfo:React.FC = () => {
    return (
        <div className={styles.content}>
            <p className={styles.title}>계약 정보</p>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>계약 형태</p>
                <p className={styles.infoContent}>월세</p>
            </div>
            <hr/>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>계약 조건</p>
                <p className={styles.infoContent}>
                    보증금 <span>500</span>만원<br/>
                    월세 <span>35</span>만원<br/>
                    관리비 <span>9</span>만원<br/>
                </p>
            </div>
        </div>
    )
}

export default ReveiwContractInfo