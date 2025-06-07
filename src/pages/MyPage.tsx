// src/pages/MyPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState, AuthState } from '../recoil/auth/atoms';
import styles from '../styles/MyPage.module.css';
import questionIcon from '../assets/image/questionIcon.svg';
import arrowIcon from '../assets/image/arrowIcon.svg';
import characterIcon from '../assets/image/characterIcon.svg';
import pencilIcon from '../assets/image/pencilIcon.svg';
import emptyCharacterIcon from '../assets/image/emptyCharacterIcon.svg';
import profileIcon from '../assets/image/profileIcon.svg';
import KakaoLoginModal from '../components/auth/KakaoLoginModal';
import TermsAgreementModal from '../components/auth/TermsAgreementModal';
import SignupCompleteModal from '../components/auth/SignupCompleteModal';

interface UserProfile {
  isLoggedIn: boolean;
  nickname: string;
  school: string;
  isVerified: boolean;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSignupCompleteModal, setShowSignupCompleteModal] = useState(false);
  const [auth, setAuth] = useRecoilState<AuthState>(authState);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    isLoggedIn: false,
    nickname: '익명의 찐빵이',
    school: '찐빵대학교',
    isVerified: false,
  });

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    if (auth.isAuthenticated) {
      setUserProfile((prev) => ({
        ...prev,
        isLoggedIn: true,
      }));

      // 첫 로그인인 경우 약관 동의 모달 표시
      if (auth.isFirstLogin) {
        setShowTermsModal(true);

        // 첫 로그인 플래그 초기화 (필요한 경우)
        setAuth((prev: AuthState) => ({
          ...prev,
          isFirstLogin: false,
        }));
      }
    }
  }, [auth, setAuth]);

  // 약관 동의 모달 닫기 핸들러
  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
  };

  // 약관 동의 완료 핸들러
  const handleCompleteTerms = () => {
    setShowTermsModal(false);
    setShowSignupCompleteModal(true); // 약관 동의 완료 후 회원가입 완료 모달 표시
  };

  // 회원가입 확인 버튼 핸들러
  const handleConfirmSignup = () => {
    setShowSignupCompleteModal(false);
  };

  // 학교 인증 버튼 핸들러
  const handleVerifySchool = () => {
    setShowSignupCompleteModal(false);
    // 학교 인증 페이지로 이동하거나 인증 모달 열기
    // 예: navigate('/verify-school');
  };

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

  // 모달 관련 스타일 - 배경이 보이도록 함
  const pageStyle = {
    position: 'relative' as const,
    minHeight: '100vh',
  };

  return (
    <div style={pageStyle}>
      <div className="content">
        <h1 className={styles.title}>나의 찐빵</h1>
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
        <div className={styles.container}>
          <div className={styles.menuList}>
            {renderProfileSection()}
            <button
              className={`${styles.menuItem} ${styles.writeItem}`}
              onClick={() => navigate('/review/type')}
            >
              <img
                src={pencilIcon}
                alt="pencil"
                className={styles.pencilIcon}
              />
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
      </div>

      {/* 모달 컴포넌트들 - 배경이 보이도록*/}
      {showLoginModal && (
        <KakaoLoginModal onClose={() => setShowLoginModal(false)} />
      )}
      {showTermsModal && (
        <TermsAgreementModal
          onClose={handleCloseTermsModal}
          onComplete={handleCompleteTerms}
        />
      )}
      {showSignupCompleteModal && (
        <SignupCompleteModal
          onConfirm={handleConfirmSignup}
          onVerify={handleVerifySchool}
        />
      )}
    </div>
  );
};

export default MyPage;
