import styles from "./TopButton.module.css"
import topIcon from "../../assets/image/iconUp.svg"

const TopButton:React.FC = () => {
    const handleScrollTop = () => {
        document.documentElement.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className={`${styles.content} ${styles.topBtn}`} onClick={handleScrollTop}> 
            <img src={topIcon} alt="topBtn" style={{width:"28px"}}/>
        </div>
    )
}

export default TopButton;