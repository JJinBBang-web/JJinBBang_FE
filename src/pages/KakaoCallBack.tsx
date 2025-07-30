// src/components/KakaoCallback.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { isLoginState } from "../recoil/auth/isLoginState";
import { useRecoilState, useRecoilValue } from "recoil";

const url = process.env.REACT_APP_API_URL;
export const getSignupToken = () => localStorage.getItem("signupToken");
export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const setSignupToken = (signupToken: string) => {
  localStorage.setItem("signupToken", signupToken);
};

export const setTokens = ({ accessToken, refreshToken }: Tokens) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const kakaoLogin = async (authCode: string) => {
  const response = await fetch(url + "/api/v1/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oauthProvider: "kakao",
      oauthCode: authCode,
    }),
  });
  return response.json();
};

export const agreeToTerms = async () => {
  console.log("SignupToken:", getSignupToken());
  const response = await fetch(url + "/api/v1/auth/signup", {
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
  const response = await fetch(url + "/api/v1/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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

  useEffect(() => {
    const handleLogin = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");
      console.log("인가 코드:", code);

      if (!code) return;

      try {
        const response = await kakaoLogin(code);
        console.log("백엔드 응답:", response);

        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          console.log("로그인 성공, 토큰 저장 완료");
          setIsLoggedIn(true);
          navigate("/mypage");
        } else if (response.data.signupToken) {
          localStorage.setItem("signupToken", response.data.signupToken);
          try {
            const { code: agreeCode, message, data } = await agreeToTerms();
            console.log("약관 동의 응답:", agreeCode, message, data);

            if (agreeCode === 200) {
              setTokens({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              });
              console.log("약관 동의 및 토큰 설정 완료");
              setIsLoggedIn(true);
              navigate("/mypage");
            } else {
              console.error("약관 동의 실패:", message);
            }
          } catch (err) {
            console.error("약관 동의 요청 중 에러:", err);
          }
        } else {
          console.error("로그인 실패:", response);
        }
      } catch (err) {
        console.error("로그인 요청 중 에러:", err);
      }
    };

    handleLogin();
  }, [location]);

  return null;
}

export default KakaoCallback1;
