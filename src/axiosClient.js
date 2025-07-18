import axios from "axios";
import { handleLogout } from "./lib/utils";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
    

axiosClient.interceptors.request.use(
    async (config) => {
    const privateConfig = config ;
    
    const token = localStorage.getItem("token");
    if (token) {
    privateConfig.headers["Authorization"] = `Bearer ${token}`;
    }
    
    if (privateConfig.data instanceof FormData) {
    privateConfig.headers["Content-Type"] = "multipart/form-data";
    }
    
    return privateConfig;
    },
    (error) => Promise.reject(error)
    );

const MAX_RETRIES = 3;
axiosClient.interceptors.response.use(
    (response ) => response,
    async (error) => {
    const config = error.config ;
    
    // Handle 500 errors
    if (error.response?.status === 500) {
    return Promise.reject(
    new Error(
    error.response.data.error || error.response.data.message || "Please try again later"
    )
    );
    }
    
    // Handle 403 errors (Forbidden)
    if (error.response?.status === 403) {
    return Promise.reject(
    new Error(
    error.response.data.error || error.response.data.message || "Please try again later"
    )
    );
    }
    
    // Handle non-401 errors
    if (error.response?.status !== 401) {
    return Promise.reject(error.response.data);
    }
    
    // Handle 401 errors
    if (error.response?.status === 401) {
    config._retryCount = config._retryCount || 0;
    
    if (config._retryCount < MAX_RETRIES) {
    config._retryCount++;
    
    try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        handleLogout();
    return Promise.reject(new Error("No refresh token available"));
    }
    
    const tokenResponse = await axiosClient.post(
    `/auth/refresh`,
    { refreshToken }
    );
    
    const newAccessToken = tokenResponse.data.data.accessToken;
    if (newAccessToken && tokenResponse.status === 200) {
        localStorage.setItem("token", newAccessToken);
        localStorage.setItem("refreshToken", tokenResponse.data.data.refreshToken);
    config.headers["Authorization"] = `Bearer ${newAccessToken}`;
    return axiosClient(config); // Retry the original request
    } else {
    handleLogout();
    return Promise.reject(new Error("Token refresh failed"));
    }
    } catch (refreshError) {
    handleLogout();
    return Promise.reject(refreshError);
    }
    } else {
    // Max retries reached, log out
    handleLogout();
     // Optionally redirect to login or show a message
     // window.location.href = "/login";
    return Promise.reject(new Error("Max retries reached for token refresh"));
    }
    }
    
    return Promise.reject(error.response || error);
    }
    );
    

export default axiosClient;
