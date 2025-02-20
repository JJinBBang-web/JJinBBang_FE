// src/recoil/auth/atoms.ts
import { atom } from 'recoil';
export interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  verificationStatus: 'none' | 'pending' | 'verified';
}
export const authState = atom<AuthState>({
  key: 'auth-state',
  default: {
    isAuthenticated: false,
    email: null,
    verificationStatus: 'none',
  },
});
