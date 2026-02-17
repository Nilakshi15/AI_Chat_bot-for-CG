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
        method: 'POST',
        credentials: 'include'
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { path: '/dashboard', icon: <MessageCircle className="w-5 h-5" />, label: 'Chat', exact: true },
    { path: '/dashboard/explore', icon: <Compass className="w-5 h-5" />, label: 'Explore' },
    { path: '/dashboard/roadmaps', icon: <Map className="w-5 h-5" />, label: 'Roadmaps' },
    { path: '/dashboard/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r flex flex-col" style={{backgroundColor: '#EFECE3', borderColor: '#8FABD4'}}>
        <div className="p-6 border-b" style={{borderColor: '#8FABD4'}}>
          <div className="flex items-center gap-2 font-bold text-xl" style={{color: '#4A70A9'}}>
            <Sparkles className="w-6 h-6" />
            <span>AI Career Guidance</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              data-testid={`nav-${item.label.toLowerCase()}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 font-medium transition-all duration-200 ${
                isActive(item.path, item.exact)
                  ? 'text-white'
                  : 'hover:opacity-70'
              }`}
              style={{
                backgroundColor: isActive(item.path, item.exact) ? '#4A70A9' : 'transparent',
                color: isActive(item.path, item.exact) ? '#FFFFFF' : '#000000'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t" style={{borderColor: '#8FABD4'}}>
          <div className="flex items-center gap-3 mb-4 px-2">
            <img
              src={user?.picture || 'https://via.placeholder.com/40'}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{color: '#000000'}}>{user?.name}</p>
              <p className="text-xs truncate" style={{color: '#000000', opacity: 0.6}}>{user?.email}</p>
            </div>
          </div>
          <button
            data-testid="logout-btn"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium hover:opacity-70 transition-all duration-200"
            style={{color: '#000000', backgroundColor: '#8FABD4'}}
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto" style={{backgroundColor: '#EFECE3'}}>
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}
