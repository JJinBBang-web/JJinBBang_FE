// src/pages/auth/EmailVerificationPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmailVerificationForm from '../../components/auth/verification/EmailVerificationForm';
import styles from '../../styles/auth/EmailVerificationPage.module.css';

const EmailVerificationPage = () => {
  const navigate = useNavigate();

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
        <EmailVerificationForm />
      </div>
    </div>
  );
};

export default EmailVerificationPage;
