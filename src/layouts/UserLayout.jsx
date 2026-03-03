import { Outlet, NavLink } from "react-router-dom";
import authApi from "../api/authApi";

export default function UserLayout() {
  const logout = async () => {
    await authApi.logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 p-4 flex items-center justify-between">
        <div className="font-semibold">User</div>
        <div className="flex gap-2">
          <NavLink className="px-3 py-2 rounded-lg hover:bg-zinc-900" to="/user">
            Trang chủ
          </NavLink>
          <button
            onClick={logout}
            className="px-3 py-2 rounded-lg border border-zinc-800 hover:bg-zinc-900"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
