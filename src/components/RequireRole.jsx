import { Navigate, Outlet } from "react-router-dom";

export default function RequireRole({ allow = [] }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/login" replace />; // hoặc "/user"

  return <Outlet />;
}