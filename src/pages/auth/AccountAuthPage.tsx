// src/pages/auth/AccountAuthPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState, AuthState } from '../../recoil/auth/atoms';
import { authApi } from '../../api/auth';
import styles from '../../styles/auth/AccountAuthPage.module.css';
import questionIcon from '../../assets/image/questionIcon.svg';
import arrowIcon from '../../assets/image/arrowIcon.svg';
import LeaveServiceModal1 from '../../components/auth/LeaveServiceModal1';
import LeaveServiceModal2 from '../../components/auth/LeaveServiceModal2';


const AccountAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useRecoilState<AuthState>(authState);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

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

  const handleDeleteAccount = () => {
    setShowModal1(true);
  };

  const handleModal1Leave = () => {
    setShowModal1(false);
    setShowModal2(true);
  };

  const handleModal1Close = () => {
    setShowModal1(false);
  };

  const handleModal2Confirm = async () => {
    try {
      setIsDeleting(true);
      setShowModal2(false);

      // API 호출 (authApi.deleteUser 사용)
      const responseData = await authApi.deleteUser();

      // 성공 시 상태 초기화 및 이동
      if (responseData.code === 200) {
        setAuth({
          isAuthenticated: false,
          email: undefined,
          verificationStatus: 'unverified',
          isFirstLogin: false,
        });

        alert(responseData.message);
        navigate('/');
      }
    } catch (error: any) {
      console.error('탈퇴 실패:', error);
      alert(error.message || '탈퇴 처리 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Recoil 상태 초기화
      setAuth({
        isAuthenticated: false,
        email: undefined,
        verificationStatus: 'unverified',
        isFirstLogin: false,
      });

      // 로컬 스토리지 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('signupToken');

      // MyPage로 이동
      navigate('/mypage');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setIsLoggingOut(false);
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

        <button
          className={styles.serviceButton}
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          style={{
            opacity: isDeleting ? 0.6 : 1,
            cursor: isDeleting ? 'not-allowed' : 'pointer',
          }}
        >
          <span>{isDeleting ? '탈퇴 처리중...' : '서비스 탈퇴'}</span>
          <img src={arrowIcon} alt="forward" />
        </button>

        <button
          className={styles.logoutButton}
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{
            opacity: isLoggingOut ? 0.6 : 1,
            cursor: isLoggingOut ? 'not-allowed' : 'pointer',
          }}
        >
          <span>{isLoggingOut ? '로그아웃 중...' : '로그아웃'}</span>
        </button>
      </div>

      {/* Leave Service Modals */}
      <LeaveServiceModal1
        isOpen={showModal1}
        onClose={handleModal1Close}
        onLeave={handleModal1Leave}
      />
      <LeaveServiceModal2
        isOpen={showModal2}
        onConfirm={handleModal2Confirm}
        onClose={() => setShowModal2(false)}
      />
    </div>
  );
};

export default AccountAuthPage;
