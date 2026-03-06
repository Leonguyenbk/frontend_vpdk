import { Link, useOutletContext } from "react-router-dom";
import { Users, ClipboardList, Building2 } from "lucide-react";

export default function ManagerDashboard() {
  const { user } = useOutletContext();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">
          Bảng điều khiển quản lý
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Theo dõi nhân sự trong phòng và điều phối công việc.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/manager/team"
          className="group rounded-3xl border border-white/10 bg-zinc-900 p-6 hover:border-red-500/40 hover:bg-zinc-900/80 transition-all"
        >
          <div className="flex items-center gap-3 text-zinc-400 text-xs uppercase tracking-widest font-bold">
            <Users size={16} />
            Nhân sự
          </div>

          <h2 className="text-2xl font-black mt-3 text-white group-hover:text-red-500 transition-colors">
            Nhân viên trực thuộc phòng
          </h2>

          <p className="text-zinc-400 mt-3 text-sm">
            Xem danh sách toàn bộ nhân viên trong đơn vị và theo dõi thông tin công tác.
          </p>
        </Link>

        <Link
          to="/manager/assignments"
          className="group rounded-3xl border border-white/10 bg-zinc-900 p-6 hover:border-red-500/40 hover:bg-zinc-900/80 transition-all"
        >
          <div className="flex items-center gap-3 text-zinc-400 text-xs uppercase tracking-widest font-bold">
            <ClipboardList size={16} />
            Công việc
          </div>

          <h2 className="text-2xl font-black mt-3 text-white group-hover:text-red-500 transition-colors">
            Quản lý giao việc
          </h2>

          <p className="text-zinc-400 mt-3 text-sm">
            Tạo nhiệm vụ, phân công công việc và theo dõi tiến độ thực hiện.
          </p>
        </Link>
      </div>

      {/* Current unit */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
        <Building2 size={18} className="text-red-500" />

        <span>
          Đơn vị hiện tại:{" "}
          <span className="text-zinc-100 font-semibold">
            {user?.org_unit?.name || "Chưa cập nhật"}
          </span>
        </span>
      </div>
    </div>
  );
}