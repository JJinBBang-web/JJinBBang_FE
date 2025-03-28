// src/components/auth/SignupCompleteModal.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/auth/SignupCompleteModal.module.css';
import checkIconActive from '../../assets/image/checkIconActive.svg';

interface SignupCompleteModalProps {
  onConfirm: () => void;
  onVerify: () => void;
}

const SignupCompleteModal: React.FC<SignupCompleteModalProps> = ({
  onConfirm,
  onVerify,
}) => {
  // 오버레이 클릭 시 모달 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onConfirm();
    }
  };

  // 포털을 통해 body에 직접 렌더링
  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <img src={checkIconActive} alt="complete" className={styles.icon} />
        <h2>회원 가입 완료</h2>
        <p>
          학교 인증을 통해
          <br />
          모든 기능을 무료로 즐겨보세요!
        </p>
        <div className={styles.buttonGroup}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            확인
          </button>
          <button onClick={onVerify} className={styles.verifyButton}>
            학교 인증하기
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SignupCompleteModal;
