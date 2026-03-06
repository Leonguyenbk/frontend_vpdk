import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

import RequireRole from "./components/RequireRole";

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import ManagerLayout from "./layouts/ManagerLayout";

import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import OrgUnitManager from "./pages/OrgUnitManager";
import UserProfile from "./pages/UserProfile";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerTeamMembers from "./pages/ManagerTeamMembers";
import ManagerAssignments from "./pages/ManagerAssignments";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<RequireRole allow={["user"]} />}>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Route>

      <Route element={<RequireRole allow={["manager"]} />}>
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="team" element={<ManagerTeamMembers />} />
          <Route path="assignments" element={<ManagerAssignments />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Route>

      <Route element={<RequireRole allow={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminDashboard />} />
          <Route path="org-units" element={<OrgUnitManager />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
