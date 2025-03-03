import styles from "./TopButton.module.css"
import topIcon from "../../assets/image/iconUp.svg"

const TopButton:React.FC = () => {
    return (
        <div className={`${styles.content} ${styles.topBtn}`}>
            <img src={topIcon} alt="topBtn" style={{width:"28px"}}/>
        </div>
    )
}

export default TopButton;