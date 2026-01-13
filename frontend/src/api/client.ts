import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Enable credentials for CORS (allows cookies/auth headers if needed in future)
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 410) {
      return Promise.reject(new Error("This room has expired"));
    }
    if (error.response?.status === 429) {
      return Promise.reject(
        new Error(error.response.data?.error || "Too many requests")
      );
    }
    if (error.response?.status === 403) {
      return Promise.reject(
        new Error(error.response.data?.error || "Access forbidden")
      );
    }
    return Promise.reject(error);
  }
);
