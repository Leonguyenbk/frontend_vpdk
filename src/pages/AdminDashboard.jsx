import React, { useEffect, useMemo, useState } from "react";
import { getUsers, updateUser, deleteUser, createUser } from "../api/userApi";
import { getOrgUnits } from "../api/orgUnitApi";

import UserFilters from "../components/UserFilters";
import UserTable from "../components/UserTable";
import UserDrawer from "../components/UserDrawer";
import UserFormModal from "../components/UserFormModal";

const normalize = (v) => (v ?? "").toString().trim().toLowerCase();
const pickList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.users)) return payload.users;
  return [];
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orgUnits, setOrgUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Filters
  const [filters, setFilters] = useState({ q: "", org_unit_id: "" });

  // Modal add/edit
  const [modal, setModal] = useState({ open: false, mode: "add", data: null });

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  // map org_unit_id -> org_unit object (để drawer/table luôn có org_unit.name)
  const orgMap = useMemo(() => {
    const m = {};
    for (const o of orgUnits) m[Number(o.id)] = o;
    return m;
  }, [orgUnits]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // users dùng userApi (đỡ gọi lại lung tung)
      const usersData = await getUsers();

      const orgsData = pickList(await getOrgUnits());

      setOrgUnits(orgsData);

      // vì orgMap phụ thuộc orgUnits, ta normalize sau khi có orgUnits:
      const map = {};
      for (const o of orgsData) map[Number(o.id)] = o;

      const normalized = pickList(usersData).map((u) => ({
        ...u,
        org_unit_id: u.org_unit_id != null ? Number(u.org_unit_id) : null,
        org_unit: u.org_unit || (u.org_unit_id != null ? map[Number(u.org_unit_id)] : null),
      }));

      setUsers(normalized);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      alert(err?.response?.data?.msg || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (mode, user = null) => {
    setDrawerOpen(false);
    setModal({ open: true, mode, data: user });
  };

  const closeModal = () => setModal((p) => ({ ...p, open: false }));

  // Click row: mở drawer
  const handleRowClick = (u) => {
    setModal((p) => ({ ...p, open: false }));
    setSelectedUser(u);
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa người dùng này?")) return;
    try {
      await deleteUser(id); // ✅ dùng userApi
      setUsers((prev) => prev.filter((u) => u.id !== id));

      if (selectedUser?.id === id) {
        setSelectedUser(null);
        setDrawerOpen(false);
      }
    } catch (err) {
      alert(err?.response?.data?.msg || "Lỗi khi xóa");
    }
  };

  // Submit modal (add/edit)
  const submitUser = async (payload) => {
    try {
      if (modal.mode === "add") {
        await createUser(payload); // ✅ dùng userApi
      } else {
        await updateUser(payload.id, payload); // ✅ dùng userApi
      }

      // reload list
      await fetchData();

      // nếu đang mở drawer đúng user vừa sửa => cập nhật lại selectedUser
      if (modal.mode === "edit" && selectedUser?.id === payload.id) {
        // lấy từ API mới cho chắc (hoặc tìm từ users sau fetchData)
        const fresh = await getUsers();
        const found = pickList(fresh).find((u) => u.id === payload.id);
        if (found) {
          const merged = {
            ...found,
            org_unit_id: found.org_unit_id != null ? Number(found.org_unit_id) : null,
            org_unit: found.org_unit || (found.org_unit_id != null ? orgMap[Number(found.org_unit_id)] : null),
          };
          setSelectedUser(merged);
        }
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.msg || "Lỗi khi lưu");
    }
  };

  // Filter client-side (sort by id)
  const visibleUsers = useMemo(() => {
    const q = normalize(filters.q);
    const orgId = filters.org_unit_id ? String(filters.org_unit_id) : "";

    let list = [...users];

    if (q) {
      list = list.filter((u) => {
        const hay = [
          u.username,
          u.full_name,
          u.email,
          u.phone,
          u.job_title,
          u.org_unit?.name,
        ]
          .map(normalize)
          .join(" ");
        return hay.includes(q);
      });
    }

    if (orgId) {
      list = list.filter((u) => String(u.org_unit_id ?? "") === orgId);
    }

    list.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
    return list;
  }, [users, filters]);

  return (
    <>
      {/* Wrapper */}
      <div
        className={`p-8 bg-gray-50 min-h-screen text-gray-900 font-sans transition-all duration-300
        ${drawerOpen ? "pr-[420px]" : "pr-8"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-black text-red-600 tracking-tighter italic uppercase">
              Quản trị nhân sự
            </h1>
            <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">
              Hệ thống:{" "}
              <span className="text-gray-900 font-mono">{loggedInUser.username}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2.5 rounded-lg font-bold transition-all border border-gray-300"
            >
              Làm mới
            </button>

            <button
              onClick={() => openModal("add", null)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-red-900/20 active:scale-95"
            >
              + THÊM NHÂN VIÊN
            </button>
          </div>
        </div>

        {/* Filters */}
        <UserFilters
          filters={filters}
          setFilters={setFilters}
          orgUnits={orgUnits}
          count={visibleUsers.length}
          total={users.length}
        />

        {/* Table */}
        <UserTable
          loading={loading}
          users={visibleUsers}
          onRowClick={handleRowClick}
          onEdit={(u) => openModal("edit", u)}
          onDelete={handleDelete}
        />
      </div>

      {/* Drawer */}
      <UserDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={selectedUser}
        orgUnits={orgUnits}
        onEdit={(u) => {
          setDrawerOpen(false);
          openModal("edit", u);
        }}
      />

      {/* Modal */}
      <UserFormModal
        open={modal.open}
        mode={modal.mode}
        data={modal.data}
        orgUnits={orgUnits}
        onClose={closeModal}
        onSubmit={submitUser}
      />
    </>
  );
}
