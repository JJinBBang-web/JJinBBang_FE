import { atom } from "recoil";

export const isFilterModalOpenState = atom<boolean>({
    key: "isFilterModalOpenState",
    default: false,
  });