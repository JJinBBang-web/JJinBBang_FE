import styles from "./ReviewListHeader.module.css"

const ReviewListHeader = () => {
    return (
        <div className={styles.content}>
            <div className={styles.sheet}>
                <div className={styles.sheet_header}>
                    <div className={styles.header_divider}></div>
                </div>
                <p className={styles.title}>목록</p>
            </div>
            
        </div>
    )
}

export default ReviewListHeader