import styles from "./ReportButton.module.css"
import reportIcon from "../../assets/image/reportIcon.svg"
import { useState } from "react"
import Modal from "../review/Modal"
import reportModalIcon from "../../assets/image/ReportModalIcon.svg"
import verifyCompleteIcon from "../../assets/image/verifyCompleteIcon.svg"

const ReportButton:React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isReported, setIsReported] = useState(false)

    return (
        <>
            <div className={`${styles.content} ${styles.reportBtn}`} onClick={()=> setIsOpen(true)}> 
                <img src={reportIcon} alt="topBtn" className={styles.reportImg}/>
            </div>

            {isOpen && (
                <Modal onClose={() => {setIsOpen(false); setIsReported(false)}}>
                    <>
                    {
                        isReported ? (
                            <>
                                <div className={styles.wrap}>
                                    <img src={verifyCompleteIcon} alt="reportImg"/>
                                    <div className={styles.textWrap} style={{gap:"12px"}}>
                                        <p className={styles.bitTitle}>신고완료</p>
                                        <p className={styles.subInfo}>
                                            건강한 찐빵 문화를 위해<br/>
                                            신고해 줘서 고마워요!<br/>
                                            찐빵이가 빠르게 조치할게요!
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.btnWrap}>
                                    <button className={styles.confirmBtn} onClick={()=> setIsOpen(false)}>확인</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.wrap}>
                                    <div className={styles.textWrap}>
                                        <p className={styles.title}>정말 신고하시겠어요?</p>
                                        <p className={styles.subInfo}>
                                        신고는 신중하게!<br/>
                                        부적절한 신고는 처리되지 않을 수 있어요<br/>
                                        다시 한 번 고민해 주세요
                                        </p>
                                    </div>
                                    <img src={reportModalIcon} alt="reportImg"/>
                                </div>
                                <div className={styles.btnWrap}>
                                    <button className={styles.prevBtn} onClick={()=> setIsOpen(false)}>이전</button>
                                    <button className={styles.reportBtn} onClick={()=> setIsReported(true)}>신고</button>
                                </div>
                            </>
                        )
                    }
                    </>
                </Modal>
            )}
        </>
    )
}

export default ReportButton;