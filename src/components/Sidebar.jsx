import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, Briefcase, FolderKanban,
  Clock, Settings, LogOut, ChevronLeft, ChevronRight,
  Users, HardHat, FileSpreadsheet,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/app/dashboard",      icon: LayoutDashboard,  label: "Dashboard" },
  { to: "/app/projects",       icon: FolderKanban,     label: "Projects" },
  { to: "/app/contractors",    icon: Briefcase,        label: "Contractors" },
  { to: "/app/engineers",      icon: HardHat,          label: "Engineers" },
  { to: "/app/chairpersons",   icon: Users,            label: "Chairpersons" },
  { to: "/app/delay-logs",     icon: Clock,            label: "Delay Logs", badge: 3 },
  { to: "/app/past-records",   icon: FileSpreadsheet,  label: "Past Records" },
];

const BOTTOM_ITEMS = [
  { to: "/app/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const csrf = document.cookie.split(';').find(c => c.trim().startsWith('csrftoken='))?.split('=')[1] || "";
      await fetch("/api/auth/logout/", {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRFToken": csrf },
      });
    } catch (_) {}
    navigate("/login");
  };

  return (
    <aside className={`${collapsed ? "w-[68px]" : "w-60"} bg-[#062A4D] text-white flex flex-col transition-all duration-300 shrink-0`}>

      {/* LOGO */}
      <div className={`h-16 flex items-center border-b border-white/10 shrink-0 ${collapsed ? "justify-center px-0" : "justify-between px-5"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-400/30 flex items-center justify-center">
              <FolderKanban size={15} className="text-blue-200" />
            </div>
            <span className="text-[15px] font-bold tracking-wide text-white">Sankalpa</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white ${collapsed ? "" : ""}`}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* NAV */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-2">Menu</p>
        )}
        {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group relative
              ${isActive
                ? "bg-white/15 text-white font-medium"
                : "text-white/60 hover:bg-white/8 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-300 rounded-r-full" />
                )}
                <Icon size={17} className={`shrink-0 ${isActive ? "text-blue-300" : "text-white/50 group-hover:text-white/80"}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{label}</span>
                    {badge && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                        {badge}
                      </span>
                    )}
                  </>
                )}
                {/* Collapsed badge dot */}
                {collapsed && badge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM */}
      <div className="px-2 pb-4 border-t border-white/10 pt-3 space-y-0.5">
        {BOTTOM_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group
              ${isActive ? "bg-white/15 text-white font-medium" : "text-white/60 hover:bg-white/8 hover:text-white"}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={`shrink-0 ${isActive ? "text-blue-300" : "text-white/50 group-hover:text-white/80"}`} />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-white/60 hover:bg-red-500/15 hover:text-red-300 transition-all duration-150 group"
        >
          <LogOut size={17} className="shrink-0 group-hover:text-red-300" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}