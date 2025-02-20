// src/hooks/useAuth.ts
import { useRecoilState } from 'recoil';
import { authState, AuthState } from '../recoil/auth/atoms';

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

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
    updateVerificationStatus,
    setEmail,
  };
};
