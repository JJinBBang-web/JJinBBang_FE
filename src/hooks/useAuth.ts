// src/hooks/useAuth.ts
import { useRecoilState } from 'recoil';
import { authState, AuthState } from '../recoil/auth/atoms';

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState<AuthState>(authState);

  // 주의: 초기화 로직은 App.tsx에서 처리하므로 여기서는 제거
  // App.tsx에서 앱 초기화 시 sessionStorage에서 상태를 복원함

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
