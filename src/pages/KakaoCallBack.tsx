// src/pages/KakaoCallback.tsx

import React, { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { isLoginState } from "../recoil/auth/isLoginState";
import { useRecoilState } from "recoil";
import TermsAgreementModal from "../components/auth/TermsAgreementModal";
import SignupCompleteModal from "../components/auth/SignupCompleteModal";

const url = process.env.REACT_APP_API_URL;
const SITE_URL = process.env.REACT_APP_SITE_URL!;
const loginUrl = `${SITE_URL}/login/kakao`;
export const getSignupToken = () => sessionStorage.getItem("signupToken");
export const getAccessToken = () => sessionStorage.getItem("accessToken");
export const getRefreshToken = () => sessionStorage.getItem("refreshToken");

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const setSignupToken = (signupToken: string) => {
  sessionStorage.setItem("signupToken", signupToken);
};

export const setTokens = ({ accessToken, refreshToken }: Tokens) => {
  sessionStorage.setItem("accessToken", accessToken);
  sessionStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
};

export const kakaoLogin = async (authCode: string) => {
  const body = {
    oauthProvider: "kakao",
    oauthCode: authCode,
    redirectUri: loginUrl,
  };

  // const apiUrl = process.env.REACT_APP_API_URL || 'http://3.35.29.235:8080';
  const response = await fetch(`/api/v1/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oauthProvider: "kakao",
      oauthCode: authCode,
      redirectUri: loginUrl,
    }),
  });

  // Check if response is HTML (error page)
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(
      `API endpoint returned HTML instead of JSON. Status: ${response.status}`
    );
  }

  return response.json();
};

const kakaoLogout = async () => {
  try {
    // 브라우저에서 카카오 관련 쿠키나 세션 정리
    // console.log('카카오 로그아웃 처리');
  } catch (error) {
    console.error("카카오 로그아웃 중 오류:", error);
  }
};

export const agreeToTerms = async () => {
  const response = await fetch("/api/v1/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getSignupToken()}`,
    },
    body: null,
  });
  return response.json();
};

export const getUserInfo = async () => {
  const response = await fetch("/api/v1/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.json();
};

function KakaoCallBack() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setIsLoggedIn] = useRecoilState(isLoginState);
  const [showTerms, setShowTerms] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const handleLogin = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");

      if (code) {
        try {
          const response = await kakaoLogin(code);

          if (response.data.accessToken) {
            setTokens({
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            });
            setIsLoading(false);
            setIsLoggedIn(true);
            navigate("/mypage");
          } else if (response.data.signupToken) {
            setSignupToken(response.data.signupToken);
            setUserEmail(response.data.user?.email || "");
            setIsLoading(false);
            setShowTerms(true);
          } else {
            setIsLoading(false);
            navigate("/mypage");
          }
        } catch (err) {
          setIsLoading(false);
          navigate("/mypage");
        }
      } else {
        setIsLoading(false);
        navigate("/mypage");
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
      navigate("/mypage");
    } catch (error) {
      clearTokens();
      setShowTerms(false);
      navigate("/mypage");
    }
  };

  // 약관 동의 완료
  const handleTermsComplete = async () => {
    try {
      const result = await agreeToTerms();

      if (result.code === 200) {
        setTokens({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        });

        // 사용자 정보 저장
        sessionStorage.setItem("email", userEmail);
        sessionStorage.setItem("verificationStatus", "unverified");
        setIsLoggedIn(true);
        setShowTerms(false);
        setShowComplete(true);
      } else {
        await handleTermsClose();
      }
    } catch (err) {
      await handleTermsClose();
    }
  };

  // 가입 완료 모달 확인
  const handleSignupConfirm = () => {
    setShowComplete(false);
    navigate("/mypage");
  };

  // 가입 완료 모달 인증하기
  const handleSignupVerify = () => {
    setShowComplete(false);
    navigate("/auth/student/verify");
  };

  if (isLoading) {
    return (
      <div className="content">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            gap: "16px",
          }}
        >
          <img
            src="/assets/image/loading.gif"
            alt="loading"
            style={{ width: "48px", height: "48px" }}
          />
          <p>로그인 처리 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div style={{ height: "100vh", background: "#f5f5f5" }}>{/* 배경 */}</div>

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

export default KakaoCallBack;
