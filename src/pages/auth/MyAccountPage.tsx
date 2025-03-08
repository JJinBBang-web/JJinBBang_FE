// src/pages/auth/MyAccountPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from '../../recoil/auth/atoms';
import styles from '../../styles/auth/MyAccountPage.module.css';
import questionIcon from '../../assets/image/questionIcon.svg';
import arrowIcon from '../../assets/image/arrowIcon.svg';

const MyAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [auth] = useRecoilState(authState);

  return (
    <div className="content">
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <img src={arrowIcon} alt="back" className={styles.flippedIcon} />
        </button>
        <h1>내 계정</h1>
      </header>

      <div className={styles.container}>
        {/* 인증 완료 상태에서는 가이드 div를 표시하지 않음 */}
        {auth.verificationStatus !== 'verified' && (
          <div className={styles.guide}>
            <img
              src={questionIcon}
              alt="question"
              className={styles.guideIcon}
            />
            <p>학교 인증을 통해 모든 기능을 무료로 즐겨보세요!</p>
          </div>
        )}
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
