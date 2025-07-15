import { api } from "./api";

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
