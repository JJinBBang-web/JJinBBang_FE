// src/components/KakaoCallback.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { setLoggedIn } from "../recoil/auth/loginStateManager";


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

  useEffect(() => {
    // 1) URL에서 code 파라미터 추출
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    console.log("인가 코드:", code);

    // 2) 백엔드에 POST 요청 (로그인 시도)
    if (code) {
      kakaoLogin(code)
        .then((response) => {
          console.log("백엔드 응답:", response);
          // data 안에는 "로그인 성공", accessToken, refreshToken 등이 있을 것
          // 필요한 로직: 토큰 저장(localStorage 등) 혹은 리다이렉트
          if (response.data.accessToken) {
            // 로그인 성공 시, 토큰 저장
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            console.log("로그인 성공, 토큰 저장 완료");
            setLoggedIn(true);
          } else if (response.data.signupToken) {
            // 회원가입 필요 시, signupToken 저장
            localStorage.setItem("signupToken", response.data.signupToken);
            agreeToTerms()
              .then(({ code, message, data }) => {
                console.log("약관 동의 응답:", code, message, data);
                // 약관 동의 처리 로직
                if (code === 200) {
                  console.log("약관 동의 성공");
                  // 약관 동의 성공 후 처리 로직
                  setTokens({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                  });
                  setLoggedIn(true);
                } else {
                  console.error("약관 동의 실패:", message);
                }
              })
              .catch((err) => {
                console.error("약관 동의 요청 중 에러:", err);
              });
          } else {
            console.error("로그인 실패:", response);
          }
        })
        .catch((err) => {
          console.error("로그인 요청 중 에러:", err);
        });
    }

    // 3) 로그인 성공 시, 메인 페이지로 리다이렉트
    navigate("/mypage"); // 메인 페이지로 리다이렉트
  }, [location]);
  return null;
}

export default KakaoCallback1;
