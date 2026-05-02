import { NavLink } from "react-router-dom";
import { FolderKanban, LayoutDashboard, PanelLeftClose, ShieldCheck } from "lucide-react";
import { initials } from "../utils/formatters";

const Sidebar = ({ open, onClose, user }) => {
  const navItems = [{ href: "/", label: "Dashboard", icon: LayoutDashboard }];

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-950 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 text-white">
              <FolderKanban className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950 dark:text-white">Team Task</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Manager</p>
            </div>
          </div>
          <button className="icon-btn lg:hidden" type="button" onClick={onClose} title="Close menu">
            <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                }`
              }
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              {initials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{user?.name}</p>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-medium capitalize text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {user?.role}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
