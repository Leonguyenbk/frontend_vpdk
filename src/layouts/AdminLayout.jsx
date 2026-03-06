import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import authApi from "../api/authApi";

const NAV_ITEMS = [
  { to: "/admin", label: "Tổng quan", end: true, icon: "▦" },
  { to: "/admin/users", label: "Quản lý user", icon: "👤" },
  { to: "/admin/org-units", label: "Quản lý đơn vị & Tổ", icon: "🏢" },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border border-transparent ${
    isActive
      ? "bg-red-600/10 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
  }`;

export default function AdminLayout() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const displayName = user?.full_name || user?.username || "Tài khoản";
  const subTitle = user?.job_title || "Quản trị hệ thống";
  const avatarText = (displayName || "A").charAt(0).toUpperCase();

  const handleLogout = async () => {
    if (loggingOut) return;

    const ok = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (!ok) return;

    try {
      setLoggingOut(true);
      await authApi.logout();
    } catch (err) {
      console.error("Lỗi đăng xuất:", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 flex flex-col border-r border-white/5 bg-zinc-900/60 shadow-2xl">

        <div className="px-6 py-8">
          <div className="text-[10px] text-red-500 font-black uppercase tracking-[0.4em] mb-1">
            Quản trị
          </div>
          <div className="text-2xl font-black text-white italic uppercase tracking-tighter">
            ADMIN PANEL
          </div>
        </div>

        {/* User card */}
        <div className="px-4 pb-4">
          <Link
            to="/admin"
            className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-3 py-3 hover:bg-white/10 transition-all"
          >
            <div className="h-11 w-11 rounded-xl bg-red-600 flex items-center justify-center text-sm font-black text-white">
              {avatarText}
            </div>

            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">
                {displayName}
              </div>
              <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider truncate">
                {subTitle}
              </div>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout luôn nằm đáy */}
        <div className="mt-auto p-3 border-t border-white/5 space-y-3">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border border-transparent text-zinc-500 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-50"
          >
            <span className="text-xl">{loggingOut ? "…" : "⏻"}</span>
            {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
          </button>

          <div className="pt-2 text-[10px] text-zinc-700 text-center uppercase font-black tracking-widest">
            Build v1.0.2
          </div>
        </div>

      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="shrink-0 h-20 border-b border-white/5 bg-zinc-900/20 flex items-center justify-between px-8 backdrop-blur-md">
          <div className="text-sm text-zinc-500 font-bold uppercase tracking-widest italic flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
            Khu vực quản trị hệ thống
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-sm font-black text-white uppercase tracking-tight">
              {displayName}
            </div>
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">
              {subTitle}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-zinc-950/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
