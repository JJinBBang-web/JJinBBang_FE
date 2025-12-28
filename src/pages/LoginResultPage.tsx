// src/pages/LoginResultPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isLoginState } from '../recoil/auth/isLoginState';
import { authApi } from '../api/auth';
import { api, tokenStore } from '../api/api';
import TermsAgreementModal from '../components/auth/TermsAgreementModal';
import SignupCompleteModal from '../components/auth/SignupCompleteModal';

type LoginStatus = 'oauth_failed' | 'terms_pending' | 'success';

function LoginResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [, setIsLoggedIn] = useRecoilState(isLoginState);
  const [showTerms, setShowTerms] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const handleLoginResult = async () => {
      const status = searchParams.get('status') as LoginStatus | null;

      if (!status) {
        console.error('로그인 결과 status가 없습니다.');
        setIsLoading(false);
        navigate('/mypage');
        return;
      }

      try {
        switch (status) {
          case 'oauth_failed':
            // 소셜 로그인 실패
            console.error('소셜 로그인에 실패했습니다.');
            setIsLoading(false);
            navigate('/mypage');
            break;

          case 'terms_pending':
            // 약관 동의 필요 (약관동의 쿠키는 이미 발급됨)
            setIsLoading(false);
            setShowTerms(true);
            // 이메일 정보가 있다면 저장 (백엔드에서 전달되는 경우)
            const email = searchParams.get('email');
            if (email) {
              setUserEmail(email);
            }
            break;

          case 'success':
            // 소셜 로그인 성공 (리프레시 쿠키는 이미 발급됨)
            // 메모리에 액세스 토큰이 없으면 재발급받기
            const existingAccessToken = tokenStore.getAccessToken();
            if (!existingAccessToken) {
              try {
                await authApi.refreshAccessToken();
              } catch (error) {
                console.error('토큰 갱신 실패:', error);
              }
            }
            setIsLoggedIn(true);
            setIsLoading(false);
            navigate('/mypage');
            break;

          default:
            console.error('알 수 없는 로그인 상태:', status);
            setIsLoading(false);
            navigate('/mypage');
        }
      } catch (error) {
        console.error('로그인 결과 처리 중 에러:', error);
        setIsLoading(false);
        navigate('/mypage');
      }
    };

    handleLoginResult();
  }, [searchParams, navigate, setIsLoggedIn]);

  // 약관 동의 모달 닫기 (로그인 취소)
  const handleTermsClose = async () => {
    setShowTerms(false);
    navigate('/mypage');
  };

  // 약관 동의 완료
  const handleTermsComplete = async () => {
    try {
      // 약관 동의 API 호출 (쿠키에 약관동의 토큰이 포함되어 있음)
      // api 인스턴스 사용 (프록시 활용, 쿠키 자동 전송)
      const response = await api.post('/api/v1/auth/signup', {}, {
        useAuth: false, // 약관동의 토큰은 쿠키에 있으므로 별도 헤더 불필요
      });

      const result = response.data;

      if (result.code === 200) {
        // 약관 동의 성공 후 액세스 토큰 받기
        try {
          await authApi.refreshAccessToken();
          
          // 사용자 정보 저장
          if (userEmail) {
            sessionStorage.setItem('email', userEmail);
          }
          sessionStorage.setItem('verificationStatus', 'unverified');
          setIsLoggedIn(true);
          setShowTerms(false);
          setShowComplete(true);
        } catch (error) {
          console.error('토큰 갱신 실패:', error);
          await handleTermsClose();
        }
      } else {
        console.error('약관 동의 실패:', result.message);
        await handleTermsClose();
      }
    } catch (err) {
      console.error('약관 동의 요청 중 에러:', err);
      await handleTermsClose();
    }
  };

  // 가입 완료 모달 확인
  const handleSignupConfirm = () => {
    setShowComplete(false);
    navigate('/mypage');
  };

  // 가입 완료 모달 인증하기
  const handleSignupVerify = () => {
    setShowComplete(false);
    navigate('/auth/student/verify');
  };

  if (isLoading) {
    return (
      <div className="content">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            gap: '16px',
          }}
        >
          <img
            src="/assets/image/loading.gif"
            alt="loading"
            style={{ width: '48px', height: '48px' }}
          />
          <p>로그인 처리 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div style={{ height: '100vh', background: '#f5f5f5' }}>{/* 배경 */}</div>

      {/* 약관 동의 모달 */}
      {showTerms && (
        <TermsAgreementModal
          onClose={handleTermsClose}
          onComplete={handleTermsComplete}
        />
      )}

      {/* 가입 완료 모달 */}
      {showComplete && (
        <SignupCompleteModal
          onConfirm={handleSignupConfirm}
          onVerify={handleSignupVerify}
        />
      )}
    </div>
  );
}

export default LoginResultPage;

