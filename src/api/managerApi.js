import axiosClient from "./axiosClient";

const pickList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export const getManagerUsers = async () => {
  const res = await axiosClient.get("/manager/users");
  return pickList(res);
};

