// src/pages/auth/EmailVerificationPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmailVerificationForm from '../../components/auth/verification/EmailVerificationForm';
import styles from '../../styles/auth/EmailVerificationPage.module.css';

const EmailVerificationPage = () => {
  const navigate = useNavigate();

  const handleVerification = async (email: string, code: string) => {
    try {
      // 추후 API 연동 예정
      console.log('Verification attempt with:', { email, code });
      navigate('/auth/signup');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <img
            src="/icons/back-arrow.svg"
            alt="뒤로가기"
            className={styles.backIcon}
          />
        </button>
      </div>
      <div className={styles.content}>
        <EmailVerificationForm onSubmit={handleVerification} />
      </div>
    </div>
  );
};

export default EmailVerificationPage;
