import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  LogIn,
  Building2,
  ShieldCheck
} from "lucide-react";
import authApi from "../api/authApi";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const data = await authApi.login(username.trim(), password);
      const token = data.access_token || data.token;

      if (token) {
        localStorage.setItem("access_token", token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        setMsg("✅ Đăng nhập thành công");

        const role = String(data.user?.role || "").toLowerCase();
        if (role === "admin") navigate("/admin", { replace: true });
        else if (role === "manager") navigate("/manager", { replace: true });
        else navigate("/user", { replace: true });
      } else {
        setMsg(data.msg || "Đăng nhập thất bại");
      }
    } catch (err) {
      setMsg(err?.response?.data?.msg || err?.message || "❌ Không kết nối được server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl p-8">

        {/* HEADER */}
        <div className="text-center mb-8 space-y-3">

          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
              <Building2 size={28}/>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 leading-snug">
            Chào mừng đến hệ thống quản lý nhân sự
          </h1>

          <p className="text-sm text-gray-600 leading-relaxed">
            và đánh giá KPI của
            <br />
            <span className="font-semibold text-gray-900 uppercase">
              VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI
            </span>
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={14}/>
            Hệ thống nội bộ
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* USERNAME */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Tên đăng nhập
            </label>

            <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 focus-within:border-blue-600">
              <User size={18} className="text-gray-500"/>
              <input
                className="w-full bg-transparent outline-none text-gray-900"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Mật khẩu
            </label>

            <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 focus-within:border-blue-600">
              <Lock size={18} className="text-gray-500"/>
              <input
                type="password"
                className="w-full bg-transparent outline-none text-gray-900"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* MESSAGE */}
          {msg && (
            <div
              className={`text-sm rounded-xl px-3 py-2 border ${
                msg.includes("✅")
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {msg}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-semibold py-2.5 hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LogIn size={18}/>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          {/* FOOTER */}
          <div className="text-xs text-gray-400 text-center pt-2">
            © {new Date().getFullYear()} Văn phòng đăng ký đất đai
          </div>

        </form>
      </div>
    </div>
  );
}