import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

export default function Login() {
  const navigate = useNavigate();

  // ✅ PHẢI CÓ STATE
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

      // ✅ Backend ông đang return { access_token, user, ... }
      const token = data.access_token || data.token;

      if (token) {
        localStorage.setItem("access_token", token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        setMsg("✅ Đăng nhập thành công");

        const role = data.user?.role;
        if (role === "admin") navigate("/admin", { replace: true });
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur p-6 shadow-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Đăng nhập</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Vui lòng nhập tài khoản để vào hệ thống
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-300">Tên đăng nhập</label>
            <input
              className="mt-1 w-full rounded-xl bg-zinc-950/60 border border-zinc-800 px-4 py-2 outline-none focus:border-zinc-500"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Mật khẩu</label>
            <input
              className="mt-1 w-full rounded-xl bg-zinc-950/60 border border-zinc-800 px-4 py-2 outline-none focus:border-zinc-500"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {msg && (
            <div
              className={`text-sm rounded-xl px-3 py-2 border ${
                msg.includes("✅")
                  ? "border-emerald-800 bg-emerald-900/20 text-emerald-200"
                  : "border-rose-800 bg-rose-900/20 text-rose-200"
              }`}
            >
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-zinc-100 text-zinc-950 font-medium py-2 hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="text-xs text-zinc-500 text-center">
            © {new Date().getFullYear()} Hệ thống nội bộ
          </div>
        </form>
      </div>
    </div>
  );
}