import React from "react";

export default function OrgUnitCard({ dept, teams, onAddTeam, onEdit, onDelete }) {
  return (
    <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      {/* Header phòng */}
      <div className="p-6 bg-white/[0.03] flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-2xl shadow-inner text-red-500">
            🏢
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              {dept.name}
            </h3>
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest italic">
              Phòng ban cấp 1
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onAddTeam?.(dept)}
            className="bg-zinc-800 hover:bg-white text-white hover:text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg"
          >
            + Thêm Tổ
          </button>
          <div className="h-8 w-[1px] bg-white/10 mx-1"></div>
          <button
            onClick={() => onEdit?.(dept)}
            className="text-zinc-500 hover:text-blue-500 font-bold text-xs uppercase"
          >
            Sửa
          </button>
          <button
            onClick={() => onDelete?.(dept.id)}
            className="text-zinc-500 hover:text-red-500 font-bold text-xs uppercase"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Body tổ */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-black/20">
        {teams.length === 0 ? (
          <div className="col-span-full py-6 text-center border-2 border-dashed border-white/5 rounded-2xl">
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] italic">
              Không có tổ trực thuộc
            </span>
          </div>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="group bg-zinc-800/40 border border-white/5 p-4 rounded-2xl flex justify-between items-center hover:border-red-500/50 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
                <span className="text-zinc-200 font-bold text-sm tracking-tight">
                  {team.name}
                </span>
              </div>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit?.(team)}
                  className="text-[10px] text-zinc-500 hover:text-white font-bold"
                >
                  SỬA
                </button>
                <button
                  onClick={() => onDelete?.(team.id)}
                  className="text-[10px] text-zinc-500 hover:text-red-500 font-bold"
                >
                  XÓA
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}