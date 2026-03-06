import React from "react";

export default function UserActions({ user, onEdit, onDelete }) {
  return (
    <div className="p-4 text-right space-x-4" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(user);
        }}
        className="text-blue-500 hover:text-blue-400 text-sm font-bold"
        type="button"
      >
        Sửa
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(user?.id);
        }}
        className="text-zinc-600 hover:text-red-500 text-sm"
        type="button"
      >
        Xóa
      </button>
    </div>
  );
}
