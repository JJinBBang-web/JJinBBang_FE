// src/components/auth/KakaoLoginModal.tsx
import React from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../../recoil/auth/atoms';
import styles from '../../styles/auth/KakaoLoginModal.module.css';
import kakaoIcon from '../../assets/image/kakaoIcon.svg';
import { KAKAO_AUTH_URL } from '../../util/kakaoAuth';

interface KakaoLoginModalProps {
  onClose: () => void;
}

const KakaoLoginModal = ({ onClose }: KakaoLoginModalProps) => {
  const [_, setAuth] = useRecoilState(authState);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKakaoLogin = () => {
    // 로그인 성공 후 리다이렉트 시 처리를 위해
    // 로컬 스토리지에 firstLogin 플래그 저장
    localStorage.setItem('isFirstLogin', 'true');

    // 카카오 로그인 페이지로 이동
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
