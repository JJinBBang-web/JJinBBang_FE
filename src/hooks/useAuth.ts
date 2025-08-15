// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authState, AuthState } from '../recoil/auth/atoms';

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState<AuthState>(authState);

  // ✅ 초기 실행 시 localStorage → recoil 상태 복원
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const email = localStorage.getItem('email') ?? '';
    const verificationStatus =
      (localStorage.getItem(
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
