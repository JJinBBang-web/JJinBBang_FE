// src/api/auth.ts
import { api, getApiBaseURL, tokenStore, refreshToken } from './api';

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

export interface EmailCodeRequest {
  emailAddress: string;
}

export interface TokenRefreshResponse {
  code: number;
  message: string;
  data: {
    accessToken: string;
  };
}

export type SocialProvider = 'kakao' | 'google' | 'naver';

export interface SocialLoginStatus {
  status: 'oauth_failed' | 'terms_pending' | 'success';
}

export interface UserDeleteResponse {
  code: number;
  message: string;
  data: null;
}

export interface LogoutResponse {
  code: number;
  message: string;
  data: null;
}

export interface CertificateVerifyResponse {
  code: number;
  message: string;
  data: any; // 인증 결과 데이터
}

export const authApi = {
  // 이메일 인증코드 전송
  sendVerificationEmail: async (
    emailAddress: string
  ): Promise<EmailVerificationResponse> => {
    try {
      const response = await api.post<EmailVerificationResponse>(
        "/api/v1/auth/emailCode",
        { emailAddress },
        { useAuth: true }
      );
      return response.data;
    } catch (error: any) {
      console.error("요청 헤더:", error.config?.headers);
      throw new Error(`이메일 전송 실패: ${error.response?.data?.message}`);
    }
  },

  // 이메일 인증코드 검증
  verifyEmailCode: async (
    emailAddress: string,
    authCode: string
  ): Promise<EmailVerificationResponse> => {
    try {
      const response = await api.post<EmailVerificationResponse>(
        "/api/v1/auth/emailCode/verify",
        { emailAddress, authCode },
        {
          useAuth: true, // 인증 토큰 필요
        }
      );

      // 응답 데이터를 any로 타입 단언하여 처리
      const responseData = response.data as any;

      // 백엔드 응답 구조: { code: number, message: string, data: any }
      // code가 200이면 성공, 그 외는 실패
      if (responseData && typeof responseData.code === "number") {
        const isSuccess = responseData.code === 200;
        return {
          success: isSuccess,
          message:
            responseData.message ||
            (isSuccess
              ? "인증이 완료되었습니다."
              : "인증코드가 일치하지 않습니다."),
        };
      }

      // code 필드가 없는 경우: HTTP 상태 코드로 판단 (fallback)
      return {
        success: response.status === 200,
        message: responseData?.message || "인증이 완료되었습니다.",
      };
    } catch (error: any) {
      console.error("이메일 인증코드 검증 실패:", error);

      // API 에러 응답에서 메시지 추출
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error; // 이미 처리된 에러 메시지 유지
      } else {
        throw new Error("인증에 실패했습니다.");
      }
    }
  },

  // 소셜 로그인 시작
  startSocialLogin: (provider: SocialProvider, redirectUrl: string): void => {
    // redirectUrl을 Base64 URL-safe로 인코딩 (백엔드의 Base64.getUrlDecoder()와 호환)
    // 일반 Base64 인코딩 후 URL-safe 형식으로 변환
    const base64 = btoa(redirectUrl);
    const encodedUrl = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    // SSOT: api.ts에서 baseURL 가져오기
    const apiUrl = getApiBaseURL();
    // 백엔드로 리다이렉트 (GET 요청이므로 window.location 사용)
    // apiUrl이 빈 문자열이면 상대 경로 사용 (프록시 활용), 아니면 절대 경로 사용
    const url = `${apiUrl}/api/v1/auth/signIn/${provider}?redirect=${encodedUrl}`
    window.location.href = url;
  },

  // 액세스 토큰 갱신 (쿠키 기반 - 리프레시 토큰은 쿠키에 자동 포함)
  refreshAccessToken: async (): Promise<TokenRefreshResponse> => {
    try {
      const newAccessToken = await refreshToken();
      return {
        code: 200,
        message: '토큰 갱신 성공',
        data: {
          accessToken: newAccessToken,
        },
      };
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      tokenStore.clearAccessToken();
      throw new Error('토큰 갱신에 실패했습니다.');
    }
  },

  // 로그아웃
  logout: async (): Promise<LogoutResponse> => {
    try {
      const response = await api.delete<LogoutResponse>(
        "/api/v1/auth/logout",
        {
          useAuth: false, // 리프레시 토큰은 쿠키에 있으므로 useAuth 불필요
        }
      );

      // 로그아웃 성공 시 메모리 정리
      if (response.data.code === 200) {
        tokenStore.clearAccessToken();
        // 리프레시 토큰은 서버에서 쿠키 삭제 처리됨
      }

      return response.data;
    } catch (error: any) {
      console.error("로그아웃 실패:", error);

      // API 에러 응답에서 메시지 추출
      let errorMessage = "로그아웃에 실패했습니다.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  // 서비스 탈퇴
  deleteUser: async (): Promise<UserDeleteResponse> => {
    try {
      const response = await api.delete<UserDeleteResponse>(
        "/api/v1/auth/user",
        {
          useAuth: true, // 인증이 필요한 요청
        }
      );

      // 탈퇴 성공 시 메모리 정리
      if (response.data.code === 200) {
        tokenStore.clearAccessToken();
        // 리프레시 토큰은 쿠키에 있으므로 별도 삭제 불필요
      }

      return response.data;
    } catch (error: any) {
      console.error("서비스 탈퇴 실패:", error);

      // API 에러 응답에서 메시지 추출
      let errorMessage = "Leave Service Failed.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  // 재학증명서 인증
  verifyEnrollmentCertificate: async (
    file: File
  ): Promise<CertificateVerifyResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<CertificateVerifyResponse>(
        "/api/v1/certificates/enrollment/verify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          useAuth: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error("재학증명서 인증 실패:", error);
      throw new Error("재학증명서 인증에 실패했습니다.");
    }
  },

  // 합격증명서 인증
  verifyAdmissionCertificate: async (
    file: File
  ): Promise<CertificateVerifyResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<CertificateVerifyResponse>(
        "/api/v1/certificates/admission/verify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          useAuth: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error("합격증명서 인증 실패:", error);
      throw new Error("합격증명서 인증에 실패했습니다.");
    }
  },
};
