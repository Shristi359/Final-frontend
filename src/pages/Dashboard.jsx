import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, CheckCircle, Activity, Clock, XCircle,
  Wallet, TrendingUp, ArrowRight, Building2,
  FileText, Package, ChevronRight, Wrench, RefreshCw,
  Bell, X, Calendar,
} from "lucide-react";
import api from "../api/axios";

const TOTAL_WARD_BUDGET = 45_000_000;

const NEPALI_MONTHS = {
  "04":"Baisakh","05":"Jestha","06":"Ashadh","07":"Shrawan",
  "08":"Bhadra","09":"Ashwin","10":"Kartik","11":"Mangsir",
  "12":"Poush","01":"Magh","02":"Falgun","03":"Chaitra",
};

const STATUS_META = {
  ONGOING:   { label:"Ongoing",   dot:"bg-blue-500",    text:"text-blue-700",    bg:"bg-blue-50"    },
  COMPLETED: { label:"Completed", dot:"bg-emerald-500", text:"text-emerald-700", bg:"bg-emerald-50" },
  DELAYED:   { label:"Delayed",   dot:"bg-red-500",     text:"text-red-700",     bg:"bg-red-50"     },
  CANCELLED: { label:"Cancelled", dot:"bg-gray-400",    text:"text-gray-600",    bg:"bg-gray-100"   },
};

const fmt   = (n) => new Intl.NumberFormat("en-NP").format(Math.round(Number(n)||0));
const fmtM  = (n) => `${((Number(n)||0)/1_000_000).toFixed(2)}M`;
const pct   = (a,b) => b>0 ? Math.min(100,Math.round((a/b)*100)) : 0;
const sumBy = (arr,k) => arr.reduce((s,x)=>s+(Number(x[k])||0),0);

function contractorName(p) {
  if (p.contractor_details?.contractor_name) return p.contractor_details.contractor_name;
  if (p.contractor_details?.company_name)    return p.contractor_details.company_name;
  if (p.contractor_details?.full_name)       return p.contractor_details.full_name;
  if (typeof p.contractor === "string" && isNaN(p.contractor)) return p.contractor;
  if (p.contractor && typeof p.contractor === "object") {
    return p.contractor.contractor_name || p.contractor.company_name || p.contractor.name || "—";
  }
  return "—";
}

function DonutChart({ used, committed, remaining, total }) {
  const cx=90,cy=90,r=68,sw=22;
  const c=2*Math.PI*r;
  const segs=[
    {p:total>0?used/total:0,     col:"#1d4ed8"},
    {p:total>0?committed/total:0,col:"#f59e0b"},
    {p:total>0?remaining/total:0,col:"#e5e7eb"},
  ];
  let cum=0;
  return (
    <svg viewBox="0 0 180 180" className="w-full h-full">
      {segs.map((s,i)=>{
        const dash=s.p*c; const off=c-cum*c; cum+=s.p;
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.col}
          strokeWidth={sw} strokeDasharray={`${dash} ${c-dash}`}
          strokeDashoffset={off} strokeLinecap="butt"
          style={{transition:"stroke-dasharray 1.2s ease"}}/>;
      })}
      <text x={cx} y={cy-10} textAnchor="middle" fontSize="11" fill="#6b7280" fontFamily="Georgia,serif">UTILIZED</text>
      <text x={cx} y={cy+8}  textAnchor="middle" fontSize="18" fill="#111827" fontWeight="700" fontFamily="Georgia,serif">{pct(used,total)}%</text>
      <text x={cx} y={cy+24} textAnchor="middle" fontSize="9"  fill="#9ca3af" fontFamily="Georgia,serif">of total budget</text>
    </svg>
  );
}

