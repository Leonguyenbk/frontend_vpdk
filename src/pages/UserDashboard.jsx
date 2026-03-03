export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-zinc-100">
      <h1 className="text-3xl font-bold text-blue-500">USER DASHBOARD</h1>
      <p className="mt-4">Xin chào: <strong>{user?.username}</strong></p>
    </div>
  );
}
