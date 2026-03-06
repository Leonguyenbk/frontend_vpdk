import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { UserRound, Briefcase, Eye } from "lucide-react";
import { getManagerUsers } from "../api/managerApi";
import UserDrawer from "../components/UserDrawer";

export default function ManagerTeamMembers() {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError("");

      try {
        const list = await getManagerUsers();
        if (!mounted) return;
        setMembers(Array.isArray(list) ? list : []);
      } catch (err) {
        if (!mounted) return;

        if (err?.response?.status === 400) {
          setError(err?.response?.data?.msg || "Tài khoản quản lý chưa được gán phòng ban.");
        } else if (err?.response?.status === 403) {
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

  const countLabel = useMemo(() => `${members.length} nhân viên`, [members.length]);

  const openUserDrawer = (member) => {
    setSelectedUser(member);
    setDrawerOpen(true);
  };

  const handleAssignTask = (member) => {
    navigate(`/manager/assignments/create?userId=${member.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Nhân viên trực thuộc phòng
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Lọc theo đơn vị: {user?.org_unit?.name || "Chưa xác định"}
          </p>
        </div>

        <div className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500">
          {countLabel}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8 text-zinc-500">
          Đang tải danh sách...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-red-200">
          {error}
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8 text-zinc-400">
          Không có nhân viên nào trong phòng ban này.
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-zinc-900 text-zinc-500 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-4">Nhân viên</th>
                <th className="p-4">Liên hệ</th>
                <th className="p-4">Chức danh</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 bg-zinc-950/40">
              {members.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => openUserDrawer(m)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-red-600/90 flex items-center justify-center text-white font-black shadow-lg shadow-red-900/20">
                        {(m.full_name || m.username || "?").charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="font-semibold text-zinc-100">
                          {m.full_name || m.username}
                        </div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1">
                          <UserRound size={12} />
                          @{m.username}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm text-zinc-300">{m.email || "---"}</td>
                  <td className="p-4 text-sm text-zinc-300">{m.job_title || "---"}</td>

                  <td className="p-4">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-zinc-300">
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
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-200 hover:bg-white/10 transition-all"
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
                        className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 transition-all shadow-lg shadow-red-900/20"
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