// src/util/kakaoAuth.ts
const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID || '';
const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI || '';

if (!KAKAO_CLIENT_ID || !REDIRECT_URI) {
  console.error('카카오 인증 정보가 설정되지 않았습니다.');
}

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

export const initializeKakaoSDK = () => {
  if (!window.Kakao) {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    document.head.appendChild(script);

    return new Promise((resolve) => {
      script.onload = () => {
        if (KAKAO_CLIENT_ID) {
          window.Kakao.init(KAKAO_CLIENT_ID);
        }
        resolve(true);
      };
    });
  }
  return Promise.resolve(true);
};
