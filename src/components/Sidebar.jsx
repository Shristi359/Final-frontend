import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  Clock,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-6 py-3 text-sm ${
      isActive ? "bg-white/20" : "hover:bg-white/10"
    }`;

  return (
    <aside className="w-64 bg-[#2f8ab8] text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 text-lg font-semibold border-b border-white/20">
        Sankalpa
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 space-y-1">
        <NavLink to="/" className={linkClass}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink to="/contractors" className={linkClass}>
          <Briefcase size={18} /> Contractor
        </NavLink>

        <NavLink to="/projects" className={linkClass}>
          <FolderKanban size={18} /> Projects
        </NavLink>

        <NavLink to="/delay-logs" className={linkClass}>
          <Clock size={18} />
          <span className="flex-1">Delay Logs</span>
          <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
            3
          </span>
        </NavLink>
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/20">
        <NavLink to="/settings" className={linkClass}>
          <Settings size={18} /> Settings
        </NavLink>

        <button className="flex items-center gap-3 px-6 py-3 text-sm w-full hover:bg-white/10">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
