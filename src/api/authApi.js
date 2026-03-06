import axiosClient from "./axiosClient";

const authApi = {
  login: async (username, password) => {
    return await axiosClient.post("/auth/login", { username, password });
  },

  getProfile: async () => {
    return await axiosClient.get("/auth/me");
  },

  logout: async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      console.warn("Backend logout chưa có hoặc bị lỗi:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }
  },
};

export default authApi;