import { atom } from "recoil";

export const hideNavState = atom<boolean>({
  key: 'hideNavState', // 고유한 키값
  default: false,      // 기본값은 false (Nav 보임)
});