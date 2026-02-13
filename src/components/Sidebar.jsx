import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  Clock,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
      isActive
        ? "bg-white/20"
        : "hover:bg-white/10"
    }`;

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-[#062A4D] text-white flex flex-col transition-all duration-300`}
    >
      {/* TOP */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/20">
        {!collapsed && (
          <h1 className="text-lg font-semibold tracking-wide">
            Sankalpa
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-white/20 rounded"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 py-6 space-y-1">

        <NavLink to="/app/dashboard" className={linkClass}>
          <LayoutDashboard size={18} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/app/contractors" className={linkClass}>
          <Briefcase size={18} />
          {!collapsed && <span>Contractors</span>}
        </NavLink>

        <NavLink to="/app/projects" className={linkClass}>
          <FolderKanban size={18} />
          {!collapsed && <span>Projects</span>}
        </NavLink>

        <NavLink to="/app/projects/delayed" className={linkClass}>
          <Clock size={18} />
          {!collapsed && (
            <>
              <span className="flex-1">Delayed</span>
              <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
                3
              </span>
            </>
          )}
        </NavLink>

      </nav>

      {/* BOTTOM */}
      <div className="border-t border-white/20 py-3 space-y-1">

        <NavLink to="/app/settings" className={linkClass}>
          <Settings size={18} />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-3 px-4 py-3 text-sm w-full hover:bg-white/10 transition"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>

      </div>
    </aside>
  );
}
