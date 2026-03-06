import { Navigate, Outlet } from "react-router-dom";

export default function RequireRole({ allow = [] }) {
  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = String(user.role || "").toLowerCase();
  const allowedRoles = allow.map((r) => String(r || "").toLowerCase());

  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />;

  return <Outlet />;
}
