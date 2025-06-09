import axios from "axios";
import { getSession } from "next-auth/react";

const API_BASE_URL = "http://localhost:8080";
// process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Attempt to get the session on the client-side
    let session = null;
    if (typeof window !== "undefined") {
      // Client-side execution
      session = await getSession();
    } else {
      // Server-side execution (e.g., getServerSideProps, API routes)
      // Note: You need to pass req and res to getServerSession
      // This part would typically be handled in getServerSideProps or API routes
      // where you have access to req and res. For a universal axios instance,
      // you might need a different approach or to set the token manually
      // from getServerSideProps and pass it to your components.
      // For most client-side requests, getSession() is sufficient.
    }

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Optional: Response Interceptor for handling token expiration/refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Example: If 401 Unauthorized and not a refresh attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // You would implement a token refresh logic here if Keycloak supports it
      // For Auth.js, a 401 typically means the session cookie might be invalid
      // or the access token has expired and refresh logic wasn't triggered
      // by Auth.js itself.
      // In many Auth.js setups, a 401 from your backend might simply
      // mean the user needs to re-authenticate if the session isn't automatically
      // refreshing.
      // You might redirect to login, or re-fetch the session.
      console.error(
        "401 Unauthorized. Session might be expired. Redirecting to login...",
      );
      // router.push("/api/auth/signin"); // Example: redirect to sign-in page
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
