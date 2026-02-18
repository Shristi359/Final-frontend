import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, CheckCircle, Activity, Clock, XCircle,
  ArrowRight, Building2, RefreshCw, Hourglass,
  Plus, CalendarClock, TrendingUp, Layers, Target, Wallet,
  FolderOpen, ChevronLeft, ChevronRight,
} from "lucide-react";
import api from "../api/axios";

const TOTAL_WARD_BUDGET = 45_000_000;

const STATUS_META = {
  ONGOING:     { label:"Ongoing",     dot:"bg-blue-500",    text:"text-blue-700",    bg:"bg-blue-50"    },
  COMPLETED:   { label:"Completed",   dot:"bg-emerald-500", text:"text-emerald-700", bg:"bg-emerald-50" },
  DELAYED:     { label:"Delayed",     dot:"bg-red-500",     text:"text-red-700",     bg:"bg-red-50"     },
  CANCELLED:   { label:"Cancelled",   dot:"bg-gray-400",    text:"text-gray-600",    bg:"bg-gray-100"   },
  COMING_SOON: { label:"Coming Soon", dot:"bg-purple-400",  text:"text-purple-700",  bg:"bg-purple-50"  },
};

const fmt   = (n) => new Intl.NumberFormat("en-NP").format(Math.round(Number(n)||0));
const fmtM  = (n) => `${((Number(n)||0)/1_000_000).toFixed(2)}M`;
const pct   = (a,b) => b>0 ? Math.min(100,Math.round((a/b)*100)) : 0;
const sumBy = (arr,k) => arr.reduce((s,x)=>s+(Number(x[k])||0),0);

