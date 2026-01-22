// src/hooks/useAuthInitialization.ts
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { isLoginState } from '../recoil/auth/isLoginState';
import { authState, AuthState } from '../recoil/auth/atoms';
import { tokenStore } from '../api/api';
import { authApi } from '../api/auth';

/**
 * 인증 초기화 훅
 * - 앱 시작 시 토큰 갱신 시도
 * - 토큰 갱신 실패 이벤트 처리
 */
export const useAuthInitialization = () => {
  const [isLogin, setIsLoggedIn] = useRecoilState(isLoginState);
  const [, setAuth] = useRecoilState<AuthState>(authState);
  const [isInitializing, setIsInitializing] = useState(true);

  // 앱 초기화 시 토큰 갱신
  useEffect(() => {
    const initializeAuth = async () => {
      // localStorage에 로그인 상태가 true일 때만 토큰 갱신 시도
      if (isLogin && !tokenStore.getAccessToken()) {
        try {
          await authApi.refreshAccessToken();
          // 토큰 갱신 성공 시 useQuery가 자동으로 유저 정보를 조회하고 복원함
        } catch (error) {
          // 토큰 갱신 실패는 조용히 처리 (이벤트 리스너에서 처리됨)
        }
      } else if (!isLogin) {
        // 로그인 상태가 false이면 authState도 초기화
        setAuth({
          isAuthenticated: false,
          email: undefined,
          verificationStatus: 'unverified',
          isFirstLogin: false,
        });
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [isLogin, setIsLoggedIn, setAuth]);



  return { isInitializing };
};

