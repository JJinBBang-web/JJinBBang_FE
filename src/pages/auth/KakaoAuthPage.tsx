// src/pages/auth/KakaoAuthPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/KakaoAuthPage.module.css';
import TermsAgreementModal from '../../components/auth/TermsAgreementModal';
import SignupCompleteModal from '../../components/auth/SignupCompleteModal';

const KakaoAuthPage: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="content">
      <div className={styles.loadingContainer}>
        <p>로그인 진행 중입니다...</p>
      </div>

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
