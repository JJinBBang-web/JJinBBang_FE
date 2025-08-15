// src/api/auth.ts
import { api } from './api';

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

export interface UserDeleteResponse {
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
      const token = localStorage.getItem('accessToken');
      console.log('토큰 존재:', !!token);
      console.log('토큰 일부:', token?.substring(0, 20) + '...');

      const response = await api.post<EmailVerificationResponse>(
        '/api/v1/auth/emailCode',
        { emailAddress },
        { useAuth: true }
      );
      return response.data;
    } catch (error: any) {
      console.error('요청 헤더:', error.config?.headers);
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
        '/api/v1/auth/emailCode/verify',
        { emailAddress, authCode },
        {
          useAuth: true, // 인증 토큰 필요
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('이메일 인증코드 검증 실패:', error);
      throw new Error('인증에 실패했습니다.');
    }
  },

  // 액세스 토큰 갱신
  refreshAccessToken: async (): Promise<TokenRefreshResponse> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('리프레시 토큰이 없습니다.');
      }

      const response = await api.put<TokenRefreshResponse>(
        '/api/v1/auth/tokenRefresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
          useAuth: false, // 리프레시 토큰을 직접 사용하므로 자동 인증 비활성화
        }
      );

      // 새로운 토큰을 로컬 스토리지에 저장
      if (response.data.data.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }

      return response.data;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      // 토큰 갱신 실패 시 로컬 스토리지 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('토큰 갱신에 실패했습니다.');
    }
  },

  // 서비스 탈퇴
  deleteUser: async (): Promise<UserDeleteResponse> => {
    try {
      const response = await api.delete<UserDeleteResponse>(
        '/api/v1/auth/user',
        {
          useAuth: true, // 인증이 필요한 요청
        }
      );

      // 탈퇴 성공 시 로컬 스토리지 정리
      if (response.data.code === 200) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }

      return response.data;
    } catch (error) {
      console.error('서비스 탈퇴 실패:', error);
      throw new Error('서비스 탈퇴에 실패했습니다.');
    }
  },

  // 재학증명서 인증
  verifyEnrollmentCertificate: async (
    file: File
  ): Promise<CertificateVerifyResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<CertificateVerifyResponse>(
        '/api/v1/certificates/enrollment/verify',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          useAuth: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error('재학증명서 인증 실패:', error);
      throw new Error('재학증명서 인증에 실패했습니다.');
    }
  },

  // 합격증명서 인증
  verifyAdmissionCertificate: async (
    file: File
  ): Promise<CertificateVerifyResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<CertificateVerifyResponse>(
        '/api/v1/certificates/admission/verify',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          useAuth: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error('합격증명서 인증 실패:', error);
      throw new Error('합격증명서 인증에 실패했습니다.');
    }
  },
};
