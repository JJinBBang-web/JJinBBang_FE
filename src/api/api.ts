// src/api/api.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

// Helper function to fix localhost URLs in API responses
const fixLocalhostUrls = (data: any): any => {
  if (!data) return data;
  
  const apiUrl = process.env.REACT_APP_API_URL || 'http://3.35.29.235:8080';
  
  if (typeof data === 'string' && data.includes('localhost:8080')) {
    return data.replace(/http:\/\/localhost:8080/g, apiUrl);
  }
  
  if (Array.isArray(data)) {
    return data.map(fixLocalhostUrls);
  }
  
  if (typeof data === 'object') {
    const fixed: any = {};
    for (const [key, value] of Object.entries(data)) {
      fixed[key] = fixLocalhostUrls(value);
    }
    return fixed;
  }
  
  return data;
};

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
  },
});

// AxiosRequestConfig 타입 확장 (useAuth, _retry 커스텀)
declare module 'axios' {
  export interface AxiosRequestConfig {
    useAuth?: boolean;
    isFile?: boolean;
    _retry?: boolean;
  }
}

// 요청 인터셉터 (access token 자동 삽입)
api.interceptors.request.use((config) => {
  if (config.useAuth) {
    const accessToken = localStorage.getItem('accessToken');

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

// 응답 인터셉터 (401 처리 및 토큰 갱신)
api.interceptors.response.use(
  (res) => {
    // console.log(
    //   "✅ Axios Response:",
    //   res.data,
    //   "\n✅ Axios Response URL:",
    //   res.config.url
    // );

    // Fix localhost image URLs in response data
    if (res.data && typeof res.data === 'object') {
      res.data = fixLocalhostUrls(res.data);
    }

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
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (typeof originalRequest.headers?.set === 'function') {
                originalRequest.headers.set('Authorization', `Bearer ${token}`);
              } else {
                (originalRequest.headers as any)[
                  'Authorization'
                ] = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/v1/auth/tokenRefresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newAccessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;
        
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        processQueue(null, newAccessToken);

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
        processQueue(err, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
