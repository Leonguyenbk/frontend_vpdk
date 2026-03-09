import React from "react";

export default function UserFilters({ filters, setFilters, orgUnits, count, total }) {
  return (
    <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div className="flex flex-1 gap-3 flex-col md:flex-row">
        <input
          placeholder="Tìm theo tên / username / email / SĐT..."
          className="w-full md:w-[420px] bg-gray-50 border border-gray-300 px-4 py-2.5 rounded-lg text-gray-900 outline-none focus:border-red-600 transition-all"
          value={filters.q}
          onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
        />
        <select
          className="w-full md:w-[320px] bg-gray-50 border border-gray-300 px-4 py-2.5 rounded-lg text-gray-900 outline-none focus:border-red-600 transition-all"
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
          className="bg-gray-100 hover:bg-gray-200 border border-gray-300 px-4 py-2.5 rounded-lg font-bold text-gray-900"
        >
          Xóa lọc
        </button>
      </div>

      <div className="text-gray-500 text-sm">
        Kết quả: <span className="text-gray-900 font-bold">{count}</span> /{" "}
        <span>{total}</span>
      </div>
    </div>
  );
}