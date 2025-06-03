import { atom } from "recoil";

export const isSheetOpenState = atom<{
    isOpenModal : boolean,
    type : "housing" | "reviewType" | "university" | "contract" | "jjinFilter" |  null ;
}>({
    key: "isSheetOpenState",
    default: { isOpenModal: false, type: null },
  });

export const isGeneralSheetOpenState = atom <{
    isOpenModal : boolean,
    type : "ratingStars" | "complete" | "writeStop" | "deleteReview" | "reportReview" | null;
}> ({
    key : "isGeneralSheetOpenState",
    default : {isOpenModal:false, type : null}
})