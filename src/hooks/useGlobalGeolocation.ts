import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { geoCoordsState, geoErrorState, geoStatusState } from "../recoil/location/locationState";

type Options = {
  enabled: boolean;
  highAccuracy?: boolean;
  timeoutMs?: number;
  maximumAgeMs?: number;
  minUpdateMs?: number;

  /** enabled=false일 때 coords를 지울지 (기본 false 추천) */
  clearCoordsOnDisable?: boolean;
};

export function useGlobalGeolocation({
  enabled,
  highAccuracy = true,
  timeoutMs = 10_000,
  maximumAgeMs = 5_000,
  minUpdateMs = 1_000,
  clearCoordsOnDisable = false,
}: Options) {
  const setStatus = useSetRecoilState(geoStatusState);
  const setCoords = useSetRecoilState(geoCoordsState);
  const setErr = useSetRecoilState(geoErrorState);

  const watchIdRef = useRef<number | null>(null);
  const lastEmitRef = useRef<number>(0);

  const clearWatch = () => {
    if (watchIdRef.current != null && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    watchIdRef.current = null;
  };

  useEffect(() => {
    // ✅ 매번 시작 전에 기존 watch 정리 (중복 방지)
    clearWatch();

    if (!enabled) {
      lastEmitRef.current = 0;

      // ✅ coords를 기본은 유지 (원하면 옵션으로 비우기)
      if (clearCoordsOnDisable) setCoords(null);

      setErr(null);
      setStatus("idle");
      return;
    }

    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      setErr("Geolocation is not supported in this browser.");
      // coords는 유지/삭제는 선택인데, 보통 유지가 UX 좋음
      return;
    }

    setStatus("watching");
    setErr(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastEmitRef.current < minUpdateMs) return;
        lastEmitRef.current = now;

        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp,
        });
      },
      (error) => {
        clearWatch();

        if (error.code === error.PERMISSION_DENIED) {
          setStatus("denied");
          setErr("Location permission denied.");
          // ✅ denied여도 coords를 굳이 null로 날리지 말자 (원하면 여기서 setCoords(null))
        } else {
          setStatus("error");
          setErr(error.message || "Failed to get location.");
        }
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout: timeoutMs,
        maximumAge: maximumAgeMs,
      }
    );

    return () => {
      clearWatch();
    };
  }, [
    enabled,
    highAccuracy,
    timeoutMs,
    maximumAgeMs,
    minUpdateMs,
    clearCoordsOnDisable,
    setStatus,
    setCoords,
    setErr,
  ]);
}
