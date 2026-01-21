// src/hooks/useUserInfo.ts
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { isLoginState } from '../recoil/auth/isLoginState';
import { authState, AuthState } from '../recoil/auth/atoms';
import { tokenStore } from '../api/api';
import { getAPI } from '../api/baseAPI';
import { setRecoil } from '../util/RecoilNexus';
import { explorationFrequencyState } from '../recoil/util/explorationFrequencyState';

/**
 * 사용자 정보 조회 및 상태 관리 훅
 * - 사용자 정보 조회
 * - 조회 성공 시 sessionStorage 및 authState 업데이트
 * - 조회 실패 시 로그인 상태 off
 */
export const useUserInfo = (isInitializing: boolean) => {
  const location = useLocation();
  const [isLogin, setIsLoggedIn] = useRecoilState(isLoginState);
  const [, setAuth] = useRecoilState<AuthState>(authState);

  const {
    data: userData,
    isError: isErrorUser,
    isSuccess: isSuccessUser,
  } = useQuery({
    queryKey: [location.pathname],
    queryFn: async () => {
      // 토큰이 없으면 에러 발생 (enabled 옵션으로 이미 체크되지만, 추가 안전장치)
      const currentAccessToken = tokenStore.getAccessToken();
      if (!currentAccessToken) {
        throw new Error('Access token is not available');
      }
      const response = await getAPI(`/api/v1/user`, true);
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: !isInitializing && isLogin && !!tokenStore.getAccessToken(), // 초기화 완료 후 로그인 상태가 true이고 토큰이 있을 때만 쿼리 실행
  });

  // 사용자 정보 조회 성공 시 sessionStorage 및 authState 업데이트
  useEffect(() => {
    if (isSuccessUser && userData) {
      const email = userData.email || undefined;
      const university = userData.university || undefined;
      const verificationStatus = userData.univAuthentication === "인증완료" 
        ? 'verified' as const
        : (sessionStorage.getItem('verificationStatus') as AuthState['verificationStatus']) || 'unverified';

      // sessionStorage 업데이트
      if (email) {
        sessionStorage.setItem('email', email);
      }
      if (university) {
        sessionStorage.setItem('university', university);
      }
      sessionStorage.setItem('verificationStatus', verificationStatus);

      // authState 업데이트
      setAuth({
        isAuthenticated: true,
        email,
        verificationStatus,
        isFirstLogin: false,
      });
    }
  }, [isSuccessUser, userData, setAuth]);

  // 사용자 정보 조회 실패 시 로그인 상태 off
  useEffect(() => {
    if (isErrorUser && isLogin) {
      setIsLoggedIn(false);
      setAuth({
        isAuthenticated: false,
        email: undefined,
        verificationStatus: 'unverified',
        isFirstLogin: false,
      });
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('verificationStatus');
      sessionStorage.removeItem('university');
      // 탐색 빈도 상태 초기화
      setRecoil(explorationFrequencyState, {});
    }
  }, [isErrorUser, isLogin, setIsLoggedIn, setAuth]);

  return { userData };
};

