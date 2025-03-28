// src/recoil/auth/atoms.ts
import { atom } from 'recoil';

// AuthState 인터페이스 export 추가
export interface AuthState {
  isAuthenticated: boolean;
  email?: string;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'none';
  isFirstLogin?: boolean;
}

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    isAuthenticated: false,
    verificationStatus: 'unverified',
    isFirstLogin: false,
  },
});
