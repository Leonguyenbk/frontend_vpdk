import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Building2,
  LogOut,
  Settings2,
} from "lucide-react";
import authApi from "../api/authApi";
import axiosClient from "../api/axiosClient";

const NAV_ITEMS = [
  { to: "/admin", label: "Tổng quan", end: true, icon: LayoutDashboard },
  { to: "/admin/users", label: "Quản lý người dùng", icon: Users },
  { to: "/admin/org-units", label: "Quản lý đơn vị & tổ", icon: Building2 },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await axiosClient.get("/auth/me");
      setUser(data);
    } catch (err) {
      console.error("Lỗi lấy hồ sơ:", err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 text-gray-900 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 flex flex-col border-r border-gray-200 bg-white shadow-2xl">
        <div className="px-6 py-8">
          <div className="text-[10px] text-blue-500 font-black uppercase tracking-[0.4em] mb-1">
            Quản trị
          </div>
          <div className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">
            ADMIN PANEL
          </div>
        </div>

        {/* User card */}
        <div className="px-4 pb-4">
          <Link
            to="/admin"
            className="flex items-center gap-3 rounded-2xl bg-gray-100 border border-gray-200 px-3 py-3 hover:bg-gray-200 hover:border-gray-300 transition-all group"
          >
            <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-blue-900/30">
              {avatarText}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-500 transition-colors">
                {displayName}
              </div>
              <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider truncate">
                {subTitle}
              </div>
            </div>

            <ShieldCheck size={18} className="text-blue-500 shrink-0" />
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border border-transparent ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-blue-200 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={20} strokeWidth={2.2} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="mt-auto p-3 border-t border-gray-200 space-y-3">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border border-transparent text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={20} strokeWidth={2.2} />
            {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
          </button>

          <div className="pt-2 text-[10px] text-gray-500 text-center uppercase font-black tracking-widest">
            Build v1.0.2
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="shrink-0 h-20 border-b border-gray-200 bg-white flex items-center justify-between px-8 backdrop-blur-md">
          <div className="text-sm text-gray-600 font-bold uppercase tracking-widest italic flex items-center gap-2">
            <Settings2 size={16} className="text-blue-500" />
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            Khu vực quản trị hệ thống
          </div>

          <Link
            to="/admin"
            className="flex items-center gap-4 p-1.5 pr-4 rounded-2xl transition-all border border-transparent hover:border-gray-300 hover:bg-gray-100 group"
          >
            <div className="text-right hidden sm:block">
              <div className="text-sm font-black text-gray-900 group-hover:text-blue-500 transition-colors uppercase tracking-tight">
                {displayName}
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                {subTitle}
              </div>
            </div>

            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-blue-900/40 group-active:scale-90 transition-all">
              {avatarText}
            </div>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-zinc-950/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}