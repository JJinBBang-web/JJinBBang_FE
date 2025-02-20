// src/pages/auth/MyAccountPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/MyAccountPage.module.css';
import arrowIcon from '../../assets/image/arrowIcon.svg';

const MyAccountPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="content">
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <img src={arrowIcon} alt="back" className={styles.flippedIcon} />
        </button>
        <h1>내 계정</h1>
      </header>

      <div className={styles.container}>
        <section
          className={styles.verificationSection}
          onClick={() => navigate('/auth/student/new')}
        >
          <h2>신입생 인증</h2>
          <button className={styles.verificationButton}>
            <img src={arrowIcon} alt="forward" />
          </button>
        </section>
        <section
          className={styles.verificationSection}
          onClick={() => navigate('/auth/student/current')}
        >
          <h2>재학생 인증</h2>
          <button className={styles.verificationButton}>
            <img src={arrowIcon} alt="forward" />
          </button>
        </section>
      </div>
    </div>
  );
};

export default MyAccountPage;
