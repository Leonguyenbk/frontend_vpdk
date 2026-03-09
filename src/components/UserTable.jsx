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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
      <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-500 text-[10px] uppercase font-bold tracking-widest">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Nhân viên / Liên hệ</th>
            <th className="p-4">Vị trí / Phòng ban</th>
            <th className="p-4 text-center">Vai trò</th>
            <th className="p-4 text-right">Hành động</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="5" className="p-10 text-center text-gray-500">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-10 text-center text-gray-500">
                Không có kết quả.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(u)}
              >
                <td className="p-4 font-mono text-gray-500 text-sm">#{u.id}</td>

                <td className="p-4">
                  <div className="font-bold text-gray-900">{u.full_name || u.username}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </td>

                <td className="p-4">
                  <div className="text-sm text-gray-700 font-medium">
                    {u.job_title_name || u.job_title || ""}
                  </div>
                  <div className="text-[11px] text-blue-500 font-bold uppercase">
                    {u.org_unit?.name || "Lao động tự do"}
                  </div>
                </td>

                <td className="p-4 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      u.role === "admin"
                        ? "bg-blue-100 text-blue-600 border-blue-200"
                        : "bg-gray-200 text-gray-600 border-gray-300"
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