import { Link, useNavigate } from "react-router-dom";
export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
   <nav className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-100 dark:border-slate-800 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center h-16">
    {/* Logo */}
    <Link to="/" className="font-extrabold text-2xl text-indigo-600 tracking-tight">
      Logo
    </Link>

    {/* Search Bar */}
    <label className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 w-[500px] max-w-md">
      <svg
        className="h-5 w-5 text-slate-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        type="search"
        placeholder="Search"
        className="bg-transparent outline-none text-slate-700 dark:text-slate-200 flex-grow"
      />
    </label>

    {/* Actions */}
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
        <>
          <Link
            to="/login"
            className="btn btn-sm rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="btn btn-sm rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          >
            Signup
          </Link>
        </>
      )}
    </div>
  </div>
</nav>


  );
}
