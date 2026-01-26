// recoil/ui/imageReloadVersion.ts
import { atom } from "recoil";

export const imageReloadVersionState = atom<number>({
  key: "imageReloadVersionState",
  default: 0,
});