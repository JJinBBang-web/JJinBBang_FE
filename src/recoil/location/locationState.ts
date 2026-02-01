import { atom } from "recoil";

export type GeoCoords = {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number | null;
  speed?: number | null;
  timestamp: number; // ms
};

export type GeoStatus = "idle" | "watching" | "denied" | "error" | "unsupported";

export const geoStatusState = atom<GeoStatus>({
  key: "geoStatusState",
  default: "idle",
});

export const geoCoordsState = atom<GeoCoords | null>({
  key: "geoCoordsState",
  default: null,
});

export const geoErrorState = atom<string | null>({
  key: "geoErrorState",
  default: null,
});
