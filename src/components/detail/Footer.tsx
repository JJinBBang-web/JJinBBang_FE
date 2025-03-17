import styles from "./Footer.module.css"
import pencilIcon from "../../assets/image/pencilIcon.svg"

const Footer:React.FC = () => {
    return (
        <div className={styles.content}>
            <button className={styles.writeBtn}>
                <img src={pencilIcon} alt="writeImg" className={styles.writeImg}/>
                <p className={styles.textBtn}>정보 수정 및 삭제</p>
            </button>
        </div>
    )
}

export default Footer