import { atom } from "recoil";

export const geoWatchEnabledState = atom<boolean>({
  key: "geoWatchEnabledState",
  default: false,
});
