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

        <button
          className={styles.profileButton}
          onClick={() => navigate('/auth/student/verify')}
        >
          <div className={styles.profileInfo}>
            <h2>내 계정</h2>
            <div className={styles.profile}>
              <span>익명의 찐빵이</span>
              <span className={styles.status}>미인증</span>
            </div>
          </div>
          <img src={arrowIcon} alt="forward" />
        </button>

        <button className={styles.serviceButton}>
          <span>서비스 탈퇴</span>
          <img src={arrowIcon} alt="forward" />
        </button>
      </div>
    </div>
  );
};

export default AccountAuthPage;
