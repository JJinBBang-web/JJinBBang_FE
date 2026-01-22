// src/api/baseAPI.ts
import { api } from "./api";

export const getAPI = async (
  url: string,
  useAuthOption = false,
  params?: any
) => {
  try {
    const requestConfig = { useAuth: useAuthOption, params: params };

    const response = await api.get(url, requestConfig);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// 이 부분을 추가하세요
export const postAPI = async (
  url: string,
  data: any,
  useAuthOption = false
) => {
  try {
    const requestConfig = { useAuth: useAuthOption };

    const response = await api.post(url, data, requestConfig);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const putAPI = async (
  url: string,
  data: any,
  useAuthOption = false
) => {
  try {
    const requestConfig = { useAuth: useAuthOption };

    const response = await api.put(url, data, requestConfig);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const deleteAPI = async (
  url: string,
  useAuthOption = false
) => {
  try {
    const requestConfig = { useAuth: useAuthOption };

    const response = await api.delete(url, requestConfig);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
