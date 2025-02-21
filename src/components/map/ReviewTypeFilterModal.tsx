import styles from "./ReviewTypeFilterModal.module.css"

const ReviewTypeFilterModal = () => {
    return (
        <div className={styles.content}>
            <div className={styles.btn_content}>
                <button className={styles.select_btn}>후기별</button>
                <button className={styles.unselect_btn}>건물별</button>
            </div>
        </div>
    )
}

export default ReviewTypeFilterModal;