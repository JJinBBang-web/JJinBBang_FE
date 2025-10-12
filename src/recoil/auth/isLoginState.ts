import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: sessionStorage,
});

export const isLoginState = atom<boolean>({
  key: 'isLoginState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});