import { useState } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { MessageCircle, Compass, Map, User, LogOut, Sparkles } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function DashboardLayout({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { path: "/dashboard", icon: <MessageCircle className="w-5 h-5" />, label: "AI Mentor", exact: true },
    { path: "/dashboard/explore", icon: <Compass className="w-5 h-5" />, label: "Explore Careers" },
    { path: "/dashboard/roadmaps", icon: <Map className="w-5 h-5" />, label: "Skill Pathways" },
    { path: "/dashboard/profile", icon: <User className="w-5 h-5" />, label: "Profile" },
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 flex flex-col border-r border-gray-800">

        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2 text-xl font-bold text-purple-400">
            <Sparkles className="w-6 h-6" />
            <span>AI Mentor</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                isActive(item.path, item.exact)
                  ? "bg-purple-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user?.picture || "https://via.placeholder.com/40"}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-950 p-6">
        <Outlet context={{ user }} />
      </main>

    </div>
  );
}
