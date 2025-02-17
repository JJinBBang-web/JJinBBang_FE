// src/hooks/useAuth.ts
import { useRecoilState } from 'recoil';
import { authState, AuthState } from '../recoil/auth/atoms';

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

  const updateVerificationStatus = (
    status: AuthState['verificationStatus']
  ) => {
    setAuth((prev) => ({
      ...prev,
      verificationStatus: status,
    }));
  };

  const setEmail = (email: string) => {
    setAuth((prev) => ({
      ...prev,
      email,
    }));
  };

  const resetAuth = () => {
    setAuth({
      isAuthenticated: false,
      email: null,
      verificationStatus: 'none',
    });
  };

  return {
    auth,
    updateVerificationStatus,
    setEmail,
    resetAuth,
  };
};
