// src/pages/auth/AccountAuthPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState, AuthState } from '../../recoil/auth/atoms';
import { api } from '../../api/api';
import styles from '../../styles/auth/AccountAuthPage.module.css';
import questionIcon from '../../assets/image/questionIcon.svg';
import arrowIcon from '../../assets/image/arrowIcon.svg';

interface UserDeleteResponse {
  success: boolean;
  message?: string;
  token?: string; // BearerToken이 포함될 수 있는 응답
}

const AccountAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useRecoilState<AuthState>(authState);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteAccount = async () => {
    // 1단계: 사용자 확인
    const isConfirmed = window.confirm(
      '정말로 탈퇴하시겠습니까?\n탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.'
    );

    if (!isConfirmed) {
      return;
    }

    try {
      // 2단계: 로딩 상태 시작
      setIsDeleting(true);

      // 3단계: API 호출 (실제 프로젝트 API 패턴 사용)
      const response = await api.delete('/api/v1/auth/user', { useAuth: true });
      const responseData = response.data as UserDeleteResponse;

      // 4단계: BearerToken 응답 처리
      if (responseData.token) {
        console.log('받은 토큰:', responseData.token);
        // 필요하다면 토큰을 임시로 처리
        // localStorage.setItem('tempToken', responseData.token);
      }

      // 5단계: Recoil 상태 초기화 (실제 AuthState 타입에 맞게)
      setAuth({
        isAuthenticated: false,
        email: undefined,
        verificationStatus: 'unverified',
        isFirstLogin: false,
      });

      // 6단계: 로컬 스토리지 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('signupToken');

      // 7단계: 성공 메시지 및 이동
      alert('탈퇴가 완료되었습니다.');
      navigate('/');
    } catch (error: any) {
      // 8단계: 에러 처리
      console.error('탈퇴 실패:', error);

      let errorMessage = '탈퇴 처리 중 오류가 발생했습니다.';

      if (error.response) {
        // API 에러 응답이 있는 경우
        switch (error.response.status) {
          case 401:
            errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.';
            break;
          case 403:
            errorMessage = '탈퇴 권한이 없습니다.';
            break;
          case 500:
            errorMessage =
              '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }

      alert(errorMessage);
    } finally {
      // 9단계: 로딩 상태 종료
      setIsDeleting(false);
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
      </div>
    </div>
  );
};

export default AccountAuthPage;
