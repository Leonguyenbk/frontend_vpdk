import React, { useEffect, useMemo, useState } from "react";
import { getJobTitles } from "../api/userApi";

const initialForm = {
  id: null,
  username: "",
  password: "",
  full_name: "",
  email: "",
  phone: "",
  gender: "Nam",
  birth_date: "",
  job_title: "",
  job_title_id: null,
  role: "user",
  department_id: "",
  team_id: "",
  org_unit_id: "",
  is_active: true,
};

const toInputDate = (v) => {
  if (!v) return "";
  const s = String(v);
  if (s.includes("T")) return s.split("T")[0];
  return s;
};

const toNumOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

const ROLE_OPTIONS = new Set(["user", "manager", "admin"]);
const normalizeRole = (value) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  return ROLE_OPTIONS.has(normalized) ? normalized : "user";
};

export default function UserFormModal({
  open,
  mode = "add",
  data,
  orgUnits = [],
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [jobTitles, setJobTitles] = useState([]);
  const [jobTitleError, setJobTitleError] = useState(null);

  useEffect(() => {
    const fetchJobTitles = async () => {
      if (!open) return;
      try {
        setJobTitleError(null);
        const titles = await getJobTitles();
        setJobTitles(titles);
      } catch (error) {
        setJobTitleError("Không tải được danh sách chức danh");
        console.error("Failed to fetch job titles:", error);
      }
    };
    fetchJobTitles();
  }, [open]);

  const normalizedUnits = useMemo(
    () =>
      (Array.isArray(orgUnits) ? orgUnits : []).map((u) => ({
        ...u,
        id: toNumOrNull(u?.id),
        parent_id: toNumOrNull(u?.parent_id),
        unit_type: String(u?.unit_type || "").toLowerCase(),
      })),
    [orgUnits]
  );

  const isDepartment = (unit) => {
    if (!unit) return false;
    if (unit.unit_type === "department") return true;
    return unit.parent_id === null || unit.parent_id === 0;
  };

  const departments = useMemo(
    () =>
      normalizedUnits
        .filter((u) => isDepartment(u))
        .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "vi")),
    [normalizedUnits]
  );

  const teams = useMemo(
    () =>
      normalizedUnits
        .filter((u) => !isDepartment(u))
        .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "vi")),
    [normalizedUnits]
  );

  const currentTeams = useMemo(() => {
    const deptId = toNumOrNull(form.department_id);
    if (!deptId) return [];
    return teams.filter((t) => Number(t.parent_id) === deptId);
  }, [form.department_id, teams]);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && data) {
      const selectedUnitId = toNumOrNull(data.org_unit_id);
      const selectedUnit = normalizedUnits.find((u) => u.id === selectedUnitId);

      const departmentId = selectedUnit
        ? isDepartment(selectedUnit)
          ? selectedUnit.id
          : selectedUnit.parent_id
        : "";

      const teamId = selectedUnit && !isDepartment(selectedUnit) ? selectedUnit.id : "";

      let jobTitleId = "";
      if (data.job_title_id) {
        jobTitleId = data.job_title_id;
      } else if (data.job_title && jobTitles.length > 0) {
        const matched = jobTitles.find(
          (j) => j.name.toLowerCase() === data.job_title.toLowerCase()
        );
        if (matched) {
          jobTitleId = matched.id;
        }
      }

      setForm({
        id: data.id ?? null,
        username: data.username ?? "",
        password: "",
        full_name: data.full_name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        gender: data.gender ?? "Nam",
        birth_date: toInputDate(data.birth_date),
        job_title: data.job_title ?? "",
        job_title_id: jobTitleId,
        role: normalizeRole(data.role),
        department_id: departmentId ?? "",
        team_id: teamId ?? "",
        org_unit_id: selectedUnitId ?? "",
        is_active: typeof data.is_active === "boolean" ? data.is_active : true,
      });
    } else {
      setForm(initialForm);
    }
  }, [open, mode, data, normalizedUnits, jobTitles]);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleDepartmentChange = (value) => {
    setForm((p) => ({
      ...p,
      department_id: value,
      team_id: "",
      org_unit_id: value,
    }));
  };

  const handleTeamChange = (value) => {
    setForm((p) => ({
      ...p,
      team_id: value,
      org_unit_id: value || p.department_id || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const selectedOrgUnitId = toNumOrNull(form.team_id) ?? toNumOrNull(form.department_id);

      const payload = {
        ...form,
        birth_date: form.birth_date === "" ? null : form.birth_date,
        org_unit_id: selectedOrgUnitId,
        role: normalizeRole(form.role),
        job_title_id: toNumOrNull(form.job_title_id),
      };

      delete payload.department_id;
      delete payload.team_id;
      delete payload.job_title;

      if (mode === "edit" && !payload.password) {
        delete payload.password;
      }

      await onSubmit?.(payload);
      onClose?.();
    } catch (err) {
      alert(err?.response?.data?.msg || "Có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-gray-100 border border-gray-300 rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-5">
            <div>
              <h2 className="text-3xl font-black text-gray-800 uppercase italic tracking-tighter">
                {mode === "add" ? "Tạo hồ sơ mới" : "Cập nhật nhân sự"}
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">
                {mode === "edit" ? `Mã định danh: #${form.id}` : "Đang khởi tạo tài khoản"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-blue-600 text-gray-800 hover:text-white transition-all"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Cột trái */}
            <div className="space-y-5">
              <h3 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] border-l-2 border-blue-500 pl-3">
                Thông tin định danh
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Username</label>
                  <input
                    value={form.username}
                    disabled={mode === "edit"}
                    onChange={(e) => setField("username", e.target.value)}
                    className="w-full bg-white border border-gray-300 p-3.5 rounded-lg text-gray-800 outline-none focus:border-blue-500 disabled:opacity-40 transition-all font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Mật khẩu</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder={mode === "edit" ? "Để trống nếu không đổi" : "Nhập mật khẩu..."}
                    className="w-full bg-white border border-gray-300 p-3.5 rounded-lg text-gray-800 outline-none focus:border-blue-500 transition-all"
                    required={mode === "add"}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="example@email.com"
                    className="w-full bg-white border border-gray-300 p-3.5 rounded-lg text-gray-800 outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="0xxxxxxxxx"
                    className="w-full bg-white border border-gray-300 p-3.5 rounded-lg text-gray-800 outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Vai trò</label>
                    <select
                      value={form.role}
                      onChange={(e) => setField("role", e.target.value)}
                      className="w-full bg-white border border-gray-300 p-3.5 rounded-lg text-gray-800 outline-none focus:border-blue-500 font-bold"
                    >
                      <option value="user">USER</option>
                      <option value="manager">MANAGER</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Trạng thái</label>
                    <select
                      value={form.is_active ? "1" : "0"}
                      onChange={(e) => setField("is_active", e.target.value === "1")}
                      className="w-full bg-white border border-gray-300 p-3.5 rounded-lg text-gray-800 outline-none focus:border-blue-500 font-bold"
                    >
                      <option value="1">HOẠT ĐỘNG</option>
                      <option value="0">TẠM KHOÁ</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải */}
            <div className="space-y-5">
              <h3 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] border-l-2 border-blue-500 pl-3">
                Hồ sơ cá nhân
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Họ và tên</label>
                  <input
                    value={form.full_name}
                    onChange={(e) => setField("full_name", e.target.value)}
                    className="w-full bg-white border border-gray-300 p-3.5 rounded-lg text-gray-800 outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Giới tính</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setField("gender", e.target.value)}
                      className="w-full bg-white border border-gray-300 p-3.5 rounded-lg text-gray-800 outline-none focus:border-blue-500 font-bold"
                    >
                      <option value="Nam">NAM</option>
                      <option value="Nu">NỮ</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Ngày sinh</label>
                    <input
                      type="date"
                      value={form.birth_date}
                      onChange={(e) => setField("birth_date", e.target.value)}
                      className="w-full bg-white border border-gray-300 p-3 rounded-lg text-gray-800 outline-none text-xs focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Phòng ban</label>
                  <select
                    value={form.department_id ?? ""}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    className="w-full bg-white border border-gray-300 p-3.5 rounded-lg text-gray-800 outline-none focus:border-blue-500 font-bold"
                    required
                  >
                    <option value="">-- CHỌN PHÒNG BAN --</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Tổ</label>
                  <select
                    value={form.team_id ?? ""}
                    onChange={(e) => handleTeamChange(e.target.value)}
                    className="w-full bg-white border border-gray-300 p-3.5 rounded-lg text-gray-800 outline-none focus:border-blue-500 font-bold disabled:opacity-50"
                    disabled={!form.department_id}
                  >
                    <option value="">
                      {!form.department_id
                        ? "-- CHỌN PHÒNG BAN TRƯỚC --"
                        : currentTeams.length === 0
                          ? "-- PHÒNG NÀY CHƯA CÓ TỔ --"
                          : "-- CHỌN TỔ (TUỲ CHỌN) --"}
                    </option>
                    {currentTeams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Chức danh công việc</label>
                  <select
                    value={form.job_title_id ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setField("job_title_id", value);
                      // Also update the display job_title
                      const selected = jobTitles.find(j => j.id == value);
                      setField("job_title", selected ? selected.name : "");
                    }}
                    className="w-full bg-white border border-gray-300 p-3.5 rounded-lg text-gray-800 outline-none focus:border-blue-500 font-bold disabled:opacity-50"
                    disabled={jobTitles.length === 0}
                  >
                    <option value="">
                      {jobTitleError
                        ? "LỖI TẢI DANH SÁCH"
                        : jobTitles.length === 0
                          ? "ĐANG TẢI..."
                          : "-- CHỌN CHỨC DANH --"}
                    </option>
                    {jobTitles.map((jt) => (
                      <option key={jt.id} value={jt.id}>
                        {jt.name}
                      </option>
                    ))}
                  </select>
                  {jobTitleError && (
                    <p className="text-xs text-red-500 mt-1">{jobTitleError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-12 gap-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 font-black text-xs uppercase tracking-widest transition-colors"
              disabled={saving}
            >
              Huỷ bỏ
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-lg font-black shadow-xl shadow-blue-500/20 uppercase tracking-widest text-sm disabled:opacity-50 transition-all active:scale-95"
            >
              {saving ? "ĐANG XỬ LÝ..." : mode === "add" ? "XÁC NHẬN TẠO" : "LƯU THAY ĐỔI"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
