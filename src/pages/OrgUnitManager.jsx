import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";

import OrgUnitCard from "../components/org/OrgUnitCard";
import OrgUnitModal from "../components/org/OrgUnitModal";

export default function OrgUnitManager() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({
    open: false,
    mode: "add",
    data: { name: "", parent_id: null, unit_type: "department" },
  });

  const normalizeUnits = (data) =>
    (data || []).map((u) => ({
      ...u,
      id: Number(u.id),
      parent_id:
        u.parent_id === null || u.parent_id === undefined || u.parent_id === ""
          ? null
          : Number(u.parent_id),
    }));

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await axiosClient.get("/admin/org-units");
      setUnits(normalizeUnits(data));
    } catch (err) {
      console.error("Lỗi tải đơn vị:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Phòng cấp 1: parent_id === null
  const departments = useMemo(() => {
    return units
      .filter((u) => u.parent_id === null)
      .sort((a, b) => a.name.localeCompare(b.name, "vi", { sensitivity: "base" }));
  }, [units]);

  // Teams theo dept
  const getTeamsByDept = (deptId) => {
    return units
      .filter((u) => Number(u.parent_id) === Number(deptId))
      .sort((a, b) => a.name.localeCompare(b.name, "vi", { sensitivity: "base" }));
  };

  const openAddDept = () => {
    setModal({
      open: true,
      mode: "add",
      data: { name: "", parent_id: null, unit_type: "department" },
    });
  };

  const openAddTeam = (dept) => {
    setModal({
      open: true,
      mode: "add",
      data: { name: "", parent_id: dept.id, unit_type: "team" },
    });
  };

  const openEdit = (unit) => {
    setModal({
      open: true,
      mode: "edit",
      data: unit,
    });
  };

  const closeModal = () => setModal((p) => ({ ...p, open: false }));

  const submitUnit = async (payload) => {
    // payload: {id?, name, parent_id}
    if (modal.mode === "add") {
      await axiosClient.post("/admin/org-units", payload);
    } else {
      await axiosClient.put(`/admin/org-units/${payload.id}`, payload);
    }
    await fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa đơn vị này? (Nếu còn tổ con, backend sẽ chặn)")) return;
    try {
      await axiosClient.delete(`/admin/org-units/${id}`);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.msg || "Lỗi khi xóa");
    }
  };

  return (
    <div className="p-2 space-y-8 animate-in fade-in duration-500 text-zinc-100">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl font-black text-red-600 tracking-tighter italic uppercase">
            Cấu trúc tổ chức
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">
            Quản lý sơ đồ Phòng ban & Tổ đội
          </p>
        </div>

        <button
          onClick={openAddDept}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-red-900/20 active:scale-95 transition-all"
        >
          + TẠO PHÒNG BAN MỚI
        </button>
      </div>

      {/* List */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-zinc-600 font-bold uppercase animate-pulse">
            Đang tải sơ đồ...
          </div>
        ) : departments.length === 0 ? (
          <div className="py-20 text-center text-zinc-700 border-2 border-dashed border-white/5 rounded-[2rem]">
            Chưa có phòng ban nào. Hãy tạo phòng ban đầu tiên.
          </div>
        ) : (
          departments.map((dept) => (
            <OrgUnitCard
              key={dept.id}
              dept={dept}
              teams={getTeamsByDept(dept.id)}
              onAddTeam={openAddTeam}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Modal */}
      <OrgUnitModal
        open={modal.open}
        mode={modal.mode}
        data={modal.data}
        departments={departments}
        onClose={closeModal}
        onSubmit={submitUnit}
      />
    </div>
  );
}