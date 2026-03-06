import React from "react";
import UserActions from "./UserActions";

export default function UserTable({
  loading,
  users,
  onRowClick,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl">
      <table className="w-full text-left">
        <thead className="bg-zinc-800/50 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Nhân viên / Liên hệ</th>
            <th className="p-4">Vị trí / Phòng ban</th>
            <th className="p-4 text-center">Vai trò</th>
            <th className="p-4 text-right">Hành động</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-800">
          {loading ? (
            <tr>
              <td colSpan="5" className="p-10 text-center text-zinc-500">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-10 text-center text-zinc-500">
                Không có kết quả.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(u)}
              >
                <td className="p-4 font-mono text-zinc-600 text-sm">#{u.id}</td>

                <td className="p-4">
                  <div className="font-bold text-zinc-100">{u.full_name || u.username}</div>
                  <div className="text-xs text-zinc-500">{u.email}</div>
                </td>

                <td className="p-4">
                  <div className="text-sm text-zinc-300 font-medium">{u.job_title || "N/A"}</div>
                  <div className="text-[11px] text-red-500/70 font-bold uppercase">
                    {u.org_unit?.name || "Lao động tự do"}
                  </div>
                </td>

                <td className="p-4 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      u.role === "admin"
                        ? "bg-red-950/30 text-red-500 border-red-900/50"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}
                  >
                    {String(u.role || "").toUpperCase()}
                  </span>
                </td>

                <td className="p-0">
                  <UserActions user={u} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}