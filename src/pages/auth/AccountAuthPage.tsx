// src/pages/auth/AccountAuthPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState, AuthState } from '../../recoil/auth/atoms';
import styles from '../../styles/auth/AccountAuthPage.module.css';
import questionIcon from '../../assets/image/questionIcon.svg';
import arrowIcon from '../../assets/image/arrowIcon.svg';

const AccountAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [auth] = useRecoilState<AuthState>(authState);

  // 인증 상태에 따른 텍스트 표시
  const getVerificationStatus = () => {
    switch (auth.verificationStatus) {
      case 'verified':
        return '인증 완료';
      case 'pending':
        return '인증 대기중';
      default:
        return '미인증';
    }
  };

  // 인증 상태에 따른 클래스 이름 반환
  const getStatusClassName = () => {
    switch (auth.verificationStatus) {
      case 'verified':
        return `${styles.status} ${styles.verified}`;
      case 'pending':
        return `${styles.status} ${styles.pending}`;
      default:
        return styles.status;
    }
  };

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
        <button
          className={styles.profileButton}
          onClick={() => navigate('/auth/student/verify')}
        >
          <div className={styles.profileInfo}>
            <p>내 계정</p>
            <div className={styles.profile}>
              <p>익명의 찐빵이</p>
              <span className={getStatusClassName()}>
                {getVerificationStatus()}
              </span>
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
