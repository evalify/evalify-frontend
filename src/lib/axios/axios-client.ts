import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const API_BASE_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` ||
  "http://172.17.9.74:8020/api/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const session = await getSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const session = await getSession();

      if (session?.error?.includes("RefreshAccessTokenError")) {
        // Token refresh failed, sign out
        if (typeof window !== "undefined") {
          await signOut({ callbackUrl: "/auth/login" });
        }
        return Promise.reject(error);
      }

      if (session?.access_token) {
        // Retry with new token
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
