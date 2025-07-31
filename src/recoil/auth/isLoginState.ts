import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";


const { persistAtom } = recoilPersist();

export const isLoginState = atom<boolean>({
  key: "isLoginState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});