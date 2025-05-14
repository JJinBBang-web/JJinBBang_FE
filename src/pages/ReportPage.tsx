import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ReportPage.module.css"
import closeIcon from '../assets/image/iconClose.svg';
import { useLayoutEffect, useRef, useState } from "react";
import Modal from "../components/review/Modal";
import reportModalIcon from "../assets/image/ReportModalIcon.svg"
import verifyCompleteIcon from "../assets/image/verifyCompleteIcon.svg"

const AutoHeightTextarea: React.FC<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    maxLength: number;
  }> = ({ value, onChange, placeholder, maxLength }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
  
    const formattedPlaceholder =
    '신고하신 내용은 운영팀이 직접 확인하고 조치해요\n자세히 작성해 주실수록 빠른 대응이 가능해요!\n\nex)  광고/홍보 같아요, 개인정보가 포함돼 있어요';
  
    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.style.height = 'inherit';
      const computedHeight = Math.max(150, textarea.scrollHeight);
      textarea.style.height = `${computedHeight}px`;
    };
  
    useLayoutEffect(() => {
      adjustHeight();
    }, [value]);
  
    return (
      <textarea
        ref={textareaRef}
        className={styles.contentTextarea}
        value={value}
        onChange={onChange}
        placeholder={formattedPlaceholder}
        maxLength={maxLength}
        autoFocus
      />
    );
  };
  
const ReportPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false)
    const [isReported, setIsReported] = useState(false)
    const [content, setContent] = useState('');

    const maxLength = 1000;
      
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= maxLength) {
          setContent(e.target.value);
        }
      };
      
      const handleButtonClick = () => {
        navigate('/building/rv', { state: location.state });
      };

    return (
        <div className="content">
            <div className={styles.container}>
                <header className={styles.header}>
                <div className={styles.progressBar}></div>
                <button
                    className={styles.closeButton}
                    onClick={handleButtonClick}
                >
                    <img src={closeIcon} alt="close" />
                </button>
                <h1 className={styles.title}>더 나은 서비스 운영을 위해<br/>신고 사유를 적어주세요!</h1>
                </header>
                <div className={styles.textareaContainer}>
                    <AutoHeightTextarea
                        value={content}
                        onChange={handleContentChange}
                        placeholder=""
                        maxLength={maxLength}
                    />
                    <div className={styles.charCount}>
                        <span>{content.length}</span>
                        <span>/{maxLength}</span>
                    </div>
                </div>
            </div>
            <footer className={styles.footer}>
                <button
                className={`${styles.nextButton} ${
                    content.trim().length > 0 ? styles.enabled : ''
                }`}
                onClick={()=> setIsOpen(true)}
                disabled={content.trim().length === 0}
                >
                확인
                </button>
            </footer>
            
            {isOpen && (
                <Modal onClose={() => {setIsOpen(false); setIsReported(false)}}>
                    <>
                    {
                        isReported ? (
                            <>
                                <div className={styles.sheet_header}>
                                    <div className={styles.header_divider}></div>
                                </div>
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
                                    <button className={styles.confirmBtn} onClick={()=> {setIsOpen(false); handleButtonClick()}}>확인</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.sheet_header}>
                                    <div className={styles.header_divider}></div>
                                </div>
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
        </div>
    )
}

export default ReportPage;