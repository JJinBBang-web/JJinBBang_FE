// src/pages/auth/KakaoCallback.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../../util/api';

interface KakaoAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    isVerified: boolean;
  };
}

const KakaoCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKakaoCallback = async () => {
      const code = new URL(window.location.href).searchParams.get('code');

      if (code) {
        try {
          const response = await fetchApi<KakaoAuthResponse>('/auth/kakao', {
            method: 'POST',
            body: JSON.stringify({ code }),
          });

          if (response.success && response.data) {
            // 토큰을 로컬 스토리지에 저장
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            // 이메일 인증 상태에 따라 리다이렉트
            if (response.data.user.isVerified) {
              navigate('/mypage');
            } else {
              navigate('/auth/verify');
            }
          }
        } catch (error) {
          console.error('카카오 로그인 처리 중 오류 발생:', error);
          navigate('/mypage', {
            state: {
              error: '로그인에 실패했습니다. 다시 시도해 주세요.',
            },
          });
        }
      } else {
        navigate('/mypage', {
          state: {
            error: '인증 코드를 받아오지 못했습니다.',
          },
        });
      }
    };

    handleKakaoCallback();
  }, [navigate]);

  return (
    <div className="content">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: '16px',
        }}
      >
        <img
          src="/assets/image/loading.gif"
          alt="loading"
          style={{ width: '48px', height: '48px' }}
        />
        <p>로그인 처리 중입니다...</p>
      </div>
    </div>
  );
};

export default KakaoCallback;
