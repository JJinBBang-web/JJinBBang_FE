// src/components/auth/KakaoLoginModal.tsx
import React from 'react';
import styles from '../../styles/auth/KakaoLoginModal.module.css';
import kakaoIcon from '../../assets/image/kakaoIcon.svg';
import { KAKAO_AUTH_URL } from '../../util/kakaoAuth';

interface KakaoLoginModalProps {
  onClose: () => void;
}

const KakaoLoginModal = ({ onClose }: KakaoLoginModalProps) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.container}>
        <div className={styles.modalHandle}></div>
        <button className={styles.kakaoButton} onClick={handleKakaoLogin}>
          <img src={kakaoIcon} alt="kakao" />
          <span>카카오로 로그인</span>
        </button>
      </div>
    </div>
  );
};

export default KakaoLoginModal;
