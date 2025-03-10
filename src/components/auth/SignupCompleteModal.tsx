// src/components/auth/SignupCompleteModal.tsx
import React from 'react';
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
  return (
    <div className={styles.overlay}>
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
    </div>
  );
};

export default SignupCompleteModal;
