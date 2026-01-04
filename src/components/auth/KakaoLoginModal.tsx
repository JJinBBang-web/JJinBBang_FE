// src/components/auth/KakaoLoginModal.tsx
import React from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../../recoil/auth/atoms';
import { authApi } from '../../api/auth';
import styles from '../../styles/auth/KakaoLoginModal.module.css';
import kakaoIcon from '../../assets/image/kakaoIcon.svg';

interface KakaoLoginModalProps {
  onClose: () => void;
}

const KakaoLoginModal = ({ onClose }: KakaoLoginModalProps) => {
  const [_, setAuth] = useRecoilState(authState);

  // 오버레이 클릭 시 모달 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKakaoLogin = () => {
    // 로그인 결과를 받을 URL (base64 인코딩은 authApi에서 처리)
    const redirectUrl = `${window.location.origin}/login/result`;
    // 백엔드 소셜 로그인 API 호출
    authApi.startSocialLogin('kakao', redirectUrl);
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
