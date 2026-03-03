import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

import AdminDashboard from "./pages/AdminDashboard"; // tạm dùng luôn
import UserDashboard from "./pages/UserDashboard";   // tạm dùng luôn

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* USER */}
      <Route element={<RequireRole allow={["user", "admin"]} />}>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
        </Route>
      </Route>

      {/* ADMIN */}
      <Route element={<RequireRole allow={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminDashboard />} />
          {/* sau này thêm route con: /admin/kpi... */}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}