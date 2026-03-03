import axiosClient from "./axiosClient";

const authApi = {
  // Đăng nhập
  login: async (username, password) => {
    const url = "/auth/login";
    // Trả về thẳng data vì axiosClient đã "gọt vỏ" rồi
    return await axiosClient.post(url, { username, password });
  },

  // Lấy thông tin cá nhân (cần token)
  getProfile: async () => {
    const url = "/auth/profile";
    return await axiosClient.get(url);
  },

  // Đăng xuất (nếu backend có xử lý revoke token)
  logout: async () => {
    try {
      await axiosClient.post("/auth/logout"); // nếu backend có
    } catch {
      // ignore
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },
};

export default authApi;
