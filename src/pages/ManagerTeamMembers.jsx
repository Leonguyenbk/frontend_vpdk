import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { UserRound, Briefcase, Eye } from "lucide-react";
import { getManagerUsers } from "../api/managerApi";
import { getOrgUnits } from "../api/orgUnitApi";
import UserDrawer from "../components/UserDrawer";

const normalize = (v) => (v ?? "").toString().trim().toLowerCase();

const pickList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.users)) return payload.users;
  return [];
};

export default function ManagerTeamMembers() {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [orgUnits, setOrgUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({ q: "", org_unit_id: "" });

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError("");

      try {
        const [list, orgs] = await Promise.all([
          getManagerUsers(),
          getOrgUnits(),
        ]);
        
        if (!mounted) return;
        setMembers(Array.isArray(list) ? list : []);
        setOrgUnits(pickList(orgs));
      } catch (err) {
        if (!mounted) return;

        if (err?.response?.status === 403) {
          setError(err?.response?.data?.msg || "Bạn không có quyền truy cập chức năng này.");
        } else {
          setError(err?.response?.data?.msg || "Không tải được danh sách nhân viên.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  // Filter client-side
  const visibleUsers = useMemo(() => {
    const q = normalize(filters.q);
    const orgId = filters.org_unit_id ? String(filters.org_unit_id) : "";

    let list = [...members];

    if (q) {
      list = list.filter((u) => {
        const hay = [
          u.username,
          u.full_name,
          u.email,
          u.phone,
          u.job_title,
          u.org_unit?.name,
        ]
          .map(normalize)
          .join(" ");
        return hay.includes(q);
      });
    }

    if (orgId) {
      // Build hierarchical org unit filter
      // Include selected org unit and all its child units
      const selectedOrgId = Number(orgId);
      
      // Find all child org units recursively
      const getChildOrgUnitIds = (parentId) => {
        const children = new Set([parentId]);
        const frontier = [parentId];
        
        while (frontier.length > 0) {
          const current = frontier.pop();
          const childOrgs = orgUnits.filter((o) => o.parent_id === current);
          
          for (const child of childOrgs) {
            if (!children.has(child.id)) {
              children.add(child.id);
              frontier.push(child.id);
            }
          }
        }
        
        return children;
      };
      
      const targetOrgIds = getChildOrgUnitIds(selectedOrgId);
      list = list.filter((u) => targetOrgIds.has(u.org_unit_id));
    }

    list.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
    return list;
  }, [members, filters, orgUnits]);

  const openUserDrawer = (member) => {
    setSelectedUser(member);
    setDrawerOpen(true);
  };

  const handleAssignTask = (member) => {
    navigate(`/manager/assignments/create?userId=${member.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
            Danh sách nhân viên phòng ban
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý nhân viên trực thuộc phòng / tổ của bạn
          </p>
        </div>

        <div className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">
          {visibleUsers.length} / {members.length}
        </div>
      </div>

      {/* Filters */}
      {!loading && !error && members.length > 0 && (
        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex flex-1 gap-3 flex-col md:flex-row">
            <input
              placeholder="Tìm theo tên / username / email / SĐT..."
              className="w-full md:w-[420px] bg-gray-50 border border-gray-300 px-4 py-2.5 rounded-lg text-gray-900 outline-none focus:border-blue-600 transition-all"
              value={filters.q}
              onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
            />
            <select
              className="w-full md:w-[320px] bg-gray-50 border border-gray-300 px-4 py-2.5 rounded-lg text-gray-900 outline-none focus:border-blue-600 transition-all"
              value={filters.org_unit_id}
              onChange={(e) => setFilters((p) => ({ ...p, org_unit_id: e.target.value }))}
            >
              <option value="">Tất cả phòng ban / tổ</option>
              {orgUnits.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setFilters({ q: "", org_unit_id: "" })}
              className="bg-gray-100 hover:bg-gray-200 border border-gray-300 px-4 py-2.5 rounded-lg font-bold text-gray-900"
            >
              Xóa lọc
            </button>
          </div>

          <div className="text-gray-500 text-sm">
            Kết quả: <span className="text-gray-900 font-bold">{visibleUsers.length}</span> /{" "}
            <span>{members.length}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-500">
          Đang tải danh sách...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
          {error}
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
          Không có nhân viên nào trong phòng ban này.
        </div>
      ) : visibleUsers.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
          Không có kết quả tìm kiếm.
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-500 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-4">Nhân viên</th>
                <th className="p-4">Liên hệ</th>
                <th className="p-4">Chức danh</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {visibleUsers.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openUserDrawer(m)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-600/90 flex items-center justify-center text-white font-black shadow-lg shadow-blue-900/20">
                        {(m.full_name || m.username || "?").charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="font-semibold text-gray-900">
                          {m.full_name || m.username}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <UserRound size={12} />
                          @{m.username}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm text-gray-700">{m.email || "---"}</td>
                  <td className="p-4 text-sm text-gray-700">{m.job_title || "---"}</td>

                  <td className="p-4">
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-700">
                      {m.role || "USER"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openUserDrawer(m);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-xs font-bold text-gray-900 hover:bg-gray-200 transition-all"
                      >
                        <Eye size={14} />
                        Xem
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssignTask(m);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                      >
                        <Briefcase size={14} />
                        Giao việc
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UserDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={selectedUser}
        readOnly
      />
    </div>
  );
}