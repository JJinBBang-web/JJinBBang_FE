// src/api/api.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

// SSOT: API 서버 주소는 여기서만 관리 (로컬 : env, 베포 : '')
export const getApiBaseURL = (): string => {
//   return process.env.REACT_APP_API_URL as string;
  return '';
};

export const api = axios.create({
  baseURL: getApiBaseURL(),
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
  },
  withCredentials: true, // 쿠키 전송을 위해 기본값 설정
});

// AxiosRequestConfig 타입 확장 (useAuth, _retry 커스텀)
declare module 'axios' {
  export interface AxiosRequestConfig {
    useAuth?: boolean;
    isFile?: boolean;
    _retry?: boolean;
  }
}

// 메모리 기반 토큰 저장소
class TokenStore {
  private accessToken: string | null = null;

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }
}

export const tokenStore = new TokenStore();

// 요청 인터셉터 (access token 자동 삽입)
api.interceptors.request.use((config) => {
  if (config.useAuth) {
    const accessToken = tokenStore.getAccessToken();

    if (typeof config.headers?.set === "function") {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    } else {
      (config.headers as any)["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  if (config.isFile) {
    // axios는 FormData 사용 시 Content-Type 생략하는 게 안전합니다.
    // 브라우저가 자동으로 boundary 설정해줌
    if (typeof config.headers?.set === "function") {
      config.headers.set("Content-Type", "multipart/form-data");
    } else {
      (config.headers as any)["Content-Type"] = "multipart/form-data";
    }
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

// 대기 중이던 요청 처리
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// 토큰 갱신 함수 (공통) - Race Condition 방지
export const refreshToken = async (): Promise<string> => {
  // 이미 갱신 중이면 대기
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: (token: string) => resolve(token),
        reject: (err: any) => reject(err),
      });
    });
  }

  isRefreshing = true;

  try {
    const response = await axios.put(
      `${getApiBaseURL()}/api/v1/auth/tokenRefresh`,
      {},
      {
        withCredentials: true,
      }
    );
    const newAccessToken = response.data.data.accessToken;
    tokenStore.setAccessToken(newAccessToken);
    processQueue(null, newAccessToken);
    return newAccessToken;
  } catch (err) {
    processQueue(err, null);
    tokenStore.clearAccessToken();
    // 토큰 갱신 실패 시 로그인 상태를 off로 설정하는 이벤트 발생
    window.dispatchEvent(new CustomEvent('auth:refresh-failed'));
    throw err;
  } finally {
    isRefreshing = false;
  }
};

// 응답 인터셉터 (401 처리 및 토큰 갱신)
api.interceptors.response.use(
  (res) => {
    // console.log(
    //   "✅ Axios Response:",
    //   res.data,
    //   "\n✅ Axios Response URL:",
    //   res.config.url
    // );


    return res;
  },
  async (error: AxiosError) => {
    // console.error(
    //   "❌ Axios Error:",
    //   error.response?.data,
    //   "\n❌ Axios Error URL:",
    //   error.response?.config.url
    // );
    const originalRequest = error.config as AxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      originalRequest.useAuth &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();

        if (typeof originalRequest.headers?.set === "function") {
          originalRequest.headers.set(
            "Authorization",
            `Bearer ${newAccessToken}`
          );
        } else {
          (originalRequest.headers as any)[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (err) {
        // 토큰 갱신 실패 시 로그인 상태를 off로 설정하는 이벤트 발생
        window.dispatchEvent(new CustomEvent('auth:refresh-failed'));
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
