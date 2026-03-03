import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient"; // ✅ dùng axiosClient

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchUsers = async () => {
    try {
      const data = await axiosClient.get("/admin/users"); // ✅ không cần full URL
      setUsers(data);                                      // ✅ không cần .data
      setLoading(false);
    } catch (err) {
      console.error("Lỗi:", err.response?.status, err.response?.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-zinc-100">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-red-500 tracking-tighter uppercase">ADMIN PANEL</h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Quản trị viên: <span className="text-zinc-100 font-mono">{loggedInUser?.username}</span>
          </p>
        </div>
        <button 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-all font-semibold"
          onClick={() => alert("Chức năng thêm user đang phát triển")}
        >
          + Thêm User Mới
        </button>
      </div>

      <div className="overflow-x-auto bg-zinc-900 rounded-lg border border-zinc-800 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-800 text-zinc-300 uppercase text-xs tracking-widest">
              <th className="p-4 border-b border-zinc-700">ID</th>
              <th className="p-4 border-b border-zinc-700">Username</th>
              <th className="p-4 border-b border-zinc-700">Họ tên</th>
              <th className="p-4 border-b border-zinc-700">Email</th>
              <th className="p-4 border-b border-zinc-700 text-center">Vai trò</th>
              <th className="p-4 border-b border-zinc-700 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr><td colSpan="6" className="p-10 text-center text-zinc-500">Đang tải dữ liệu...</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 font-mono text-zinc-500">{u.id}</td>
                <td className="p-4 font-semibold">{u.username}</td>
                <td className="p-4 text-zinc-300">{u.full_name || "N/A"}</td>
                <td className="p-4 text-zinc-400 italic">{u.email}</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    u.role === 'admin' ? 'bg-red-900/30 text-red-500 border border-red-800' : 'bg-blue-900/30 text-blue-400 border border-blue-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {u.is_active ? (
                    <span className="text-green-500">● Active</span>
                  ) : (
                    <span className="text-zinc-600">○ Inactive</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}