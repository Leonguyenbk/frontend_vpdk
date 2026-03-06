import axiosClient from "./axiosClient";

const pickList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.units)) return payload.units;
  return [];
};

export const getOrgUnits = async () => {
  const res = await axiosClient.get("/admin/org-units");
  return pickList(res);
};

