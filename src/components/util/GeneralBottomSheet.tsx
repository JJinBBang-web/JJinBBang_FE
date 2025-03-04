import { useRecoilState } from "recoil";
import { isGeneralSheetOpenState, isSheetOpenState } from "../../recoil/util/utilRecoilState";
import styles from "./GeneralBottomSheet.module.css"
import { useEffect, useState } from "react";


const GeneralBottomSheet = () => {
    const [{ isOpen, type }, setBottomSheet] = useRecoilState(isGeneralSheetOpenState);
    const [isRendered, setIsRendered] = useState(false);

    console.log("isOpen:", isOpen, "type:", type); // 상태 변경 확인

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
        } else {
            const timer = setTimeout(() => setIsRendered(false), 300); // transition 시간과 일치
            return () => clearTimeout(timer);
        }
    }, [isOpen]);
    

    const closeModal = () => {
        setBottomSheet({ isOpen: false, type: null });
    };
    
    if (!isOpen) return null;

    return (
        <>
        <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`} 
                 onClick={closeModal} />
        <div className={`${styles.sheet} ${isOpen ? styles.open : ""}`}>
            <div className={styles.sheet_header}>
                <div className={styles.header_divider}></div>
            </div>
            {type === "ratingStars" && <></>}
            {type === "complete" && <></>}
            {type === "writeStop" && <></>}
            {type === "deleteReview" && <></>}
            {type === "reportReview" && <></>}
        </div>
        </>
    )
}

export default GeneralBottomSheet;