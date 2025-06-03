import styles from "./ReportButton.module.css"
import reportIcon from "../../assets/image/reportIcon.svg"
import { useState } from "react"
import Modal from "../review/Modal"
import reportModalIcon from "../../assets/image/ReportModalIcon.svg"
import verifyCompleteIcon from "../../assets/image/verifyCompleteIcon.svg"
import { useLocation, useNavigate } from "react-router-dom"

const ReportButton:React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isReported, setIsReported] = useState(false)

    const navigate = useNavigate();
    const locate = useLocation();

    const handleButtonClick = () => {
        navigate('/building/rv/report', { state: locate.state });
      };

    return (
        <>
            <div className={`${styles.content} ${styles.reportBtn}`} onClick={handleButtonClick}> 
                <img src={reportIcon} alt="topBtn" className={styles.reportImg}/>
            </div>
        </>
    )
}

export default ReportButton;