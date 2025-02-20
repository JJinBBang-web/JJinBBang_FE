import { atom } from "recoil";

export const isSheetOpenState = atom<{
    isOpen : boolean,
    type : "housing" | "reviewType" | "university" | "contract" | "jjinFilter" |  null ;
}>({
    key: "isSheetOpenState",
    default: { isOpen: false, type: null },
  });