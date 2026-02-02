import styles from './Popup.module.css';
import { useEffect, useState } from "react";
import reviewEventPopup from "../../assets/image/content/banner/ReviewEventPopup.png"
import closeIcon from "../../assets/image/iconClose.svg";
import { useLocation, useNavigate } from 'react-router-dom';

const STORAGE_KEY = "review_event_popup_hidden_until";
const HIDE_MS = 24 * 60 * 60 * 1000; // 24시간
// const HIDE_MS = 30 * 100;

const EventPopupSheet = () => { {
    const navigation = useNavigate();
    const location = useLocation();
    const [isOpenPopup, setIsOpenPopup] = useState(true);

    useEffect(() => {
        if (location.pathname !== "/") {
            setIsOpenPopup(false);
            return;
        }

        const hiddenUntil = Number(sessionStorage.getItem(STORAGE_KEY) || "0");
        const now = Date.now();

        // 아직 숨김 기간이면 닫힌 상태 유지
        if (now < hiddenUntil) {
            setIsOpenPopup(false);
            return;
        }

        // 숨김 기간이 아니면 오픈
        setIsOpenPopup(true);
    }, [location.pathname]);

    const hideForSession = () => {
        // 세션 동안(또는 원하는 시간 동안) 다시 안 뜨게
        const hiddenUntil = Date.now() + HIDE_MS;
        sessionStorage.setItem(STORAGE_KEY, String(hiddenUntil));
        setIsOpenPopup(false);
    };

    const onClickPopup = () => {
        hideForSession();
        navigation('/event/review/write');
    }

    if (!isOpenPopup) return null;
    
    return (
        <>
        <div className={styles.overlay} onClick={hideForSession}/>
        <div className={styles.wrap}>
            <img src={closeIcon} alt='끄기' className={styles.icon} onClick={hideForSession}/>
            <img src={reviewEventPopup} alt="팝업 캐릭터" className={styles.popupImg} onClick={onClickPopup}/>
        </div>
        </>
    );
}};

export default EventPopupSheet;