function SpendBar({ data }) {
  if (!data.length) return <div className="h-32 flex items-center justify-center text-sm text-gray-400 italic">No verified expenditure data yet</div>;
  const max=Math.max(...data.map(d=>d.v),1);
  const W=560,H=110,pad=28;
  const step=(W-pad*2)/data.length;
  const bw=Math.min(36,step-10);
  return (
    <svg viewBox={`0 0 ${W} ${H+36}`} className="w-full">
      {[0,.25,.5,.75,1].map((f,i)=>(
        <line key={i} x1={pad} x2={W-pad} y1={H-f*H*.88+4} y2={H-f*H*.88+4} stroke="#f3f4f6" strokeWidth="1"/>
      ))}
      {data.map((d,i)=>{
        const x=pad+i*step+step/2; const bh=(d.v/max)*H*.88; const y=H-bh+4;
        return (
          <g key={i}>
            <rect x={x-bw/2} y={y} width={bw} height={bh} fill="#1d4ed8" opacity=".82" rx="3"/>
            <rect x={x-bw/2} y={y} width={bw} height={3} fill="#60a5fa" rx="2"/>
            <text x={x} y={H+18} textAnchor="middle" fontSize="9.5" fill="#6b7280" fontFamily="Georgia,serif">{d.m}</text>
            <text x={x} y={y-5}  textAnchor="middle" fontSize="8.5" fill="#374151" fontFamily="Georgia,serif">{fmtM(d.v)}M</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects,     setProjects]     = useState([]);
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
      const [pr,mb,ma,ab,al] = await Promise.allSettled([
        api.get("projects/project/"),
        api.get("finance/measurement-book/"),
        api.get("finance/materials/"),
        api.get("finance/abstract-record/"),
        api.get("alerts/alerts/"),
      ]);
      if (pr.status==="fulfilled") setProjects(pr.value.data||[]);
      if (mb.status==="fulfilled") setMeasurements(mb.value.data||[]);
      if (ma.status==="fulfilled") setMaterials(ma.value.data||[]);
      if (ab.status==="fulfilled") setAbstracts(ab.value.data||[]);
      if (al.status==="fulfilled") setAlerts(al.value.data||[]);
      setLastUpdated(new Date());
    } catch(e){ console.error(e); } finally { setLoading(false); }
  },[]);

  useEffect(()=>{ fetchAll(); const t=setInterval(fetchAll,60000); return()=>clearInterval(t); },[fetchAll]);

  // ── Mark a single alert as read ─────────────────────────────────────────────
  const markRead = async (alertId) => {
    try {
      await api.patch(`alerts/alerts/${alertId}/`, { is_read: true });
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_read: true } : a));
    } catch(e) { console.error("Failed to mark alert read", e); }
  };

  const markAllMilestoneAlertsRead = async () => {
    const unreadMilestoneAlerts = alerts.filter(a => !a.is_read && a.milestone);
    await Promise.all(unreadMilestoneAlerts.map(a => markRead(a.id)));
  };

  // Budget math
  const usedMB    = sumBy(measurements.filter(m=>m.status==="VERIFIED"),  "total_amount");
  const usedMat   = sumBy(materials.filter(m=>m.status==="DELIVERED"),    "grand_total");
  const totalUsed = usedMB + usedMat;

  const committedMat   = sumBy(materials.filter(m=>m.status==="ORDERED"),                       "grand_total");
  const committedAbs   = sumBy(abstracts.filter(a=>["PENDING","APPROVED"].includes(a.status)), "grand_total");
  const totalCommitted = committedMat + committedAbs;
  const totalRemaining = Math.max(0, TOTAL_WARD_BUDGET - totalUsed - totalCommitted);

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

  const stats = {
    completed: projects.filter(p=>p.status==="COMPLETED").length,
    ongoing:   projects.filter(p=>p.status==="ONGOING").length,
    delayed:   projects.filter(p=>p.status==="DELAYED").length,
    cancelled: projects.filter(p=>p.status==="CANCELLED").length,
  };

  const monthlySpend = (()=>{
    const b={};
    measurements.filter(m=>m.status==="VERIFIED").forEach(m=>{
      if (!m.date) return;
      const [yr,mo]=m.date.split("-");
      const k=`${yr}-${mo}`;
      b[k]={m:NEPALI_MONTHS[mo]||mo, v:(b[k]?.v||0)+Number(m.total_amount||0)};
    });
    return Object.entries(b).sort(([a],[b])=>a.localeCompare(b)).slice(-8).map(([,v])=>v);
  })();

  // ── Milestone overdue alerts ─────────────────────────────────────────────────
  // Alerts where milestone is not null = milestone overdue alerts from backend
  const milestoneAlerts     = alerts.filter(a => a.milestone != null);
  const unreadMilestone     = milestoneAlerts.filter(a => !a.is_read);
  const unreadSystem        = alerts.filter(a => !a.is_read && a.milestone == null);

  const bannerAlerts = [
    ...(stats.delayed>0         ? [{type:"error",   msg:`${stats.delayed} project${stats.delayed>1?"s":""} delayed`}] : []),
    ...(unreadMilestone.length>0 ? [{type:"error",   msg:`${unreadMilestone.length} overdue milestone${unreadMilestone.length>1?"s":""}`}] : []),
    ...(unreadSystem.length>0    ? [{type:"warning", msg:`${unreadSystem.length} unread system alert${unreadSystem.length>1?"s":""}`}] : []),
    ...(pct(totalUsed,TOTAL_WARD_BUDGET)>=80 ? [{type:"warning",msg:`Budget at ${pct(totalUsed,TOTAL_WARD_BUDGET)}% — approaching limit`}] : []),
    {type:"info",msg:`Updated: ${lastUpdated?.toLocaleTimeString()||"—"}`},
  ];
  const banner = bannerAlerts[alertIdx % bannerAlerts.length];
  const bStyle = {error:"bg-red-600",warning:"bg-amber-500",info:"bg-slate-700"};

  const filtered = statusFilter==="ALL" ? projects : projects.filter(p=>p.status===statusFilter);

  if (loading) return (
    <div className="space-y-5 animate-pulse" style={{fontFamily:"Georgia,serif"}}>
      <div className="h-10 bg-gray-200 rounded-lg"/>
      <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_,i)=><div key={i} className="h-24 bg-gray-200 rounded-lg"/>)}</div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4"><div className="h-56 bg-gray-200 rounded-xl"/><div className="h-44 bg-gray-200 rounded-xl"/></div>
        <div className="space-y-4"><div className="h-72 bg-gray-200 rounded-xl"/><div className="h-28 bg-gray-200 rounded-xl"/></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5" style={{fontFamily:"Georgia,'Times New Roman',serif"}}>

      {/* ── Banner ── */}
      {banner && (
        <div className={`${bStyle[banner.type]} text-white px-5 py-2.5 rounded-lg flex items-center justify-between`}>
          <div className="flex items-center gap-3 text-sm"><AlertTriangle size={16}/><span>{banner.msg}</span></div>
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

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {label:"Completed",val:stats.completed,icon:<CheckCircle className="w-5 h-5"/>,bg:"bg-emerald-50",accent:"border-emerald-400",text:"text-emerald-700",sub:"finished",         path:"/app/projects/completed"},
          {label:"Ongoing",  val:stats.ongoing,  icon:<Activity    className="w-5 h-5"/>,bg:"bg-blue-50",  accent:"border-blue-400",   text:"text-blue-700",  sub:"in progress",     path:"/app/projects/ongoing"},
          {label:"Delayed",  val:stats.delayed,  icon:<Clock       className="w-5 h-5"/>,bg:"bg-red-50",   accent:"border-red-400",    text:"text-red-700",   sub:"need attention",  path:"/app/projects/delayed", badge:stats.delayed>0},
          {label:"Cancelled",val:stats.cancelled,icon:<XCircle     className="w-5 h-5"/>,bg:"bg-gray-100", accent:"border-gray-300",   text:"text-gray-600",  sub:"this FY",         path:"/app/projects/cancelled"},
        ].map(s=>(
          <div key={s.label} onClick={()=>navigate(s.path)}
            className={`${s.bg} border-l-4 ${s.accent} rounded-lg p-4 relative cursor-pointer hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-3xl font-bold ${s.text}`}>{s.val}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>
              <div className={`${s.text} opacity-25`}>{s.icon}</div>
            </div>
            {s.badge && <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">!</span>}
          </div>
        ))}
      </div>

      {/* ── MILESTONE OVERDUE ALERTS ── */}
      {milestoneAlerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-white"/>
              <div>
                <p className="text-white font-semibold text-sm">Overdue Milestone Alerts</p>
                <p className="text-red-200 text-xs mt-0.5">
                  {unreadMilestone.length} unread · {milestoneAlerts.length} total
                </p>
              </div>
            </div>
            {unreadMilestone.length > 0 && (
              <button
                onClick={markAllMilestoneAlertsRead}
                className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5"/> Mark all read
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-50">
            {milestoneAlerts.slice(0, 5).map(alert => {
              const daysAgo = alert.created_at
                ? Math.floor((new Date() - new Date(alert.created_at)) / 86400000)
                : 0;
              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                    alert.is_read ? "bg-white opacity-60" : "bg-red-50/40 hover:bg-red-50"
                  }`}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5 ${
                    alert.is_read ? "bg-gray-100" : "bg-red-100"
                  }`}>
                    <AlertTriangle className={`w-4 h-4 ${alert.is_read ? "text-gray-400" : "text-red-500"}`}/>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {/* Milestone name */}
                        <p className={`text-sm font-semibold ${alert.is_read ? "text-gray-500" : "text-gray-900"}`}>
                          {alert.milestone_name || "Milestone"} overdue
                          {!alert.is_read && (
                            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                          )}
                        </p>
                        {/* Project */}
                        <p className="text-xs text-gray-500 mt-0.5">
                          {alert.project_code} — {alert.project_name}
                        </p>
                        {/* Due date */}
                        {alert.milestone_due && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3"/>
                            Was due: {new Date(alert.milestone_due).toLocaleDateString("en-US", {
                              year:"numeric", month:"short", day:"numeric"
                            })}
                          </p>
                        )}
                        {/* Message */}
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{alert.message}</p>
                      </div>

                      {/* Right side: time + actions */}
                      <div className="flex-shrink-0 flex flex-col items-end gap-2">
                        <span className="text-[10px] text-gray-400">
                          {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                        </span>
                        <div className="flex gap-1.5">
                          {/* View project */}
                          <button
                            onClick={() => navigate(`/app/projects/${alert.project}/overview`)}
                            className="text-[10px] px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition"
                          >
                            View
                          </button>
                          {/* Mark read */}
                          {!alert.is_read && (
                            <button
                              onClick={() => markRead(alert.id)}
                              className="text-[10px] px-2 py-1 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded transition"
                            >
                              <X className="w-3 h-3"/>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Show more */}
            {milestoneAlerts.length > 5 && (
              <div className="px-6 py-3 bg-gray-50 text-center">
                <p className="text-xs text-gray-400">
                  + {milestoneAlerts.length - 5} more alerts — go to individual projects to view all
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 2-col layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">

          {/* Budget card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Ward Infrastructure Budget · FY 2081/82</p>
                  <p className="text-white text-2xl font-bold mt-0.5">NPR {fmt(TOTAL_WARD_BUDGET)}</p>
                  <p className="text-slate-400 text-xs mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"/>
                    Live · Approved Estimate: NPR {fmt(sumBy(abstracts.filter(a=>a.status==="APPROVED"),"grand_total"))}
                  </p>
                </div>
                <Wallet className="w-10 h-10 text-slate-500"/>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Utilization</span>
                  <span>{pct(totalUsed,TOTAL_WARD_BUDGET)}% used · {pct(totalCommitted,TOTAL_WARD_BUDGET)}% committed</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <div className="bg-blue-600 transition-all duration-1000" style={{width:`${pct(totalUsed,TOTAL_WARD_BUDGET)}%`}}/>
                    <div className="bg-amber-400 transition-all duration-1000" style={{width:`${pct(totalCommitted,TOTAL_WARD_BUDGET)}%`}}/>
                  </div>
                </div>
                <div className="flex gap-5 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-blue-600 inline-block"/>Used</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-400 inline-block"/>Committed</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-gray-200 inline-block"/>Remaining</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {label:"Total Used",val:totalUsed,bg:"bg-blue-600",text:"text-white",subCls:"text-blue-200",live:true,
                   breakdown:[{l:"Measurement (Verified)",v:usedMB},{l:"Materials (Delivered)",v:usedMat}]},
                  {label:"Committed",val:totalCommitted,bg:"bg-amber-50",text:"text-amber-800",subCls:"text-amber-500",
                   sub:"Ordered + Pending/Approved",
                   breakdown:[{l:"Materials (Ordered)",v:committedMat},{l:"Abstracts",v:committedAbs}]},
                  {label:"Remaining",val:totalRemaining,bg:"bg-emerald-50",text:"text-emerald-800",subCls:"text-emerald-500",
                   sub:`${pct(totalRemaining,TOTAL_WARD_BUDGET)}% available`},
                ].map(c=>(
                  <div key={c.label} className={`${c.bg} rounded-xl p-4`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-[10px] uppercase tracking-widest font-medium ${c.subCls}`}>{c.label}</p>
                      {c.live && <span className="flex items-center gap-1 text-blue-200 text-[10px]"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"/>LIVE</span>}
                    </div>
                    <p className={`text-base font-bold ${c.text} leading-tight`}>NPR {fmt(c.val)}</p>
                    <p className={`text-[10px] mt-0.5 ${c.subCls}`}>{c.sub}</p>
                    {c.breakdown && (
                      <div className={`mt-2 pt-2 border-t ${c.live?"border-blue-500":"border-amber-200"} space-y-0.5`}>
                        {c.breakdown.map(b=>(
                          <div key={b.l} className="flex justify-between text-[9px]">
                            <span className={c.subCls}>{b.l}</span>
                            <span className={`font-semibold ${c.text}`}>{fmtM(b.v)}M</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly spend bar chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">Monthly Expenditure</h3>
                <p className="text-xs text-gray-400 mt-0.5">From verified measurement books · last {monthlySpend.length} months</p>
              </div>
              {monthlySpend.length>1 && (
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="w-4 h-4 text-emerald-500"/>
                  <span className="text-emerald-600">
                    {monthlySpend[monthlySpend.length-1].v>=monthlySpend[monthlySpend.length-2].v?"+":""}
                    {pct(monthlySpend[monthlySpend.length-1].v-monthlySpend[monthlySpend.length-2].v,monthlySpend[monthlySpend.length-2].v)}% vs prev
                  </span>
                </div>
              )}
            </div>
            <SpendBar data={monthlySpend}/>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Budget Breakdown</h3>
              <span className="flex items-center gap-1 text-[10px] text-green-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"/>LIVE
              </span>
            </div>
            <div className="w-44 h-44 mx-auto">
              <DonutChart used={totalUsed} committed={totalCommitted} remaining={totalRemaining} total={TOTAL_WARD_BUDGET}/>
            </div>
            <div className="mt-4 space-y-2">
              {[
                {label:"Used",      val:totalUsed,      color:"bg-blue-600", p:pct(totalUsed,TOTAL_WARD_BUDGET)},
                {label:"Committed", val:totalCommitted, color:"bg-amber-400",p:pct(totalCommitted,TOTAL_WARD_BUDGET)},
                {label:"Remaining", val:totalRemaining, color:"bg-gray-200", p:pct(totalRemaining,TOTAL_WARD_BUDGET)},
              ].map(l=>(
                <div key={l.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className={`w-2.5 h-2.5 rounded-sm ${l.color} flex-shrink-0`}/>{l.label} <span className="text-gray-400">({l.p}%)</span>
                  </div>
                  <span className="font-semibold text-gray-800">{fmtM(l.val)}M</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Finance Records</h3>
            <div className="space-y-1">
              {[
                {icon:<FileText className="w-4 h-4"/>,label:"Measurement Books",count:measurements.length,color:"text-blue-600"},
                {icon:<Package  className="w-4 h-4"/>,label:"Material Records",  count:materials.length,   color:"text-amber-600"},
                {icon:<Wrench   className="w-4 h-4"/>,label:"Abstract Costs",    count:abstracts.length,   color:"text-purple-600"},
              ].map(m=>(
                <div key={m.label} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer group transition-all">
                  <div className="flex items-center gap-3"><div className={m.color}>{m.icon}</div><span className="text-sm text-gray-700">{m.label}</span></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{m.count}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500"/>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Spend by Source</p>
              {[{label:"Measurement Books",val:usedMB,color:"bg-blue-500"},{label:"Materials",val:usedMat,color:"bg-amber-500"}].map(s=>(
                <div key={s.label}>
                  <div className="flex justify-between text-[11px] text-gray-600 mb-0.5"><span>{s.label}</span><span className="font-medium">{fmtM(s.val)}M</span></div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full transition-all`} style={{width:`${pct(s.val,TOTAL_WARD_BUDGET)}%`}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System alerts (non-milestone) */}
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

      {/* ── Project table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800">All Projects</h3>
            <p className="text-xs text-gray-400 mt-0.5">{projects.length} total · {filtered.length} shown</p>
          </div>
          <div className="flex gap-1.5">
            {["ALL","ONGOING","DELAYED","COMPLETED","CANCELLED"].map(s=>(
              <button key={s} onClick={()=>setStatusFilter(s)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${statusFilter===s?"bg-slate-800 text-white":"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {s}
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
              <tr className="border-b border-gray-50">
                {["Project","Contractor","Estimated Budget","Used","Progress","Status",""].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[11px] text-gray-400 uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p=>{
                const meta=STATUS_META[p.status]||STATUS_META.ONGOING;
                const pb=pMap[p.id]||{estimated:0,used:0};
                const up=pct(pb.used,pb.estimated);
                const over=pb.estimated>0 && up>=90;
                // Check if this project has unread milestone alerts
                const hasAlert = unreadMilestone.some(a => a.project === p.id);
                return (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors group cursor-pointer"
                    onClick={()=>navigate(`/app/projects/${p.id}`)}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {hasAlert && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Has overdue milestones"/>
                        )}
                        <div>
                          <p className="text-[10px] text-gray-400 font-mono">{p.project_code}</p>
                          <p className="text-sm font-medium text-gray-800 mt-0.5 max-w-xs leading-snug">{p.project_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-300 flex-shrink-0"/>
                        <span className="text-xs text-gray-600">{contractorName(p)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {pb.estimated>0
                        ? <p className="text-sm font-semibold text-gray-700">NPR {fmt(pb.estimated)}</p>
                        : <p className="text-xs text-gray-400 italic">No approved abstract</p>}
                      {p.planned_completion_date && <p className="text-[10px] text-gray-400 mt-0.5">Due {p.planned_completion_date}</p>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-semibold ${over?"text-red-600":"text-blue-600"}`}>
                        NPR {fmt(pb.used)}{over && <span className="ml-1 text-[10px]">⚠</span>}
                      </span>
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
                <td className="px-4 py-3 text-xs font-semibold text-blue-600">Used: NPR {fmt(filtered.reduce((s,p)=>s+(pMap[p.id]?.used||0),0))}</td>
                <td colSpan={3}/>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}