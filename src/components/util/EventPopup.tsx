import styles from './Popup.module.css';
import { useEffect, useState } from "react";
import reviewEventPopup from "../../assets/image/content/banner/ReviewEventPopup.png"

const STORAGE_KEY = "home_review_event_popup_hidden_until";
const HIDE_MS = 24 * 60 * 60 * 1000; // 24시간
// const HIDE_MS = 30 * 100;

const EventPopupSheet = () => { {
    const [isOpenPopup, setIsOpenPopup] = useState(true);

    useEffect(() => {
        const hiddenUntil = Number(localStorage.getItem(STORAGE_KEY) || "0");
        const now = Date.now();

        // 아직 숨김 기간이면 닫힌 상태 유지
        if (now < hiddenUntil) {
            setIsOpenPopup(false);
            return;
        }

        // 숨김 기간이 아니면 오픈
        setIsOpenPopup(true);
    }, []);


    const closeModal = () => {
        const hiddenUntil = Date.now() + HIDE_MS;
        localStorage.setItem(STORAGE_KEY, String(hiddenUntil));
        setIsOpenPopup(false);
    };

    const onClickPopup = () => {
        const hiddenUntil = Date.now() + HIDE_MS;
        localStorage.setItem(STORAGE_KEY, String(hiddenUntil));
        setIsOpenPopup(false);
        window.open("https://www.naver.com", "_blank");
    }

    if (!isOpenPopup) return null;
    
    return (
        <>
        <div className={styles.overlay} onClick={closeModal}/>
        <img src={reviewEventPopup} alt="팝업 캐릭터" className={styles.popupImg} onClick={onClickPopup}/>
        </>
    );
}};

export default EventPopupSheet;