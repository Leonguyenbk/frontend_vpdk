import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import authApi from "../api/authApi";

export default function UserProfile() {
  const { user, fetchProfile } = useOutletContext();
  const [loading, setLoading] = useState(false);
  
  // State cho thông tin cá nhân
  const [profileData, setProfileData] = useState({
    email: user?.email || "",
    phone: user?.phone || ""
  });

  // State cho mật khẩu
  const [passData, setPassData] = useState({ old: "", new: "", confirm: "" });

  // Đồng bộ state khi user từ context thay đổi
  useEffect(() => {
    if (user) {
      setProfileData({ email: user.email, phone: user.phone });
    }
  }, [user]);

  // Xử lý cập nhật thông tin cá nhân (Email, SĐT)
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Giả sử endpoint của bạn là /auth/update-profile
      await axiosClient.put("/auth/update-profile", profileData);
      alert("Cập nhật thông tin thành công!");
      fetchProfile(); // Tải lại dữ liệu mới từ server vào context
    } catch (err) {
      alert(err.response?.data?.msg || "Lỗi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) return alert("Mật khẩu mới không khớp!");
    
    setLoading(true);
    try {
      await axiosClient.put("/auth/change-password", {
        old_password: passData.old,
        new_password: passData.new
      });
      alert("Đổi mật khẩu thành công!");
      setPassData({ old: "", new: "", confirm: "" });
    } catch (err) {
      alert(err.response?.data?.msg || "Lỗi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">Cài đặt hồ sơ</h1>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-2">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột 1: Thông tin tổng quan */}
        <div className="space-y-6">
           <div className="bg-white border border-gray-200 rounded-[2rem] p-8 text-center shadow-2xl">
              <div className="h-24 w-24 rounded-3xl bg-blue-600 mx-auto flex items-center justify-center text-4xl font-black shadow-xl shadow-blue-900/20 mb-4 text-gray-900">
                {user?.full_name?.[0]}
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{user?.full_name}</h2>
              <p className="text-blue-500 text-xs font-bold uppercase mt-1 tracking-widest">{user?.job_title}</p>
              
              <div className="mt-8 pt-8 border-t border-gray-200 space-y-4 text-left">
                 <InfoItem label="Username" value={`@${user?.username}`} />
                 <InfoItem label="Phòng ban" value={user?.org_unit?.name} />
              </div>
           </div>

           <button 
            onClick={async () => { await authApi.logout(); window.location.href = "/login"; }}
            className="w-full py-4 rounded-2xl border border-gray-200 text-gray-500 hover:text-blue-500 hover:bg-blue-500/5 font-black uppercase text-xs tracking-[0.3em] transition-all"
           >
            Đăng xuất khỏi hệ thống
           </button>
        </div>

        {/* Cột 2 & 3: Các form cập nhật */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* FORM 1: CẬP NHẬT THÔNG TIN CÁ NHÂN */}
           <form onSubmit={handleUpdateInfo} className="bg-white border border-gray-200 rounded-[2rem] p-10 shadow-2xl space-y-6">
              <h3 className="text-lg font-black text-gray-900 uppercase italic border-l-4 border-blue-600 pl-4 mb-8">Thông tin liên lạc</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputGroup 
                    label="Địa chỉ Email" 
                    type="email" 
                    value={profileData.email} 
                    onChange={v => setProfileData({...profileData, email: v})} 
                 />
                 <InputGroup 
                    label="Số điện thoại" 
                    type="text" 
                    value={profileData.phone} 
                    onChange={v => setProfileData({...profileData, phone: v})} 
                 />
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-zinc-100 hover:bg-white text-black px-8 py-3 rounded-xl font-black shadow-xl uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Đang lưu..." : "Lưu thông tin"}
                </button>
              </div>
           </form>

           {/* FORM 2: ĐỔI MẬT KHẨU */}
           <form onSubmit={handleUpdatePassword} className="bg-white border border-gray-200 rounded-[2rem] p-10 shadow-2xl space-y-6">
              <h3 className="text-lg font-black text-gray-900 uppercase italic border-l-4 border-blue-600 pl-4 mb-8">Đổi mật khẩu bảo mật</h3>
              
              <div className="space-y-4">
                <InputGroup label="Mật khẩu hiện tại" type="password" value={passData.old} onChange={v => setPassData({...passData, old: v})} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputGroup label="Mật khẩu mới" type="password" value={passData.new} onChange={v => setPassData({...passData, new: v})} />
                  <InputGroup label="Xác nhận mật khẩu mới" type="password" value={passData.confirm} onChange={v => setPassData({...passData, confirm: v})} />
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[10px] text-gray-500 uppercase font-bold italic max-w-xs">* Lưu ý: Bạn nên sử dụng mật khẩu mạnh để bảo vệ dữ liệu công việc.</p>
                <button 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-900/20 uppercase tracking-widest text-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                </button>
              </div>
           </form>

        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm text-gray-700 font-bold">{value || "---"}</div>
    </div>
  );
}

function InputGroup({ label, type, value, onChange }) {
  return (
    <div>
      <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">{label}</label>
      <input 
        required
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl text-gray-900 outline-none focus:border-blue-600 transition-all font-bold"
      />
    </div>
  );
}