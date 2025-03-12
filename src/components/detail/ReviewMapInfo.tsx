import styles from "./ReviewMapInfo.module.css"

const ReviewMapInfo:React.FC = () => {
    return (
        <div className={styles.content}>
            <p className={styles.title}>단지 정보</p>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>유형</p>
                <p className={styles.infoContent}>아파트</p>
            </div>
            <hr/>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>주소</p>
                <p className={styles.infoContent}>
                    경남 진주시 내동로348번길 10 [가좌동 573-10]
                </p>
            </div>
            <hr/>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>상세주소</p>
                <p className={styles.infoContent}>
                    진주가좌그린빌 주공아파트<br/>
                    저층                
                </p>
            </div>
            <div className={styles.map}>
                지도사진
            </div>
        </div>
    )
}

export default ReviewMapInfo