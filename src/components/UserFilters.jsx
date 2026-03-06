import React from "react";

export default function UserFilters({ filters, setFilters, orgUnits, count, total }) {
  return (
    <div className="mb-6 bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div className="flex flex-1 gap-3 flex-col md:flex-row">
        <input
          placeholder="Tìm theo tên / username / email / SĐT..."
          className="w-full md:w-[420px] bg-zinc-800 border border-zinc-700 px-4 py-2.5 rounded-lg text-white outline-none focus:border-red-600 transition-all"
          value={filters.q}
          onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
        />
        <select
          className="w-full md:w-[320px] bg-zinc-800 border border-zinc-700 px-4 py-2.5 rounded-lg text-white outline-none focus:border-red-600 transition-all"
          value={filters.org_unit_id}
          onChange={(e) => setFilters((p) => ({ ...p, org_unit_id: e.target.value }))}
        >
          <option value="">Tất cả phòng ban</option>
          {orgUnits.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => setFilters({ q: "", org_unit_id: "" })}
          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2.5 rounded-lg font-bold"
        >
          Xóa lọc
        </button>
      </div>

      <div className="text-zinc-500 text-sm">
        Kết quả: <span className="text-zinc-200 font-bold">{count}</span> /{" "}
        <span>{total}</span>
      </div>
    </div>
  );
}