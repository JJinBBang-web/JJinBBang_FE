import { atom } from "recoil";

export const isFilterModalOpenState = atom<boolean>({
    key: "isSheetOpenState",
    default: false,
  });