// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authState, AuthState } from '../recoil/auth/atoms';
import { tokenStore } from '../api/api';

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState<AuthState>(authState);

  // ✅ 초기 실행 시 sessionStorage에서 상태 복원 (토큰은 메모리 기반)
  useEffect(() => {
    const accessToken = tokenStore.getAccessToken();
    const email = sessionStorage.getItem('email') ?? '';
    const verificationStatus =
      (sessionStorage.getItem(
        'verificationStatus'
      ) as AuthState['verificationStatus']) || 'none';

    if (accessToken) {
      setAuth({
        isAuthenticated: true,
        email,
        verificationStatus,
        isFirstLogin: false,
      });
    }
  }, [setAuth]);

  const updateVerificationStatus = (
    status: AuthState['verificationStatus']
  ) => {
    setAuth((prev: AuthState) => ({
      ...prev,
      verificationStatus: status,
    }));
    // sessionStorage에도 상태 저장 (새로고침 시 상태 유지)
    sessionStorage.setItem('verificationStatus', status);
  };

  const setEmail = (email: string) => {
    setAuth((prev: AuthState) => ({
      ...prev,
      email,
    }));
  };

  return {
    auth,
    setAuth,
    updateVerificationStatus,
    setEmail,
  };
};

export default useAuth;
