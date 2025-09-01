import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
     <nav className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-100 dark:border-slate-800 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center h-16">
    <Link to="#" className="font-extrabold text-2xl text-indigo-600 tracking-tight">
      Product Manager
    </Link>

    <div className="flex gap-4 items-center">
      {user ? (
        <>
          <Link
            to="/dashboard"
            className="hover:text-indigo-600 transition font-medium"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-sm rounded-full bg-red-500 text-white hover:bg-red-600 shadow"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          to="/login"
          className="btn btn-sm rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow"
        >
          Login
        </Link>
      )}
    </div>
  </div>
</nav>
  );
}
