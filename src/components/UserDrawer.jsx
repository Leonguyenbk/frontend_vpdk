import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Pencil,
  FileDown,
  Building2,
  Mail,
  Phone,
  CalendarDays,
  UserRound,
} from "lucide-react";

export default function UserDrawer({
  open,
  onClose,
  user,
  onEdit,
  readOnly = false,
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const [displayUser, setDisplayUser] = useState(user);
  const [switching, setSwitching] = useState(false);
  const prevUserRef = useRef(null);

  // Drawer slide in
  useEffect(() => {
    if (!open) return;
    setMounted(true);
    setVisible(false);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // Drawer slide out + unmount
  useEffect(() => {
    if (open || !mounted) return;
    setVisible(false);
    const t = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(t);
  }, [open, mounted]);

  // Content fade khi đổi user
  useEffect(() => {
    if (!open || !user) return;

    if (!prevUserRef.current || prevUserRef.current.id === user.id) {
      setDisplayUser(user);
      prevUserRef.current = user;
      return;
    }

    setSwitching(true);
    const t = setTimeout(() => {
      setDisplayUser(user);
      prevUserRef.current = user;
      setSwitching(false);
    }, 120);

    return () => clearTimeout(t);
  }, [user, open]);

  if (!mounted) return null;

  return (
    <div className="fixed right-0 top-0 z-[150] h-full w-full sm:w-[500px] pointer-events-auto">
      <div
        className={`h-full bg-white border-l border-gray-200 shadow-2xl transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <div className="text-[10px] text-red-500 font-black uppercase tracking-widest">
              Chi tiết nhân sự
            </div>
            <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">
              {displayUser?.username || displayUser?.full_name || "Không rõ"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          className={`p-6 space-y-6 transition-all duration-150 ${
            switching ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0"
          }`}
        >
          <div className="rounded-3xl bg-gray-50 border border-gray-200 p-5 space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-red-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-red-900/30">
                {(displayUser?.full_name || displayUser?.username || "?")[0]?.toUpperCase?.() || "?"}
              </div>

              <div>
                <div className="font-bold text-gray-900 text-lg">
                  {displayUser?.full_name || "Chưa cập nhật"}
                </div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-tighter italic">
                  {displayUser?.job_title || "Chức danh chưa cập nhật"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-gray-200 pt-4">
              <InfoItem
                icon={Building2}
                label="Phòng ban"
                value={displayUser?.org_unit?.name || "Chưa phân bổ"}
              />
              <InfoItem
                icon={UserRound}
                label="Giới tính"
                value={displayUser?.gender || "Chưa cập nhật"}
              />
              <InfoItem
                icon={Mail}
                label="Email"
                value={displayUser?.email}
                className="break-all"
              />
              <InfoItem
                icon={Phone}
                label="Điện thoại"
                value={displayUser?.phone}
              />
              <InfoItem
                icon={CalendarDays}
                label="Ngày sinh"
                value={formatDate(displayUser?.birth_date)}
              />
            </div>
          </div>

          {!readOnly && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onEdit?.(displayUser)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold transition-all border border-gray-200 text-gray-900"
                type="button"
              >
                <Pencil size={18} />
                Chỉnh sửa
              </button>

              <button
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold shadow-lg shadow-red-900/20 text-white transition-all"
                type="button"
              >
                <FileDown size={18} />
                Xuất hồ sơ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "N/A";
  const d = new Date(value);
  if (isNaN(d)) return value;
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

function InfoItem({ icon: Icon, label, value, className = "" }) {
  return (
    <div className="rounded-2xl bg-gray-100 border border-gray-200 p-3">
      <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase mb-1">
        {Icon && <Icon size={14} />}
        <span>{label}</span>
      </div>
      <div className={`text-gray-900 ${className}`}>{value || "N/A"}</div>
    </div>
  );
}