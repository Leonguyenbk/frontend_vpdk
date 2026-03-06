import axiosClient from "./axiosClient";

const pickList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

// lấy danh sách user
export const getUsers = async () => {
  const res = await axiosClient.get("/admin/users");
  return pickList(res);
};

// lấy chi tiết 1 user
export const getUser = async (id) => {
  return await axiosClient.get(`/admin/users/${id}`);
};

// update user
export const updateUser = async (id, data) => {
  return await axiosClient.put(`/admin/users/${id}`, data);
};

// create user
export const createUser = async (data) => {
  return await axiosClient.post("/admin/users", data);
};

// delete user
export const deleteUser = async (id) => {
  return await axiosClient.delete(`/admin/users/${id}`);
};
