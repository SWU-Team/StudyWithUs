import axios from "axios";
import { getAuthHeader } from "./auth";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (Authorization 헤더 자동 추가)
apiClient.interceptors.request.use((config) => {
  const auth = getAuthHeader();
  if (auth) {
    config.headers.Authorization = auth;
  }
  return config;
});

// 응답 핸들링
const handleResponse = (response) => {
  const { code, message, data } = response.data;

  if (code !== 0) {
    throw new Error(message || "알 수 없는 에러 발생");
  }

  return data;
};

export const apiGet = async (url) => {
  const response = await apiClient.get(url);
  return handleResponse(response);
};

export const apiPost = async (url, body) => {
  const response = await apiClient.post(url, body);
  return handleResponse(response);
};

export const apiPut = async (url, body) => {
  const response = await apiClient.put(url, body);
  return handleResponse(response);
};

export const apiPatch = async (url, body) => {
  const response = await apiClient.patch(url, body);
  return handleResponse(response);
};

export const apiDelete = async (url) => {
  const response = await apiClient.delete(url);
  return handleResponse(response);
};
