// src/pages/auth/KakaoAuthPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from '../../recoil/auth/atoms';
import MyPage from '../MyPage'; // 마이페이지 컴포넌트 임포트
import styles from '../../styles/auth/KakaoAuthPage.module.css';
import TermsAgreementModal from '../../components/auth/TermsAgreementModal';
import SignupCompleteModal from '../../components/auth/SignupCompleteModal';

const KakaoAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [_, setAuth] = useRecoilState(authState);
  const [showTerms, setShowTerms] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      setShowTerms(true);
    }
  }, []);

  const handleTermsClose = () => {
    setShowTerms(false);
    navigate('/mypage');
  };

  const handleTermsComplete = () => {
    setShowTerms(false);
    setShowComplete(true);
  };

  const handleConfirm = () => {
    navigate('/mypage');
  };

  const handleVerify = () => {
    navigate('/myaccount');
  };

  return (
    <div className={styles.pageContainer}>
      {/* 배경으로 마이페이지 컴포넌트 렌더링 */}
      <div className={styles.backgroundPage}>
        <MyPage />
      </div>

      {/* 모달 표시 */}
      {showTerms && (
        <TermsAgreementModal
          onClose={handleTermsClose}
          onComplete={handleTermsComplete}
        />
      )}

      {showComplete && (
        <SignupCompleteModal
          onConfirm={handleConfirm}
          onVerify={handleVerify}
        />
      )}
    </div>
  );
};

export default KakaoAuthPage;
