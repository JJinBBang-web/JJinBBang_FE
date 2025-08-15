// src/api/baseAPI.ts
import { api } from './api';

export const getAPI = async (url: string, useAuthOption: boolean = false) => {
  try {
    const requestConfig: { useAuth?: boolean } = {};
    if (useAuthOption) {
      requestConfig.useAuth = true;
    }
    const response = await api.get(url, requestConfig);
    return response.data;
  } catch (error) {}
};

// 이 부분을 추가하세요
export const postAPI = async (
  url: string,
  data?: any,
  useAuthOption: boolean = false
) => {
  try {
    const requestConfig: { useAuth?: boolean } = {};

    if (useAuthOption) {
      requestConfig.useAuth = true;
    }

    const response = await api.post(url, data, requestConfig);
    return response.data;
  } catch (error) {
    // 에러 처리 필요시 여기에 추가
  }
};

export const putAPI = async (
  url: string,
  data?: any,
  useAuthOption: boolean = false
) => {
  try {
    const requestConfig: { useAuth?: boolean } = {};

    if (useAuthOption) {
      requestConfig.useAuth = true;
    }

    const response = await api.put(url, data, requestConfig);
    return response.data;
  } catch (error) {
    // 에러 처리 필요시 여기에 추가
  }
};

export const deleteAPI = async (
  url: string,
  useAuthOption: boolean = false
) => {
  try {
    const requestConfig: { useAuth?: boolean } = {};

    if (useAuthOption) {
      requestConfig.useAuth = true;
    }

    const response = await api.delete(url, requestConfig);
    return response.data;
  } catch (error) {
    // 에러 처리 필요시 여기에 추가
  }
};

export const postAPI = async (
  url: string,
  data?: any,
  useAuthOption: boolean = false
) => {
  try {
    const requestConfig: { useAuth?: boolean } = {};

    if (useAuthOption) {
      requestConfig.useAuth = true;
    }

    const response = await api.post(url, data, requestConfig);
    return response.data;
  } catch (error) {
    // 에러 처리 필요시 여기에 추가
  }
};

export const putAPI = async (
  url: string,
  data?: any,
  useAuthOption: boolean = false
) => {
  try {
    const requestConfig: { useAuth?: boolean } = {};

    if (useAuthOption) {
      requestConfig.useAuth = true;
    }

    const response = await api.put(url, data, requestConfig);
    return response.data;
  } catch (error) {
    // 에러 처리 필요시 여기에 추가
  }
};

export const deleteAPI = async (
  url: string,
  useAuthOption: boolean = false
) => {
  try {
    const requestConfig: { useAuth?: boolean } = {};

    if (useAuthOption) {
      requestConfig.useAuth = true;
    }

    const response = await api.delete(url, requestConfig);
    return response.data;
  } catch (error) {
    // 에러 처리 필요시 여기에 추가
  }
};