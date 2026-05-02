import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const titleForPath = (pathname) => {
  if (pathname.startsWith("/projects/")) {
    return "Project Details";
  }

  return "Dashboard";
};

const Navbar = ({ onMenu }) => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button className="icon-btn lg:hidden" type="button" onClick={onMenu} title="Open menu">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-slate-950 dark:text-white">{titleForPath(location.pathname)}</h1>
            <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="icon-btn" type="button" onClick={toggleTheme} title="Toggle dark mode">
            {theme === "dark" ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
          </button>
          <button className="icon-btn" type="button" onClick={logout} title="Sign out">
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
