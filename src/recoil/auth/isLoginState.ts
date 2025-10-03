import { atom } from "recoil";


const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: sessionStorage,
});