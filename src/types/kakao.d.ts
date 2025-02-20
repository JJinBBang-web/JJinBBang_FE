// src/types/kakao.d.ts
interface KakaoInstance {
  init: (key: string) => void;
  Auth: {
    login: (options: any) => void;
  };
}

declare global {
  interface Window {
    Kakao: KakaoInstance;
  }
}

export {};
