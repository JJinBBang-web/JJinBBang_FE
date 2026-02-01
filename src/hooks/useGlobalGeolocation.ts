import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { geoCoordsState, geoErrorState, geoStatusState } from "../recoil/location/locationState";

type Options = {
  enabled: boolean;           // 전역 추적 켤지/말지
  highAccuracy?: boolean;
  timeoutMs?: number;
  maximumAgeMs?: number;
  minUpdateMs?: number;       // 너무 잦은 업데이트 방지(프론트 렌더링/백엔드 호출 대비)
};

export function useGlobalGeolocation({
  enabled,
  highAccuracy = true,
  timeoutMs = 10_000,
  maximumAgeMs = 5_000,
  minUpdateMs = 1_000,
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
    if (!enabled) {
      clearWatch();
      lastEmitRef.current = 0;

      // ✅ 중요: 이전 좌표/에러가 남지 않게 리셋
      setCoords(null);
      setErr(null);
      setStatus("idle");
      return;
    }

    if (!("geolocation" in navigator)) {
      clearWatch();
      setCoords(null);
      setStatus("unsupported");
      setErr("Geolocation is not supported in this browser.");
      return;
    }

    setStatus("watching");
    setErr(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastEmitRef.current < minUpdateMs) return; // throttle
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
        setCoords(null);

        if (error.code === error.PERMISSION_DENIED) {
          setStatus("denied");
          setErr("Location permission denied.");
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
    setStatus,
    setCoords,
    setErr,
  ]);
}
