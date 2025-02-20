// src/util/api.ts
const BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '서버 오류가 발생했습니다.');
    }

    return data;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
};
