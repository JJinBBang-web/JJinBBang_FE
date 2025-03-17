import styles from "./ReportButton.module.css"
import reportIcon from "../../assets/image/reportIcon.svg"

const ReportButton:React.FC = () => {

    return (
        <div className={`${styles.content} ${styles.reportBtn}`}> 
            <img src={reportIcon} alt="topBtn" className={styles.reportImg}/>
        </div>
    )
}

export default ReportButton;