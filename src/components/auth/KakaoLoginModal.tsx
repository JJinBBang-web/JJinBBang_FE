// src/components/auth/KakaoLoginModal.tsx
import React from 'react';
import styles from '../../styles/auth/KakaoLoginModal.module.css';

interface KakaoLoginModalProps {
  onClose: () => void;
  onLogin: () => void;
}

const KakaoLoginModal = ({ onClose, onLogin }: KakaoLoginModalProps) => {
  return (
    <div className={styles.container}>
      <button className={styles.loginButton} onClick={onLogin}>
        <img src="/assets/image/kakaoIcon.svg" alt="kakao" />
        카카오로 시작하기
      </button>
    </div>
  );
};

export default KakaoLoginModal;
