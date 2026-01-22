import { atom } from "recoil";

interface FilterState {
  isOpen: boolean;
  sortBy: string;
  type: string;
}

export const filterConfigState = atom<FilterState>({
  key: "filterConfigState",
  default: {
    isOpen: false,
    sortBy: "latest",
    type: "all",
  },
});
