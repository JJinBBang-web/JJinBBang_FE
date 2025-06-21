import Modal from "../review/Modal";
import styles from "./ReviewListHeader.module.css"

interface Props {
    onOpenModal: () => void;
  }


const ReviewListHeader: React.FC<Props> = ({ onOpenModal }) => {
    return (
        <>
        <div className={styles.content} >
            <div className={styles.sheet} onClick={onOpenModal}>
                <div className={styles.sheet_header}>
                    <div className={styles.header_divider}></div>
                </div>
                <p className={styles.title}>목록</p>
            </div>
            
        </div>
        </>
    )
}

export default ReviewListHeader