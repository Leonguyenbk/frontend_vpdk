import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Gắn JWT token vào mọi request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Gọt response còn data
axiosClient.interceptors.response.use(
  (response) => (response && response.data ? response.data : response),
  (error) => Promise.reject(error)
);

export default axiosClient;