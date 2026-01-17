import styles from './Popup.module.css';
import iconClose from "../../assets/image/iconClose.svg"
import characterIcon from "../../assets/image/emptyCharacterIcon.svg"
import { useEffect, useState } from "react";

const STORAGE_KEY = "home_popup_hidden_until";
const HIDE_MS = 24 * 60 * 60 * 1000; // 24시간
// const HIDE_MS = 30 * 1000;

const PopupSheet = () => { {
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

    if (!isOpenPopup) return null;
    
    return (
        <>
        <div className={styles.overlay} onClick={closeModal}/>
        <div className={styles.sheet}>
            <div className={styles.sheet_title_wrap}>
                <img src={iconClose} width="24px" onClick={closeModal} role="button" alt='close'/>
            </div>
            <div className={styles.sheet_content}>
                <div className={styles.sheet_text_wrap}>
                    <p className={styles.sheet_text_title}>1월 8일~16일 신입생 인증 재요청</p>
                    <p className={styles.sheet_text_body}>서버 오류로 해당 기간 인증 내역이 유실되었습니다.<br/>대상자분들은 다시 한번 인증 부탁드립니다.<br/>불편을 드려 정말 죄송합니다</p>
                </div>
                <img src={characterIcon} width="180px"alt='character'/>
            </div>
            <p className={styles.info}>확인이나 X를 누르시면 24시간동안 팝업이 보이지 않습니다.</p>
            <button className={styles.sheet_button} onClick={closeModal}>확인</button>
        </div>
        </>
    );
}};

export default PopupSheet;