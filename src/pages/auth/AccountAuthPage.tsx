// src/pages/auth/AccountAuthPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/AccountAuthPage.module.css';
import questionIcon from '../../assets/image/questionIcon.svg';
import arrowIcon from '../../assets/image/arrowIcon.svg';

const AccountAuthPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="content">
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <img src={arrowIcon} alt="back" />
        </button>
        <h1>내 계정</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.banner}>
          <img src={questionIcon} alt="question" />
          <p>학교 인증을 통해 모든 기능을 무료로 즐겨보세요!</p>
        </div>

        <div className={styles.authOptions}>
          <button
            className={styles.authButton}
            onClick={() => navigate('/auth/student/new')}
          >
            <span className={styles.buttonText}>신입생 인증</span>
            <img src={arrowIcon} alt="forward" />
          </button>

          <button
            className={styles.authButton}
            onClick={() => navigate('/auth/student/current')}
          >
            <span className={styles.buttonText}>재학생 인증</span>
            <img src={arrowIcon} alt="forward" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountAuthPage;
