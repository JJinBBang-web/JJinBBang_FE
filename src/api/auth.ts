// src/api/auth.ts
export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

export const authApi = {
  sendVerificationEmail: async (
    email: string
  ): Promise<EmailVerificationResponse> => {
    const response = await fetch('/api/v1/auth/emailCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('이메일 전송에 실패했습니다.');
    }

    return response.json();
  },

  verifyEmailCode: async (
    email: string,
    code: string
  ): Promise<EmailVerificationResponse> => {
    const response = await fetch('/api/v1/auth/emailCode/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      throw new Error('인증에 실패했습니다.');
    }

    return response.json();
  },
};
