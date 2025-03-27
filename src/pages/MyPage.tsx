// src/pages/MyPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from '../recoil/auth/atoms';
import styles from '../styles/MyPage.module.css';
import questionIcon from '../assets/image/questionIcon.svg';
import arrowIcon from '../assets/image/arrowIcon.svg';
import characterIcon from '../assets/image/characterIcon.svg';
import pencilIcon from '../assets/image/pencilIcon.svg';
import emptyCharacterIcon from '../assets/image/emptyCharacterIcon.svg';
import verifiedCharacterIcon from '../assets/image/verifiedCharacterIcon.svg';
import profileIcon from '../assets/image/profileIcon.svg';
import KakaoLoginModal from '../components/auth/KakaoLoginModal';

interface UserProfile {
  isLoggedIn: boolean;
  nickname: string;
  school: string;
  isVerified: boolean;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [auth, setAuth] = useRecoilState(authState);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    isLoggedIn: false, // Changed to false by default
    nickname: '익명의 찐빵이',
    school: '찐빵대학교',
    isVerified: false,
  });

  // Check login status on component mount
  useEffect(() => {
    // Check if user is logged in based on auth state
    const checkLoginStatus = () => {
      // Use isAuthenticated property from AuthState
      if (auth.isAuthenticated) {
        setUserProfile((prev) => ({
          ...prev,
          isLoggedIn: true,
        }));
      }
    };

    checkLoginStatus();
  }, [auth]);

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

  const renderProfileSection = () => {
    if (!userProfile.isLoggedIn) {
      return (
        <button
          className={`${styles.menuItem} ${styles.profileItem}`}
          onClick={() => setShowLoginModal(true)}
        >
          <img src={characterIcon} alt="character" />
          <span>로그인을 해주세요</span>
          <img src={arrowIcon} alt="arrow" />
        </button>
      );
    }

    // 이메일 인증 완료 시 닉네임 대신 이메일 표시
    const displayName =
      auth.verificationStatus === 'verified' && auth.email
        ? auth.email
        : userProfile.nickname;

    return (
      <button
        className={`${styles.menuItem} ${styles.profileItem}`}
        onClick={() => navigate('/myaccount')}
      >
        <img src={profileIcon} alt="profile" className={styles.profileIcon} />
        <div className={styles.profileInfo}>
          <span className={styles.nickname}>{displayName}</span>
          <div className={styles.schoolInfo}>
            <span className={styles.schoolName}>{userProfile.school}</span>
            <span
              className={`${styles.verificationStatus} ${
                auth.verificationStatus === 'verified'
                  ? styles.verified
                  : auth.verificationStatus === 'pending'
                  ? styles.pending
                  : ''
              }`}
            >
              {getVerificationStatus()}
            </span>
          </div>
        </div>
        <img src={arrowIcon} alt="arrow" />
      </button>
    );
  };

  return (
    <div className="content">
      <h1 className={styles.title}>나의 찐빵</h1>
      {/* 인증 완료 상태에서는 가이드 div를 표시하지 않음 */}
      {auth.verificationStatus !== 'verified' && (
        <div className={styles.guide}>
          <img src={questionIcon} alt="question" className={styles.guideIcon} />
          <p>학교 인증을 통해 모든 기능을 무료로 즐겨보세요!</p>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.menuList}>
          {renderProfileSection()}
          <button
            className={`${styles.menuItem} ${styles.writeItem}`}
            onClick={() => navigate('/review/type')}
          >
            <img src={pencilIcon} alt="pencil" className={styles.pencilIcon} />
            <div className={styles.menuReview}>
              <span className={styles.menuTitle}>찐빵 작성하기</span>
              <span className={styles.menuDescription}>
                찐심이 담긴 실거주 후기를 공유해주세요!
              </span>
            </div>
            <img src={arrowIcon} alt="arrow" />
          </button>
        </div>
        <div className={styles.reviewContainer}>
          <h2>나의 찐빵</h2>
          <div className={styles.emptyState}>
            <img
              src={emptyCharacterIcon}
              className="emptyIcon"
              alt="empty character"
            />
            <p>앗! 아직 등록된 찐빵이 없어요!</p>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <KakaoLoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default MyPage;