function contractorName(p) {
  if (p.contractor_details?.contractor_name) return p.contractor_details.contractor_name;
  if (p.contractor_details?.company_name)    return p.contractor_details.company_name;
  if (p.contractor_details?.full_name)       return p.contractor_details.full_name;
  if (p.contractor && typeof p.contractor === "object")
    return p.contractor.contractor_name || p.contractor.company_name || p.contractor.name || "—";
  return "—";
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

// ── Budget Pie Chart ──────────────────────────────────────────────────────────
function BudgetPieChart({ used, committed, total }) {
  const remaining = Math.max(0, total - used - committed);
  const usedPct = pct(used, total);
  const committedPct = pct(committed, total);
  const remainingPct = Math.max(0, 100 - usedPct - committedPct);

  const cx = 90, cy = 90, r = 70, strokeW = 28;
  const circ = 2 * Math.PI * r;

  const segments = [
    { val: usedPct,      color: "#1d4ed8", label: "Used",      amount: used      },
    { val: committedPct, color: "#f59e0b", label: "Committed", amount: committed  },
    { val: remainingPct, color: "#e5e7eb", label: "Remaining", amount: remaining  },
  ].filter(s => s.val > 0);

  let cumulative = 0;
  const arcs = segments.map(seg => {
    const dash = (seg.val / 100) * circ;
    const offset = circ - cumulative * circ / 100;
    cumulative += seg.val;
    return { ...seg, dash, offset };
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative flex-shrink-0">
        <svg viewBox="0 0 180 180" className="w-40 h-40 -rotate-90">
          {/* Background ring */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={strokeW}/>
          {arcs.map((arc, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={arc.color} strokeWidth={strokeW}
              strokeDasharray={`${arc.dash} ${circ - arc.dash}`}
              strokeDashoffset={arc.offset}
              strokeLinecap="butt"
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400 font-medium">Total</span>
          <span className="text-sm font-bold text-gray-800">NPR {fmtM(total)}</span>
        </div>
      </div>
      <div className="space-y-3 flex-1 min-w-0">
        {[
          { label:"Used",      pct:usedPct,      amt:used,      color:"bg-blue-600",  text:"text-blue-700"   },
          { label:"Committed", pct:committedPct, amt:committed, color:"bg-amber-400", text:"text-amber-700"  },
          { label:"Remaining", pct:remainingPct, amt:remaining, color:"bg-gray-200",  text:"text-gray-600"   },
        ].map(s => (
          <div key={s.label}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-sm ${s.color} flex-shrink-0`}/>
                <span className="text-xs text-gray-600">{s.label}</span>
              </div>
              <span className={`text-xs font-bold ${s.text}`}>{s.pct}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${s.color} rounded-full transition-all duration-1000`} style={{width:`${s.pct}%`}}/>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 text-right">NPR {fmtM(s.amt)}</p>
          </div>
        ))}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="flex items-center gap-1 text-[10px] text-green-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"/>LIVE
          </span>
          <span className="text-[10px] text-gray-300">·</span>
          <span className="text-[10px] text-gray-400">FY 2081/82</span>
        </div>
      </div>
    </div>
  );
}

// ── Project Calendar ──────────────────────────────────────────────────────────
function ProjectCalendar({ projects }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString("default", { month:"long" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map project dates to this month
  const eventsByDay = {};
  projects.forEach(p => {
    const checkDate = (dateStr, type) => {
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!eventsByDay[day]) eventsByDay[day] = [];
        eventsByDay[day].push({ name: p.project_name, status: p.status, type, id: p.id });
      }
    };
    checkDate(p.planned_completion_date, "deadline");
    checkDate(p.planned_start_date, "start");
  });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const dotColor = (events) => {
    if (events.some(e => e.status === "DELAYED")) return "bg-red-500";
    if (events.some(e => e.type === "deadline")) return "bg-orange-500";
    return "bg-blue-500";
  };

  const isToday = (day) =>
    today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-blue-600"/>
          <h3 className="font-semibold text-gray-800">Project Calendar</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{monthName} {year}</span>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100 transition"><ChevronLeft className="w-4 h-4 text-gray-500"/></button>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100 transition"><ChevronRight className="w-4 h-4 text-gray-500"/></button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-gray-400 uppercase py-1">{d}</div>
          ))}
        </div>
        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {/* Empty cells */}
          {Array.from({length: firstDay}).map((_, i) => <div key={`e${i}`}/>)}
          {/* Day cells */}
          {Array.from({length: daysInMonth}).map((_, i) => {
            const day = i + 1;
            const events = eventsByDay[day] || [];
            const hasEvents = events.length > 0;
            return (
              <div key={day} className={`relative flex flex-col items-center py-1 rounded-lg cursor-default group
                ${isToday(day) ? "bg-blue-600" : hasEvents ? "hover:bg-gray-50" : ""}
              `}>
                <span className={`text-xs font-medium leading-none
                  ${isToday(day) ? "text-white" : "text-gray-700"}
                `}>{day}</span>
                {hasEvents && !isToday(day) && (
                  <div className="flex gap-0.5 mt-1">
                    {events.slice(0,3).map((ev, j) => (
                      <span key={j} className={`w-1 h-1 rounded-full ${
                        ev.status === "DELAYED" ? "bg-red-500" :
                        ev.type === "deadline"  ? "bg-orange-500" :
                        "bg-blue-500"
                      }`}/>
                    ))}
                  </div>
                )}
                {isToday(day) && hasEvents && (
                  <span className="w-1 h-1 rounded-full bg-white mt-1"/>
                )}
                {/* Tooltip */}
                {hasEvents && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 hidden group-hover:block w-44 bg-gray-900 text-white text-[10px] rounded-lg p-2 shadow-xl pointer-events-none">
                    {events.map((ev, j) => (
                      <div key={j} className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          ev.status === "DELAYED" ? "bg-red-400" :
                          ev.type === "deadline"  ? "bg-orange-400" : "bg-blue-400"
                        }`}/>
                        <span className="truncate">{ev.type === "deadline" ? "🏁" : "🚀"} {ev.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-blue-500"/>Start date
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-orange-500"/>Deadline
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-red-500"/>Delayed
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mini sparkline-style project health bars ─────────────────────────────────
function HealthBar({ label, val, total, color, textColor }) {
  const p = pct(val, total || 1);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className={`font-semibold ${textColor}`}>{val} <span className="text-gray-400 font-normal">({p}%)</span></span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{width:`${p}%`}}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [projects,     setProjects]     = useState([]);
  const [milestones,   setMilestones]   = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [materials,    setMaterials]    = useState([]);
  const [abstracts,    setAbstracts]    = useState([]);
  const [alerts,       setAlerts]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [lastUpdated,  setLastUpdated]  = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [alertIdx,     setAlertIdx]     = useState(0);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [pr, ms, mb, ma, ab, al] = await Promise.allSettled([
        api.get("projects/project/"),
        api.get("milestones/milestone/"),
        api.get("finance/measurement-book/"),
        api.get("finance/materials/"),
        api.get("finance/abstract-record/"),
        api.get("alerts/alerts/"),
      ]);
      if (pr.status==="fulfilled") setProjects(pr.value.data||[]);
      if (ms.status==="fulfilled") setMilestones(ms.value.data||[]);
      if (mb.status==="fulfilled") setMeasurements(mb.value.data||[]);
      if (ma.status==="fulfilled") setMaterials(ma.value.data||[]);
      if (ab.status==="fulfilled") setAbstracts(ab.value.data||[]);
      if (al.status==="fulfilled") setAlerts(al.value.data||[]);
      setLastUpdated(new Date());
    } catch(e){ console.error(e); } finally { setLoading(false); }
  },[]);

  useEffect(()=>{ fetchAll(); const t=setInterval(fetchAll,60000); return()=>clearInterval(t); },[fetchAll]);

  // Budget math
  const usedMB       = sumBy(measurements.filter(m=>m.status==="VERIFIED"),  "total_amount");
  const usedMat      = sumBy(materials.filter(m=>m.status==="DELIVERED"),    "grand_total");
  const totalUsed    = usedMB + usedMat;
  const committedMat = sumBy(materials.filter(m=>m.status==="ORDERED"),      "grand_total");
  const committedAbs = sumBy(abstracts.filter(a=>["PENDING","APPROVED"].includes(a.status)), "grand_total");
  const totalCommitted = committedMat + committedAbs;

  // Per-project budget map
  const pMap = {};
  abstracts.filter(a=>a.status==="APPROVED").forEach(a=>{
    const pid=a.project;
    if (!pMap[pid]) pMap[pid]={estimated:0,used:0};
    pMap[pid].estimated += Number(a.grand_total)||0;
  });
  measurements.filter(m=>m.status==="VERIFIED").forEach(m=>{
    const pid=m.project;
    if (!pMap[pid]) pMap[pid]={estimated:0,used:0};
    pMap[pid].used += Number(m.total_amount)||0;
  });
  materials.filter(m=>m.status==="DELIVERED").forEach(m=>{
    const pid=m.project;
    if (!pMap[pid]) pMap[pid]={estimated:0,used:0};
    pMap[pid].used += Number(m.grand_total)||0;
  });

  // Project stats
  const stats = {
    total:       projects.length,
    completed:   projects.filter(p=>p.status==="COMPLETED").length,
    ongoing:     projects.filter(p=>p.status==="ONGOING").length,
    delayed:     projects.filter(p=>p.status==="DELAYED").length,
    cancelled:   projects.filter(p=>p.status==="CANCELLED").length,
    coming_soon: projects.filter(p=>p.status==="COMING_SOON").length,
  };

  // Milestone insights
  const overdueMilestones    = milestones.filter(m => !m.is_completed && m.planned_completion_date && new Date(m.planned_completion_date) < new Date());
  const completedMilestones  = milestones.filter(m => m.is_completed);
  const milestoneCompletionRate = milestones.length > 0 ? Math.round((completedMilestones.length / milestones.length) * 100) : 0;

  // Due soon
  const dueSoon = projects
    .filter(p => !["COMPLETED","CANCELLED"].includes(p.status) && p.planned_completion_date)
    .map(p => ({ ...p, daysLeft: daysUntil(p.planned_completion_date) }))
    .filter(p => p.daysLeft !== null && p.daysLeft <= 30)
    .sort((a,b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  // Alerts
  const unreadSystem    = alerts.filter(a => !a.is_read && a.milestone == null);
  const unreadMilestone = alerts.filter(a => !a.is_read && a.milestone != null);

  const bannerAlerts = [
    ...(stats.delayed>0          ? [{type:"error",   msg:`${stats.delayed} project${stats.delayed>1?"s":""} delayed`}] : []),
    ...(unreadMilestone.length>0  ? [{type:"error",   msg:`${unreadMilestone.length} overdue milestone${unreadMilestone.length>1?"s":""}`}] : []),
    ...(unreadSystem.length>0     ? [{type:"warning", msg:`${unreadSystem.length} unread system alert${unreadSystem.length>1?"s":""}`}] : []),
    ...(pct(totalUsed,TOTAL_WARD_BUDGET)>=80 ? [{type:"warning",msg:`Budget at ${pct(totalUsed,TOTAL_WARD_BUDGET)}% — approaching limit`}] : []),
    {type:"info",msg:`Updated: ${lastUpdated?.toLocaleTimeString()||"—"}`},
  ];
  const banner = bannerAlerts[alertIdx % bannerAlerts.length];
  const bStyle = {error:"bg-red-600",warning:"bg-amber-500",info:"bg-slate-700"};

  const filtered = statusFilter==="ALL" ? projects : projects.filter(p=>p.status===statusFilter);

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-10 bg-gray-200 rounded-lg"/>
      <div className="grid grid-cols-6 gap-3">{[...Array(6)].map((_,i)=><div key={i} className="h-24 bg-gray-200 rounded-xl"/>)}</div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4"><div className="h-56 bg-gray-200 rounded-xl"/><div className="h-64 bg-gray-200 rounded-xl"/></div>
        <div className="space-y-4"><div className="h-56 bg-gray-200 rounded-xl"/><div className="h-56 bg-gray-200 rounded-xl"/></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">

      {/* Banner */}
      {banner && (
        <div className={`${bStyle[banner.type]} text-white px-5 py-2.5 rounded-xl flex items-center justify-between shadow-sm`}>
          <div className="flex items-center gap-3 text-sm">
            <AlertTriangle size={16}/><span>{banner.msg}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {bannerAlerts.map((_,i)=>(
                <button key={i} onClick={()=>setAlertIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i===alertIdx%bannerAlerts.length?"bg-white":"bg-white/40"}`}/>
              ))}
            </div>
            <button onClick={fetchAll} className="bg-white/20 hover:bg-white/30 px-3 py-1 text-xs rounded flex items-center gap-1 transition">
              <RefreshCw className="w-3 h-3"/> Refresh
            </button>
          </div>
        </div>
      )}

      {/* KPI cards — 6-col with Total Projects first */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total — featured card */}
        <div onClick={()=>navigate("/app/projects")}
          className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl px-4 py-4 cursor-pointer hover:shadow-lg transition-all duration-200 flex items-center gap-3 relative overflow-hidden">
          <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-white/5"/>
          <div className="absolute -right-1 -bottom-4 w-20 h-20 rounded-full bg-white/5"/>
          <div className="text-white/20"><FolderOpen className="w-7 h-7"/></div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Total</p>
            <p className="text-2xl font-bold text-white leading-tight">{stats.total}</p>
            <p className="text-[10px] text-slate-400">all projects</p>
          </div>
        </div>

        {[
          { label:"Completed",   val:stats.completed,   icon:CheckCircle, accent:"border-emerald-400", text:"text-emerald-700", iconColor:"text-emerald-200", bg:"bg-white", sub:"finished",    path:"/app/projects/completed" },
          { label:"Ongoing",     val:stats.ongoing,     icon:Activity,    accent:"border-blue-400",    text:"text-blue-700",    iconColor:"text-blue-200",    bg:"bg-white", sub:"in progress", path:"/app/projects/ongoing"   },
          { label:"Delayed",     val:stats.delayed,     icon:Clock,       accent:"border-red-400",     text:"text-red-700",     iconColor:"text-red-200",     bg:"bg-white", sub:"attention",   path:"/app/projects/delayed",  badge:stats.delayed>0 },
          { label:"Coming Soon", val:stats.coming_soon, icon:Hourglass,   accent:"border-purple-400",  text:"text-purple-700",  iconColor:"text-purple-200",  bg:"bg-white", sub:"upcoming",    path:"/app/projects"           },
          { label:"Cancelled",   val:stats.cancelled,   icon:XCircle,     accent:"border-gray-300",    text:"text-gray-500",    iconColor:"text-gray-200",    bg:"bg-white", sub:"this FY",     path:"/app/projects/cancelled" },
        ].map(s=>(
          <div key={s.label} onClick={()=>navigate(s.path)}
            className={`${s.bg} border-l-4 ${s.accent} rounded-xl px-4 py-4 relative cursor-pointer hover:shadow-md transition-all duration-200 flex items-center gap-3`}>
            <div className={`${s.iconColor} flex-shrink-0`}><s.icon className="w-6 h-6"/></div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest truncate">{s.label}</p>
              <p className={`text-xl font-bold ${s.text} leading-tight`}>{s.val}</p>
              <p className="text-[10px] text-gray-400">{s.sub}</p>
            </div>
            {s.badge && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"/>}
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-5">

          {/* Budget Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-slate-500"/>
                <h3 className="font-semibold text-gray-800">Ward Budget Overview</h3>
                <span className="text-[10px] text-gray-400 ml-1">FY 2081/82</span>
              </div>
              <div className="flex items-center gap-3">
                {pct(totalUsed,TOTAL_WARD_BUDGET) >= 80 && (
                  <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    ⚠ {pct(totalUsed,TOTAL_WARD_BUDGET)}% used
                  </span>
                )}
                <span className="text-sm font-bold text-gray-600">NPR {fmtM(TOTAL_WARD_BUDGET)}</span>
              </div>
            </div>
            <div className="px-6 py-5">
              <BudgetPieChart used={totalUsed} committed={totalCommitted} total={TOTAL_WARD_BUDGET}/>
            </div>
          </div>

          {/* Projects Due Soon */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-orange-500"/>
                <h3 className="font-semibold text-gray-800">Due Within 30 Days</h3>
              </div>
              <span className="text-xs text-gray-400">{dueSoon.length} project{dueSoon.length!==1?"s":""}</span>
            </div>
            {dueSoon.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2"/>
                <p className="text-sm text-gray-400">No projects due in the next 30 days</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {dueSoon.map(p => {
                  const isOverdue = p.daysLeft < 0;
                  const isUrgent  = p.daysLeft >= 0 && p.daysLeft <= 7;
                  const meta = STATUS_META[p.status] || STATUS_META.ONGOING;
                  return (
                    <div key={p.id}
                      onClick={() => navigate(`/app/projects/${p.id}/overview`)}
                      className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full ${meta.dot}`}/>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{p.project_name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{p.project_code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isOverdue ? "bg-red-100 text-red-700" :
                          isUrgent  ? "bg-orange-100 text-orange-700" :
                                      "bg-blue-50 text-blue-700"
                        }`}>
                          {isOverdue ? `${Math.abs(p.daysLeft)}d overdue` : p.daysLeft === 0 ? "Due today" : `${p.daysLeft}d left`}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors"/>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* All Projects Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-gray-800">All Projects</h3>
                <p className="text-xs text-gray-400 mt-0.5">{projects.length} total · {filtered.length} shown</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {["ALL","ONGOING","DELAYED","COMPLETED","COMING_SOON","CANCELLED"].map(s=>(
                  <button key={s} onClick={()=>setStatusFilter(s)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${statusFilter===s?"bg-slate-800 text-white":"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {s==="COMING_SOON"?"SOON":s}
                  </button>
                ))}
              </div>
            </div>
            {filtered.length===0 ? (
              <div className="px-6 py-12 text-center text-gray-400 text-sm">
                No projects. <button onClick={()=>navigate("/app/projects/add")} className="text-blue-600 underline ml-1">Add one →</button>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    {["Project","Contractor","Budget","Progress","Status",""].map(h=>(
                      <th key={h} className="px-4 py-3 text-left text-[11px] text-gray-400 uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(p=>{
                    const meta = STATUS_META[p.status]||STATUS_META.ONGOING;
                    const pb   = pMap[p.id]||{estimated:0,used:0};
                    const up   = pct(pb.used,pb.estimated);
                    const over = pb.estimated>0 && up>=90;
                    const hasAlert = unreadMilestone.some(a => a.project === p.id);
                    return (
                      <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                        onClick={()=>navigate(`/app/projects/${p.id}`)}>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            {hasAlert && <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Overdue milestones"/>}
                            <div>
                              <p className="text-[10px] text-gray-400 font-mono">{p.project_code}</p>
                              <p className="text-sm font-medium text-gray-800 mt-0.5 max-w-xs leading-snug">{p.project_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-gray-300 flex-shrink-0"/>
                            <span className="text-xs text-gray-600 truncate max-w-[120px]">{contractorName(p)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          {pb.estimated>0
                            ? <p className="text-sm font-semibold text-gray-700">NPR {fmt(pb.estimated)}</p>
                            : <p className="text-xs text-gray-400 italic">No estimate</p>}
                          {p.planned_completion_date && <p className="text-[10px] text-gray-400 mt-0.5">Due {p.planned_completion_date}</p>}
                        </td>
                        <td className="px-4 py-3.5 w-36">
                          {pb.estimated>0 ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${over?"bg-red-500":"bg-blue-500"}`} style={{width:`${up}%`}}/>
                              </div>
                              <span className={`text-xs font-medium w-8 text-right ${over?"text-red-600":"text-gray-600"}`}>{up}%</span>
                            </div>
                          ) : <span className="text-xs text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${meta.bg} ${meta.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`}/>{meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 text-xs text-blue-600">
                            View <ArrowRight className="w-3 h-3"/>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-100 bg-gray-50/50">
                    <td colSpan={2} className="px-4 py-3 text-xs text-gray-400">Showing {filtered.length} of {projects.length}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-600">Est: NPR {fmt(filtered.reduce((s,p)=>s+(pMap[p.id]?.estimated||0),0))}</td>
                    <td colSpan={3}/>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>

        {/* RIGHT sidebar */}
        <div className="space-y-5">

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label:"Add New Project",   icon:Plus,      path:"/app/projects/add",     color:"bg-blue-600 hover:bg-blue-700 text-white"       },
                { label:"View Delayed",      icon:Clock,     path:"/app/projects/delayed", color:"bg-red-50 hover:bg-red-100 text-red-700"        },
                { label:"View All Projects", icon:Layers,    path:"/app/projects",         color:"bg-gray-100 hover:bg-gray-200 text-gray-700"    },
                { label:"Add Contractor",    icon:Building2, path:"/app/contractors/add",  color:"bg-gray-100 hover:bg-gray-200 text-gray-700"    },
              ].map(a=>(
                <button key={a.label} onClick={()=>navigate(a.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${a.color}`}>
                  <a.icon className="w-4 h-4 flex-shrink-0"/>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Calendar */}
          <ProjectCalendar projects={projects}/>

          {/* Milestone Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-blue-600"/>
              <h3 className="font-semibold text-gray-800 text-sm">Milestone Overview</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Overall completion</span>
                  <span className="font-semibold text-gray-700">{milestoneCompletionRate}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{width:`${milestoneCompletionRate}%`}}/>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { label:"Total",   val:milestones.length,          color:"text-gray-700"    },
                  { label:"Done",    val:completedMilestones.length, color:"text-emerald-600" },
                  { label:"Overdue", val:overdueMilestones.length,   color:"text-red-600"     },
                ].map(s=>(
                  <div key={s.label} className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>
              {overdueMilestones.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-600 mb-2">Overdue milestones</p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {overdueMilestones.slice(0,5).map(m=>(
                      <div key={m.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 truncate max-w-[140px]">{m.milestone_name}</span>
                        <span className="text-red-500 flex-shrink-0 ml-2">
                          {Math.abs(daysUntil(m.planned_completion_date))}d ago
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-blue-600"/>
              <h3 className="font-semibold text-gray-800 text-sm">Project Health</h3>
            </div>
            <div className="space-y-2.5">
              <HealthBar label="On Track"  val={stats.ongoing}     total={stats.total} color="bg-blue-500"    textColor="text-blue-700"/>
              <HealthBar label="Delayed"   val={stats.delayed}     total={stats.total} color="bg-red-500"     textColor="text-red-700"/>
              <HealthBar label="Completed" val={stats.completed}   total={stats.total} color="bg-emerald-500" textColor="text-emerald-700"/>
              <HealthBar label="Upcoming"  val={stats.coming_soon} total={stats.total} color="bg-purple-400"  textColor="text-purple-700"/>
            </div>
          </div>

          {/* System alerts */}
          {unreadSystem.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">System Alerts</h3>
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadSystem.length} new</span>
              </div>
              <div className="space-y-2">
                {unreadSystem.slice(0,3).map((a,i)=>(
                  <div key={i} className="flex gap-2 items-start">
                    <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5"/>
                    <p className="text-xs text-slate-300 leading-relaxed">{a.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}