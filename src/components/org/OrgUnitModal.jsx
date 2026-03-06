import React, { useEffect, useMemo, useState } from "react";

const empty = { id: null, name: "", parent_id: null, unit_type: "department" };

export default function OrgUnitModal({
  open,
  mode = "add",          // add | edit
  data = empty,
  departments = [],
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && data) {
      setForm({
        id: data.id ?? null,
        name: data.name ?? "",
        parent_id: data.parent_id ?? null,
        unit_type: data.unit_type ?? (data.parent_id ? "team" : "department"),
      });
    } else {
      setForm({
        id: null,
        name: data?.name ?? "",
        parent_id: data?.parent_id ?? null, // nếu mở modal tạo tổ, parent_id đã set sẵn
        unit_type: data?.unit_type ?? (data?.parent_id ? "team" : "department"),
      });
    }
  }, [open, mode, data]);

  const title = useMemo(() => {
    if (mode === "edit") return "Cập nhật đơn vị";
    return form.parent_id ? "Tạo tổ mới" : "Tạo phòng mới";
  }, [mode, form.parent_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const payload = {
        id: form.id,
        name: form.name.trim(),
        // parent_id: null hoặc number
        parent_id:
          form.parent_id === null || form.parent_id === "" ? null : Number(form.parent_id),
      };

      await onSubmit?.(payload);
      onClose?.();
    } catch (err) {
      alert(err?.response?.data?.msg || "Thao tác thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-4 mb-6">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
              {title}
            </h2>
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.25em] mt-2">
              ORG_UNIT_FORM
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2 opacity-70">
              Tên đơn vị
            </label>
            <input
              autoFocus
              required
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-red-600 transition-all font-bold placeholder:text-zinc-700"
              placeholder="Ví dụ: Phòng Kế Toán, Tổ Bảo Trì..."
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          {/* Cho phép chọn phòng cha khi là tổ (và cả edit) */}
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2 opacity-70">
              Trực thuộc phòng
            </label>
            <select
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-red-600 transition-all font-bold"
              value={form.parent_id ?? ""}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  parent_id: e.target.value === "" ? null : e.target.value,
                }))
              }
            >
              <option value="">(Không trực thuộc) → Phòng cấp 1</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {form.parent_id && (
              <div className="mt-3 p-4 bg-red-600/5 rounded-2xl border border-red-500/10 flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-black text-red-500 uppercase block mb-1">
                    Trực thuộc phòng
                  </div>
                  <div className="text-white font-black text-sm uppercase">
                    {departments.find((d) => Number(d.id) === Number(form.parent_id))?.name}
                  </div>
                </div>
                <div className="text-xs">🔗</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-10 gap-6">
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
            disabled={saving}
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-red-900/20 uppercase tracking-widest text-sm disabled:opacity-60"
          >
            {saving ? "ĐANG LƯU..." : "Xác nhận lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}