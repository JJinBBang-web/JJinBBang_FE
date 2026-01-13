// src/pages/MyPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authState, AuthState } from '../recoil/auth/atoms';
import { isLoginState } from '../recoil/auth/isLoginState';
import { userApi } from '../api/user';
import { tokenStore } from '../api/api';
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
import PreviewReview from '../util/components/PreviewReview';
import MetaTag from '../util/SEOMetaTag';

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
  const isLogin = useRecoilValue(isLoginState);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    isLoggedIn: false,
    nickname: '익명의 찐빵이',
    school: '찐빵대학교',
    isVerified: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // 유저 정보 조회 함수
  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const response = await userApi.getUserInfo();

      if (response.code === 200) {
        const { email, university, univAuthentication } = response.data;

        // API에서 받은 상태를 영어로 변환
        const apiVerificationStatus =
          univAuthentication === '인증완료'
            ? 'verified'
            : univAuthentication === '대기'
            ? 'pending'
            : 'unverified';

        // 로컬 상태 확인 (사용자가 방금 인증서를 업로드했을 수 있음)
        const localStatus = sessionStorage.getItem('verificationStatus');
        
        // 로컬에 'pending'이 있고 API가 아직 '미인증'을 반환하면 로컬 상태 유지
        const finalVerificationStatus = 
          (localStatus === 'pending' && apiVerificationStatus === 'unverified')
            ? 'pending'
            : apiVerificationStatus;

        setAuth((prev) => ({
          ...prev,
          isAuthenticated: true,
          email: email || undefined,
          verificationStatus: finalVerificationStatus,
        }));

        setUserProfile((prev) => ({
          ...prev,
          isLoggedIn: true,
          school: university || '찐빵대학교',
          isVerified: finalVerificationStatus === 'verified',
        }));

        if (email) sessionStorage.setItem('email', email);
        if (university) sessionStorage.setItem('university', university);
        // sessionStorage 상태도 최종 결정된 상태로 업데이트
        sessionStorage.setItem('verificationStatus', finalVerificationStatus);
      }
    } catch (error: any) {
      console.error('유저 정보 조회 실패:', error);
      if (error.response?.status === 401) {
        tokenStore.clearAccessToken();
        setAuth({
          isAuthenticated: false,
          email: undefined,
          verificationStatus: 'unverified',
          isFirstLogin: false,
        });
        setUserProfile({
          isLoggedIn: false,
          nickname: '익명의 찐빵이',
          school: '찐빵대학교',
          isVerified: false,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 유저 리뷰 조회 함수
  const fetchUserReviews = async () => {
    if (!auth.isAuthenticated) return;

    try {
      setReviewsLoading(true);
      const response = await userApi.getUserReviews({
        offset: 0,
        limit: 20,
        orderby: 'latest',
      });

      if (response.code === 200) {
        setUserReviews(response.data.reviews);
      }
    } catch (error: any) {
      console.error('리뷰 조회 실패:', error);
      // 404 에러는 리뷰가 없는 것으로 처리
      if (error.response?.status === 404) {
        setUserReviews([]);
      }
    } finally {
      setReviewsLoading(false);
    }
  };

  // 메모리에서 인증 상태 복원
  useEffect(() => {
    // 로그인 상태가 false이면 복원하지 않음
    if (!isLogin) {
      // 로그아웃 상태에서는 authState도 확실히 초기화
      if (auth.isAuthenticated) {
        setAuth({
          isAuthenticated: false,
          email: undefined,
          verificationStatus: 'unverified',
          isFirstLogin: false,
        });
      }
      return;
    }

    const accessToken = tokenStore.getAccessToken();
    
    // accessToken이 없으면 복원하지 않음
    if (!accessToken) {
      return;
    }

    const email = sessionStorage.getItem('email');
    const verificationStatus = sessionStorage.getItem('verificationStatus') as
      | 'verified'
      | 'unverified'
      | 'pending';

    if (!auth.isAuthenticated) {
      setAuth({
        isAuthenticated: true,
        email: email || undefined,
        verificationStatus: verificationStatus || 'unverified',
        isFirstLogin: false,
      });
    }
    fetchUserInfo();
  }, [isLogin, auth.isAuthenticated, setAuth]);

  // 인증 상태 변경 시 리뷰 조회
  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchUserReviews();
    }
  }, [auth.isAuthenticated]);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    // 로그인 상태가 false이면 userProfile 초기화
    if (!isLogin) {
      setUserProfile({
        isLoggedIn: false,
        nickname: '익명의 찐빵이',
        school: '찐빵대학교',
        isVerified: false,
      });
      return;
    }

    // 로그인 상태가 true이고 auth.isAuthenticated도 true일 때만 업데이트
    if (auth.isAuthenticated && isLogin) {
      setUserProfile((prev) => ({
        ...prev,
        isLoggedIn: true,
      }));

      if (auth.isFirstLogin) {
        setShowTermsModal(true);
        setAuth((prev: AuthState) => ({
          ...prev,
          isFirstLogin: false,
        }));
      }
    }
  }, [auth, isLogin, setAuth]);

  // isLoginState와 authState 동기화
  useEffect(() => {
    if (!isLogin) {
      // 로그아웃 시 모든 상태 초기화
      tokenStore.clearAccessToken();
      setAuth({
        isAuthenticated: false,
        email: undefined,
        verificationStatus: 'unverified',
        isFirstLogin: false,
      });
      setUserProfile({
        isLoggedIn: false,
        nickname: '익명의 찐빵이',
        school: '찐빵대학교',
        isVerified: false,
      });
      setUserReviews([]);
    }
  }, [isLogin, setAuth]);

  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
  };

  const handleCompleteTerms = () => {
    setShowTermsModal(false);
    setShowSignupCompleteModal(true);
  };

  const handleConfirmSignup = () => {
    setShowSignupCompleteModal(false);
  };

  const handleVerifySchool = () => {
    setShowSignupCompleteModal(false);
    navigate('/auth/student/verify');
  };

  const handleWriteReview = () => {
    if (auth.verificationStatus !== 'verified') {
      alert('찐빵 작성은 학교 인증 후 가능해요!');
      return;
    }
    navigate('/review/type');
  };

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
    if (isLoading) {
      return (
        <div className={`${styles.menuItem} ${styles.profileItem}`}>
          <img src={characterIcon} alt="character" />
          <span>로딩중...</span>
        </div>
      );
    }

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

  const renderReviewSection = () => {
    if (!auth.isAuthenticated) {
      return (
        <div className={styles.emptyState}>
          <img
            src={emptyCharacterIcon}
            className="emptyIcon"
            alt="empty character"
          />
          <p>로그인 후 나의 찐빵을 확인하세요!</p>
        </div>
      );
    }

    if (reviewsLoading) {
      return (
        <div className={styles.emptyState}>
          <p>리뷰를 불러오는 중...</p>
        </div>
      );
    }

    if (userReviews.length === 0) {
      return (
        <div className={styles.emptyState}>
          <img
            src={emptyCharacterIcon}
            className="emptyIcon"
            alt="empty character"
          />
          <p>앗! 아직 등록된 찐빵이 없어요!</p>
        </div>
      );
    }

    return (
      <div className={styles.reviewList}>
        {userReviews.map((review) => (
          <div key={review.id}>
            <div className={styles.line} />
            <PreviewReview review={review} trackStep="4.1_mypage_PreviewReview" />
          </div>
          // <div key={review.id} className={styles.reviewItem}>
          //   <h3>{review.title || review.buildingName || '제목 없음'}</h3>
          //   <p>{review.content}</p>
          //   <div className={styles.reviewMeta}>
          //     <span>평점: {review.rating}/5</span>
          //     <span>{new Date(review.createdAt).toLocaleDateString()}</span>
          //   </div>
          // </div>
        ))}
      </div>
    );
  };

  const pageStyle = {
    position: 'relative' as const,
    minHeight: '100vh',
  };

  return (
    <>
    <MetaTag
        title="찐빵 | 마이페이지"
        description="내가 남긴 후기, 관심 등록을 한눈에 관리하세요"
        keywords="찐빵, 원룸, 자취방, 기숙사, 리뷰, 대학가, 부동산, 가입, 로그인, 후기, 자취, 추천"
        imgsrc="https://jjinbbang.kr/seo/thumbnail.png"
        url="https://jjinbbang.kr/mypage"
    />
    <div style={pageStyle}>
      <div className="content">
        <h1 className={styles.title}>나의 찐빵</h1>
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
              className={`${styles.menuItem} ${styles.writeItem} ${
                auth.verificationStatus !== 'verified' ? styles.disabled : ''
              }`}
              onClick={handleWriteReview}
              id="btn-write-review"
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
            {auth.isAuthenticated && userReviews.length > 0 && (
              <div className={styles.divider} />
            )}
            {renderReviewSection()}
          </div>
        </div>
      </div>

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
    </>
  );
};

export default MyPage;
