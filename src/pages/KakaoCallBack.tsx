// src/components/KakaoCallback.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { isLoginState } from '../recoil/auth/isLoginState';
import { useRecoilState } from 'recoil';
import TermsAgreementModal from '../components/auth/TermsAgreementModal';
import SignupCompleteModal from '../components/auth/SignupCompleteModal';

const url = process.env.REACT_APP_API_URL;
export const getSignupToken = () => localStorage.getItem('signupToken');
export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const setSignupToken = (signupToken: string) => {
  localStorage.setItem('signupToken', signupToken);
};

export const setTokens = ({ accessToken, refreshToken }: Tokens) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const kakaoLogin = async (authCode: string) => {
  const response = await fetch(url + '/api/v1/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      oauthProvider: 'kakao',
      oauthCode: authCode,
    }),
  });
  return response.json();
};

const kakaoLogout = async () => {
  try {
    // 브라우저에서 카카오 관련 쿠키나 세션 정리
    console.log('카카오 로그아웃 처리');
  } catch (error) {
    console.error('카카오 로그아웃 중 오류:', error);
  }
};

export const agreeToTerms = async () => {
  console.log('SignupToken:', getSignupToken());
  const response = await fetch(url + '/api/v1/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getSignupToken()}`,
    },
    body: null,
  });
  return response.json();
};

export const getUserInfo = async () => {
  const response = await fetch(url + '/api/v1/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.json();
};

/**
 * 카카오 로그인 후, 리다이렉트되는 페이지
 * URL 예: http://localhost:3000/kakao/callback?code=xxxx
 */
function KakaoCallback1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setIsLoggedIn] = useRecoilState(isLoginState);
  const [showTerms, setShowTerms] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const handleLogin = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      console.log('인가 코드:', code);

      if (code) {
        try {
          const response = await kakaoLogin(code);
          console.log('백엔드 응답:', response);

          if (response.data.accessToken) {
            console.log('로그인 성공, 토큰 저장 완료');
            setTokens({
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            });
            setIsLoading(false);
            setIsLoggedIn(true);
            navigate('/mypage');
          } else if (response.data.signupToken) {
            console.log('✅ 신규 사용자 감지 - 약관 동의 필요');
            setSignupToken(response.data.signupToken);
            setUserEmail(response.data.user?.email || '');
            setIsLoading(false);
            setShowTerms(true);
            // try {
            //   const { code: agreeCode, message, data } = await agreeToTerms();
            //   console.log("약관 동의 응답:", agreeCode, message, data);

            //   if (agreeCode === 200) {
            //     setTokens({
            //       accessToken: data.accessToken,
            //       refreshToken: data.refreshToken,
            //     });
            //     console.log("약관 동의 및 토큰 설정 완료");
            //     setIsLoggedIn(true);
            //     navigate("/mypage");
            //   } else {
            //     console.error("약관 동의 실패:", message);
            //   }
            // } catch (err) {
            //   console.error("약관 동의 요청 중 에러:", err);
            // }
          } else {
            console.error('❌ 예상하지 못한 응답 구조:', response.data);
            setIsLoading(false);
            navigate('/mypage');
          }
        } catch (err) {
          console.error('로그인 요청 중 에러:', err);
          setIsLoading(false);
          navigate('/mypage');
        }
      } else {
        setIsLoading(false);
        navigate('/mypage');
      }
    };

    handleLogin();
  }, [location, navigate]);

  // 약관 동의 모달 닫기 (로그인 취소)
  const handleTermsClose = async () => {
    try {
      await kakaoLogout();
      clearTokens();
      setShowTerms(false);
      navigate('/mypage');
    } catch (error) {
      console.error('로그인 취소 처리 중 오류:', error);
      clearTokens();
      setShowTerms(false);
      navigate('/mypage');
    }
  };

  // 약관 동의 완료
  const handleTermsComplete = async () => {
    try {
      const result = await agreeToTerms();
      console.log('약관 동의 응답:', result.code, result.message, result.data);

      if (result.code === 200) {
        console.log('약관 동의 성공');
        setTokens({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        });

        // 사용자 정보 저장
        localStorage.setItem('email', userEmail);
        localStorage.setItem('verificationStatus', 'unverified');
        setIsLoggedIn(true);
        setShowTerms(false);
        setShowComplete(true);
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

export default KakaoCallback1;
