// src/components/auth/KakaoLoginModal.tsx
import React from 'react';
import styles from '../../styles/auth/KakaoLoginModal.module.css';
import kakaoIcon from '../../assets/image/kakaoIcon.svg';

interface KakaoLoginModalProps {
  onClose: () => void;
  onLogin: () => void;
}

const KakaoLoginModal = ({ onClose, onLogin }: KakaoLoginModalProps) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.container}>
        <button className={styles.kakaoButton} onClick={onLogin}>
          <img src={kakaoIcon} alt="kakao" />
          <span>카카오로 시작하기</span>
        </button>
      </div>
    </div>
  );
};

export default KakaoLoginModal;
