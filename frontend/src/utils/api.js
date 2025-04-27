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

// 응답 인터셉터 (에러 핸들링)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    console.log("API 에러 발생", error);
    if (status === 401) {
      alert("로그인이 필요합니다. 다시 로그인 해주세요.");
      window.location.href = "/login";
    } else if (status >= 500) {
      alert("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }

    return Promise.reject(error);
  }
);

// 응답 핸들링
const handleResponse = (response) => {
  console.log("API 응답", response);
  return response.data.data;
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

export const extractErrorInfo = (error) => {
  return {
    status: error.response?.status,
    message: error.response?.data?.message || "알 수 없는 오류입니다.",
  };
};
