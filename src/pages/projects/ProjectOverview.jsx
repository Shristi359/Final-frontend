import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Calendar, DollarSign, User, Building2,
  FileText, AlertCircle, CheckCircle2, Clock, Loader2,
  Plus, Edit, Trash2, X, AlertTriangle,
} from "lucide-react";
import api from "../../api/axios";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-NP").format(Math.round(Number(n) || 0));
const pct = (a, b) => b > 0 ? Math.min(100, Math.round((a / b) * 100)) : 0;
const sumBy = (arr, k) => arr.reduce((s, x) => s + (Number(x[k]) || 0), 0);

function getCookie(name) {
  let v = null;
  if (document.cookie) {
    document.cookie.split(";").forEach(c => {
      c = c.trim();
      if (c.startsWith(name + "=")) v = decodeURIComponent(c.slice(name.length + 1));
    });
  }
  return v;
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" }) : "N/A";

// ─── Per-project mini donut: Estimated vs Used vs Remaining ──────────────────
function ProjectDonut({ estimated, used }) {
  const cx = 80, cy = 80, r = 58, sw = 18;
  const circ = 2 * Math.PI * r;
  const isOver    = used > estimated && estimated > 0;
  const usedCapped = Math.min(used, estimated);
  const remaining  = Math.max(0, estimated - used);
  const total      = estimated || 1;

  // Normal: blue used + gray remaining
  // Over budget: full red ring
  const segs = isOver ? [
    { p: 1, col: "#ef4444" }, // full red = over budget
  ] : [
    { p: usedCapped / total, col: "#1d4ed8" },
    { p: remaining  / total, col: "#e5e7eb" },
  ];

  let cum = 0;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="w-36 h-36 flex-shrink-0">
        {segs.map((s, i) => {
          const dash = s.p * circ;
          const off  = circ - cum * circ;
          cum += s.p;
          return (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={s.col} strokeWidth={sw}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={off} strokeLinecap="butt"
              style={{ transition: "stroke-dasharray 1s ease" }} />
          );
        })}
        {isOver && (
          <text x={cx} y={cy - 8} textAnchor="middle" fontSize="10" fill="#ef4444" fontFamily="Georgia,serif">OVER</text>
        )}
        {!isOver && (
          <text x={cx} y={cy - 8} textAnchor="middle" fontSize="10" fill="#6b7280" fontFamily="Georgia,serif">USED</text>
        )}
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="16"
          fill={isOver ? "#ef4444" : "#111827"} fontWeight="700" fontFamily="Georgia,serif">
          {pct(used, estimated)}%
        </text>
        <text x={cx} y={cy + 22} textAnchor="middle" fontSize="8" fill="#9ca3af" fontFamily="Georgia,serif">of estimate</text>
      </svg>
      <div className="space-y-3 flex-1">
        {[
          { label: "Approved Estimate", val: estimated, color: "border-blue-600 bg-blue-50",      text: "text-blue-700"    },
          { label: "Used",              val: used,      color: isOver ? "border-red-500 bg-red-50" : "border-emerald-500 bg-emerald-50", text: isOver ? "text-red-700" : "text-emerald-700" },
          { label: "Remaining",         val: remaining, color: "border-gray-300 bg-gray-50",      text: remaining === 0 ? "text-red-400" : "text-gray-700" },
        ].map(l => (
          <div key={l.label} className={`border-l-3 pl-3 py-1.5 rounded-r ${l.color}`} style={{ borderLeftWidth: 3 }}>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{l.label}</p>
            <p className={`text-sm font-bold ${l.text}`}>NPR {fmt(l.val)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProjectOverview() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project,    setProject]    = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [abstracts,  setAbstracts]  = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [materials,  setMaterials]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // Milestone form
  const [showForm,   setShowForm]   = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [formData,   setFormData]   = useState({ milestone_name:"", milestone_order:"", weight:"", planned_start_date:"", planned_completion_date:"" });
  const [formLoading,setFormLoading]= useState(false);
  const [formError,  setFormError]  = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const [projRes, msRes, absRes, mbRes, matRes] = await Promise.allSettled([
        api.get(`projects/project/${projectId}/`),
        api.get(`milestones/milestone/?project=${projectId}`),
        api.get(`finance/abstract-record/?project=${projectId}`),
        api.get(`finance/measurement-book/?project=${projectId}`),
        api.get(`finance/materials/?project=${projectId}`),
      ]);
      if (projRes.status === "fulfilled") setProject(projRes.value.data);
      else setError("Failed to load project");
      if (msRes.status  === "fulfilled") setMilestones(msRes.value.data || []);
      if (absRes.status === "fulfilled") setAbstracts(absRes.value.data || []);
      if (mbRes.status  === "fulfilled") setMeasurements(mbRes.value.data || []);
      if (matRes.status === "fulfilled") setMaterials(matRes.value.data || []);
    } catch (e) {
      setError("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [projectId]);

  // ── Budget numbers for THIS project ─────────────────────────────────────────
  // Estimated = sum of APPROVED abstract costs for this project
  const estimatedBudget = sumBy(abstracts.filter(a => a.status === "APPROVED"), "grand_total");

  // Used = VERIFIED measurements + DELIVERED materials for this project
  const usedMB  = sumBy(measurements.filter(m => m.status === "VERIFIED"),  "total_amount");
  const usedMat = sumBy(materials.filter(m => m.status === "DELIVERED"),     "grand_total");
  const totalUsed = usedMB + usedMat;

  // Committed = ORDERED materials + PENDING abstracts
  const committedMat = sumBy(materials.filter(m => m.status === "ORDERED"),  "grand_total");
  const committedAbs = sumBy(abstracts.filter(a => a.status === "PENDING"),  "grand_total");

  // ── Milestone progress ────────────────────────────────────────────────────────
  const totalWeight     = milestones.reduce((s, m) => s + parseFloat(m.weight || 0), 0);
  const completedWeight = milestones.filter(m => m.is_completed).reduce((s, m) => s + parseFloat(m.weight || 0), 0);
  // completedWeight is already a % value (weights are e.g. 10, 25, 50 summing to 100)
  // So progress % = completedWeight directly (not divided by anything)
  // Example: milestones 10% + 20% + 70%, only 10% done → progress = 10%
  // Example: all done → progress = 100%
  const progress = completedWeight;

  const availableWeight = (excludeId = null) => {
    const used = milestones.filter(m => m.id !== excludeId).reduce((s, m) => s + parseFloat(m.weight || 0), 0);
    return 100 - used;
  };

  const handleAddMilestone = () => {
    if (availableWeight() <= 0) { alert("Total weight already at 100%"); return; }
    setEditing(null);
    setFormData({ milestone_name:"", milestone_order: milestones.length + 1, weight:"", planned_start_date:"", planned_completion_date:"" });
    setShowForm(true);
  };

  const handleEditMilestone = (m) => {
    setEditing(m);
    setFormData({ milestone_name: m.milestone_name, milestone_order: m.milestone_order, weight: m.weight, planned_start_date: m.planned_start_date || "", planned_completion_date: m.planned_completion_date || "" });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this milestone?")) return;
    try {
      await api.delete(`milestones/milestone/${id}/`);
      await load();
    } catch { alert("Failed to delete."); }
  };

  const handleToggle = async (m) => {
    // Optimistically update UI immediately so progress bar responds right away
    setMilestones(prev => prev.map(ms =>
      ms.id === m.id ? { ...ms, is_completed: !ms.is_completed } : ms
    ));
    try {
      await api.patch(`milestones/milestone/${m.id}/`, { is_completed: !m.is_completed });
      // Reload to confirm server state
      const res = await api.get(`milestones/milestone/?project=${projectId}`);
      setMilestones(res.data || []);
    } catch {
      // Revert optimistic update on failure
      setMilestones(prev => prev.map(ms =>
        ms.id === m.id ? { ...ms, is_completed: m.is_completed } : ms
      ));
      alert("Failed to update milestone. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const w = parseFloat(formData.weight);
    const avail = availableWeight(editing?.id);
    if (isNaN(w) || w <= 0) { setFormError("Weight must be positive"); return; }
    if (w > avail) { setFormError(`Exceeds available ${avail.toFixed(2)}%`); return; }
    setFormLoading(true); setFormError(null);
    try {
      const payload = {
        project:                parseInt(projectId),
        milestone_name:         formData.milestone_name,
        milestone_order:        parseInt(formData.milestone_order),
        weight:                 w,
        planned_start_date:     formData.planned_start_date || null,
        planned_completion_date: formData.planned_completion_date || null,
        is_critical_path:       false,
        is_completed:           editing?.is_completed || false,
      };
      if (editing) await api.put(`milestones/milestone/${editing.id}/`, payload);
      else         await api.post("milestones/milestone/", payload);
      await load();
      setShowForm(false); setEditing(null);
    } catch (e) {
      setFormError(e.response?.data ? JSON.stringify(e.response.data) : "Failed to save");
    } finally { setFormLoading(false); }
  };

  // ── Status helpers ───────────────────────────────────────────────────────────
  const statusConfig = {
    ONGOING:   { color:"bg-blue-100 text-blue-800",   icon: Clock,        label:"Ongoing"   },
    COMPLETED: { color:"bg-green-100 text-green-800",  icon: CheckCircle2, label:"Completed" },
    DELAYED:   { color:"bg-red-100 text-red-800",      icon: AlertCircle,  label:"Delayed"   },
    CANCELLED: { color:"bg-gray-100 text-gray-800",    icon: AlertCircle,  label:"Cancelled" },
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600"/>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );

  if (error || !project) return (
    <div className="flex flex-col items-center justify-center h-64">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4"/>
      <p className="text-gray-600">{error || "Project not found"}</p>
      <button onClick={() => navigate("/app/projects")} className="mt-4 text-blue-600 hover:underline">← Back</button>
    </div>
  );

  const sc = statusConfig[project.status] || statusConfig.ONGOING;
  const StatusIcon = sc.icon;
  const avail = availableWeight(editing?.id);

  return (
    <div className="space-y-6" style={{ fontFamily: "Georgia, serif" }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/app/projects")} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5"/>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.project_name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Code: {project.project_code}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${sc.color}`}>
          <StatusIcon className="w-4 h-4"/> {sc.label}
        </span>
      </div>

      {/* ── Budget & Donut ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-3">
          <p className="text-slate-300 text-xs uppercase tracking-widest">Project Budget Overview</p>
        </div>
        <div className="p-6">
          {estimatedBudget > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Donut - cap at 100% visually, show red if over */}
              <ProjectDonut estimated={estimatedBudget} used={totalUsed} />
              {/* Detail breakdown */}
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Breakdown</p>
                {[
                  { label: "Approved Estimates (Abstract)", val: estimatedBudget, cls: "text-gray-800",    bg: "bg-gray-50"   },
                  { label: "Verified Measurement Books",    val: usedMB,          cls: "text-blue-700",   bg: "bg-blue-50"   },
                  { label: "Delivered Materials",           val: usedMat,         cls: "text-blue-700",   bg: "bg-blue-50"   },
                  { label: "Ordered Materials (Committed)", val: committedMat,    cls: "text-amber-700",  bg: "bg-amber-50"  },
                  { label: "Pending Abstracts (Committed)", val: committedAbs,    cls: "text-amber-700",  bg: "bg-amber-50"  },
                ].map(r => (
                  <div key={r.label} className={`flex justify-between items-center px-3 py-2 rounded-lg ${r.bg}`}>
                    <span className="text-xs text-gray-600">{r.label}</span>
                    <span className={`text-sm font-semibold ${r.cls}`}>NPR {fmt(r.val)}</span>
                  </div>
                ))}

                {/* ── Budget status indicator ── */}
                {(() => {
                  const usedPct   = pct(totalUsed, estimatedBudget);
                  const totalCmtd = totalUsed + committedMat + committedAbs;
                  const cmtdPct   = pct(totalCmtd, estimatedBudget);

                  if (totalUsed > estimatedBudget) return (
                    <div className="flex items-start gap-2 bg-red-50 border-2 border-red-300 rounded-lg p-3">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"/>
                      <div>
                        <p className="text-xs font-bold text-red-700">⛔ OVER BUDGET</p>
                        <p className="text-xs text-red-600 mt-0.5">
                          Exceeded by NPR {fmt(totalUsed - estimatedBudget)} ({usedPct - 100}% over).
                          No further measurement verification or material delivery should be recorded.
                        </p>
                      </div>
                    </div>
                  );
                  if (totalCmtd > estimatedBudget) return (
                    <div className="flex items-start gap-2 bg-orange-50 border border-orange-300 rounded-lg p-3">
                      <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5"/>
                      <div>
                        <p className="text-xs font-bold text-orange-700">⚠ Committed spend will exceed budget</p>
                        <p className="text-xs text-orange-600 mt-0.5">
                          Total committed (used + ordered + pending) is NPR {fmt(totalCmtd)} — {cmtdPct - 100}% over estimate.
                        </p>
                      </div>
                    </div>
                  );
                  if (usedPct >= 80) return (
                    <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5"/>
                      <p className="text-xs text-yellow-700">
                        <strong>{usedPct}% used</strong> — approaching budget limit. Remaining: NPR {fmt(estimatedBudget - totalUsed)}.
                      </p>
                    </div>
                  );
                  return (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0"/>
                      <p className="text-xs text-green-700">
                        <strong>{usedPct}% used</strong> — NPR {fmt(estimatedBudget - totalUsed)} remaining.
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0"/>
              <div>
                <p className="text-sm font-medium text-amber-800">No Approved Budget Estimate</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Go to the Abstract tab and approve a cost estimate to see budget tracking here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Milestone Progress ── */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Overall Progress</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {milestones.filter(m => m.is_completed).length} of {milestones.length} milestones completed
              · click checkbox to mark done/undone
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-blue-600">{progress.toFixed(1)}%</span>
            <p className="text-xs text-gray-400 mt-0.5">
              {completedWeight.toFixed(1)}% of {totalWeight.toFixed(1)}% assigned weight
            </p>
          </div>
        </div>

        {/* Main progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden mb-1">
          <div
            className="h-5 rounded-full transition-all duration-700 bg-blue-600 flex items-center justify-end pr-2"
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            {progress >= 15 && (
              <span className="text-white text-xs font-bold">{progress.toFixed(0)}%</span>
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-4">
          <span>0%</span>
          <span>100%</span>
        </div>

        {/* Per-milestone rows */}
        {milestones.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No milestones added yet</p>
        ) : (
          <div className="space-y-2 border-t border-gray-100 pt-4">
            {[...milestones].sort((a, b) => a.milestone_order - b.milestone_order).map(m => (
              <div key={m.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  m.is_completed
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200 hover:border-blue-200"
                }`}>
                {/* Toggle checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggle(m)}
                  title={m.is_completed ? "Mark incomplete" : "Mark complete"}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    m.is_completed
                      ? "bg-green-500 border-green-500 hover:bg-green-600"
                      : "border-gray-300 bg-white hover:border-blue-500"
                  }`}>
                  {m.is_completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>

                {/* Order badge */}
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  {m.milestone_order}
                </span>

                {/* Name */}
                <span className={`flex-1 text-sm ${m.is_completed ? "line-through text-gray-400" : "text-gray-800 font-medium"}`}>
                  {m.milestone_name}
                </span>

                {/* Weight badge */}
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  m.is_completed ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-600"
                }`}>
                  {parseFloat(m.weight).toFixed(1)}%
                </span>

                {/* Dates */}
                {m.planned_completion_date && (
                  <span className="text-xs text-gray-400 hidden md:block">
                    Due {formatDate(m.planned_completion_date)}
                  </span>
                )}

                {/* Edit/Delete */}
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleEditMilestone(m)} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(m.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Total weight assigned: <strong>{totalWeight.toFixed(1)}%</strong>
            {totalWeight < 100 && <span className="text-orange-500 ml-1">({(100 - totalWeight).toFixed(1)}% unassigned)</span>}
            {totalWeight >= 100 && <span className="text-green-600 ml-1">✓</span>}
          </span>
          {totalWeight < 100 && milestones.length > 0 && (
            <span className="text-orange-500 italic">Add more milestones to reach 100%</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main left */}
        <div className="lg:col-span-2 space-y-6">

          {project.project_description && (
            <Card title="Project Description" icon={FileText}>
              <p className="text-gray-700 whitespace-pre-wrap text-sm">{project.project_description}</p>
            </Card>
          )}

          <Card title="Location Details" icon={MapPin}>
            <InfoGrid>
              <InfoItem label="Ward No"          value={project.ward_no || project.location_details?.ward_no} />
              <InfoItem label="Municipality"     value={project.municipality || project.location_details?.municipality} />
              <InfoItem label="District"         value={project.district || project.location_details?.district} />
              <InfoItem label="Province"         value={project.province || project.location_details?.province} />
              <InfoItem label="Street / Place"   value={project.location_details?.place_or_street || project.location} fullWidth />
            </InfoGrid>
          </Card>

          <Card title="Project Timeline" icon={Calendar}>
            <InfoGrid>
              <InfoItem label="Planned Start"      value={formatDate(project.planned_start_date)} />
              <InfoItem label="Planned Completion"  value={formatDate(project.planned_completion_date)} />
              <InfoItem label="Duration"            value={project.planned_duration_days ? `${project.planned_duration_days} days` : "N/A"} />
              <InfoItem label="Fiscal Year"         value={project.fiscal_year_details?.year_label || project.fiscal_year} />
            </InfoGrid>
          </Card>

          <Card title="Personnel" icon={User}>
            <InfoGrid>
              <InfoItem label="Engineer"    value={project.assigned_engineer_details?.account?.full_name || "Not assigned"} />
              <InfoItem label="Chairperson" value={project.chairperson_details?.account?.full_name || "Not assigned"} />
              <InfoItem label="Contractor"  value={project.contractor_details?.contractor_name || project.contractor_details?.company_name || "Not assigned"} fullWidth />
            </InfoGrid>
          </Card>

          {/* Milestones — Add/Edit form only (list is in progress section above) */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600"/> Add / Edit Milestone
              </h3>
              <button onClick={handleAddMilestone} disabled={totalWeight >= 100}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus className="w-4 h-4"/> Add Milestone
              </button>
            </div>
            {showForm ? (
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">{editing ? "Edit" : "Add"} Milestone</h4>
                  <button onClick={()=>{ setShowForm(false); setEditing(null); setFormError(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
                </div>
                {formError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{formError}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input type="text" required value={formData.milestone_name}
                        onChange={e=>setFormData(p=>({...p,milestone_name:e.target.value}))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. Base Layer"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order *</label>
                      <input type="number" required min="1" value={formData.milestone_order}
                        onChange={e=>setFormData(p=>({...p,milestone_order:e.target.value}))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (%) * — max {avail.toFixed(1)}%</label>
                      <input type="number" required step="0.01" min="0.01" max={avail} value={formData.weight}
                        onChange={e=>setFormData(p=>({...p,weight:e.target.value}))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" placeholder={`Max ${avail.toFixed(1)}`}/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Planned Start</label>
                      <input type="date" value={formData.planned_start_date}
                        onChange={e=>setFormData(p=>({...p,planned_start_date:e.target.value}))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Planned Completion</label>
                      <input type="date" value={formData.planned_completion_date}
                        onChange={e=>setFormData(p=>({...p,planned_completion_date:e.target.value}))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"/>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-3 border-t">
                    <button type="button" onClick={()=>{ setShowForm(false); setEditing(null); setFormError(null); }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
                    <button type="submit" disabled={formLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm disabled:opacity-50">
                      {formLoading && <Loader2 className="w-4 h-4 animate-spin"/>}
                      {editing ? "Update" : "Add"} Milestone
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="px-6 py-4 text-sm text-gray-400">
                {totalWeight >= 100
                  ? "All 100% weight assigned. Edit existing milestones above to adjust."
                  : `${(100 - totalWeight).toFixed(1)}% weight remaining — click "Add Milestone" to continue.`}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow text-white p-6">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-widest text-slate-300">Quick Stats</h3>
            <div className="space-y-3">
              {[
                { label:"Status",    val: project.status   },
                { label:"Priority",  val: project.priority_details?.name || project.priority },
                { label:"Progress",  val: `${Math.round(progress)}%` },
                { label:"Duration",  val: project.planned_duration_days ? `${project.planned_duration_days}d` : "N/A" },
                { label:"Milestones",val: `${milestones.filter(m=>m.is_completed).length}/${milestones.length}` },
                { label:"Est. Budget",val: estimatedBudget > 0 ? `NPR ${fmt(estimatedBudget)}` : "No estimate" },
                { label:"Used",      val: totalUsed > 0 ? `NPR ${fmt(totalUsed)}` : "NPR 0" },
              ].map(s=>(
                <div key={s.label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{s.label}</span>
                  <span className="font-semibold text-right max-w-[55%] text-xs">{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          <Card title="Budget Source" icon={DollarSign}>
            <div className="space-y-2 text-sm">
              <InfoItem label="Source" value={project.budget_source_details?.name || "N/A"} />
              <InfoItem label="Fiscal Year" value={project.fiscal_year_details?.year_label || "N/A"} />
              <InfoItem label="Project Type" value={project.project_type_details?.name || "N/A"} />
            </div>
          </Card>

          {project.project_document && (
            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-blue-600"/> Project Document
              </h3>
              <a href={project.project_document} target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                View Document →
              </a>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Metadata</h3>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between"><span>Project ID</span><span className="text-gray-700 font-mono">{project.id}</span></div>
              <div className="flex justify-between"><span>Created</span><span className="text-gray-700">{formatDate(project.created_at)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable components ──────────────────────────────────────────────────────
function Card({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
          {Icon && <Icon className="w-4 h-4 text-blue-600"/>}{title}
        </h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
function InfoGrid({ children }) { return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>; }
function InfoItem({ label, value, fullWidth = false }) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <dt className="text-xs font-medium text-gray-500 mb-0.5">{label}</dt>
      <dd className="text-sm text-gray-900 font-medium">{value || "N/A"}</dd>
    </div>
  );
}