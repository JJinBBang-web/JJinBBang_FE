// src/pages/auth/KakaoAuthPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/KakaoAuthPage.module.css';

const KakaoAuthPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 카카오 로그인 성공 처리
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      // 임시로 마이페이지로 리다이렉트
      navigate('/mypage');
    }
  }, [navigate]);

  return (
    <div className="content">
      <div className={styles.loadingContainer}>
        <p>로그인 진행 중입니다...</p>
      </div>
    </div>
  );
};

export default KakaoAuthPage;
