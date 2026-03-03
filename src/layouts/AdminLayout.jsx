import { NavLink, Outlet, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

const linkClass = ({ isActive }) =>
  `block px-3 py-2 rounded-xl border border-transparent hover:bg-zinc-900 ${
    isActive ? "bg-zinc-900 border-zinc-800" : ""
  }`;

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = async () => {
    await authApi.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-800 p-4">
        <div className="mb-6">
          <div className="text-lg font-semibold">ADMIN</div>
          <div className="text-xs text-zinc-400 mt-1">
            {user.full_name || user.username || "Tài khoản"}
          </div>
        </div>

        <nav className="space-y-2">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            Quản lý user
          </NavLink>

          {/* sau này thêm: org unit, kpi... */}
          {/* <NavLink to="/admin/org-units" className={linkClass}>Đơn vị</NavLink> */}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-xl border border-zinc-800 px-3 py-2 hover:bg-zinc-900"
        >
          Đăng xuất
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}