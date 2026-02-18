import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  Calendar, 
  Camera, 
  Users, 
  CloudRain,
  Wrench,
  FileText,
  AlertCircle,
  Plus,
  X,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Edit,
  CheckCircle2
} from "lucide-react";

export default function WeeklyLogs() {
  const { projectId } = useParams();
  
  const [logs, setLogs] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  
  const [formData, setFormData] = useState({
    log_date: "",
    milestone: "",
    weather_conditions: "",
    crew_size: "",
    equipment_used: "",
    work_progress_detail: "",
    area_completed: "",
    issues_risks: "",
    next_week_plan: "",
    is_milestone_completed: false,
    created_by: "",
    log_photo: null
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [logsRes, milestonesRes, engineersRes] = await Promise.all([
        fetch(`/api/logs/weekly-logs/?project=${projectId}`, { credentials: 'include' }),
        fetch(`/api/milestones/milestone/?project=${projectId}`, { credentials: 'include' }),
        fetch(`/api/engineers/engineer/`, { credentials: 'include' })
      ]);
      
      const logsData = await logsRes.json();
      const milestonesData = await milestonesRes.json();
      const engineersData = await engineersRes.json();
      
      setLogs(logsData);
      setMilestones(milestonesData);
      setEngineers(engineersData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "milestone") {
      // When the milestone changes, pre-populate the completion checkbox
      // based on the milestone's CURRENT is_completed state (master truth).
      const picked = milestones.find(m => m.id === Number(value));
      setFormData(prev => ({
        ...prev,
        milestone: value,
        is_milestone_completed: picked ? picked.is_completed : false,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    setFormError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, log_photo: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLog = () => {
    setShowForm(true);
    setEditingLog(null);
    setFormData({
      log_date: new Date().toISOString().split('T')[0],
      milestone: "",
      weather_conditions: "",
      crew_size: "",
      equipment_used: "",
      work_progress_detail: "",
      area_completed: "",
      issues_risks: "",
      next_week_plan: "",
      is_milestone_completed: false,
      created_by: "",
      log_photo: null
    });
    setPhotoPreview(null);
  };

  const handleEditLog = (log) => {
    setEditingLog(log);
    setShowForm(true);
    setFormData({
      log_date: log.log_date,
      milestone: log.milestone,
      weather_conditions: log.weather_conditions,
      crew_size: log.crew_size,
      equipment_used: log.equipment_used,
      work_progress_detail: log.work_progress_detail,
      area_completed: log.area_completed,
      issues_risks: log.issues_risks || "",
      next_week_plan: log.next_week_plan,
      is_milestone_completed: log.is_milestone_completed,
      created_by: log.created_by,
      log_photo: null
    });
    setPhotoPreview(log.log_photo || null);
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm("Are you sure you want to delete this log?")) {
      return;
    }

    try {
      const response = await fetch(`/api/logs/weekly-logs/${logId}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCookie('csrftoken')
        }
      });

      if (response.ok) {
        await fetchData();
        alert("Log deleted successfully");
      } else {
        alert("Failed to delete log");
      }
    } catch (error) {
      console.error("Error deleting log:", error);
      alert("Failed to delete log");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('project', projectId);
      formDataToSend.append('log_date', formData.log_date);
      formDataToSend.append('milestone', formData.milestone);
      formDataToSend.append('weather_conditions', formData.weather_conditions);
      formDataToSend.append('crew_size', formData.crew_size);
      formDataToSend.append('equipment_used', formData.equipment_used);
      formDataToSend.append('work_progress_detail', formData.work_progress_detail);
      formDataToSend.append('area_completed', formData.area_completed);
      formDataToSend.append('issues_risks', formData.issues_risks || '');
      formDataToSend.append('next_week_plan', formData.next_week_plan);
      formDataToSend.append('is_milestone_completed', formData.is_milestone_completed);
      formDataToSend.append('created_by', formData.created_by);
      
      if (formData.log_photo && formData.log_photo instanceof File) {
        formDataToSend.append('log_photo', formData.log_photo);
      }

      const url = editingLog
        ? `/api/logs/weekly-logs/${editingLog.id}/`
        : `/api/logs/weekly-logs/`;
      
      const method = editingLog ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: formDataToSend
      });

      if (response.ok) {
        await fetchData();
        setShowForm(false);
        setEditingLog(null);
        alert(editingLog ? "Log updated successfully" : "Log added successfully");
      } else {
        const errorData = await response.json();
        setFormError(JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error saving log:", error);
      setFormError("Failed to save log");
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMilestoneName = (milestoneId) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    return milestone ? milestone.milestone_name : 'N/A';
  };

  const getMilestoneWeight = (milestoneId) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    return milestone ? parseFloat(milestone.weight) : null;
  };

  const getEngineerName = (engineerId) => {
    const engineer = engineers.find(e => e.id === engineerId);
    return engineer?.account?.full_name || 'N/A';
  };

  // Derive the selected milestone object while the form is open
  const selectedMilestone = milestones.find(m => m.id === Number(formData.milestone));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading weekly logs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Weekly Site Logs</h2>
        <button
          onClick={handleAddLog}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Add Weekly Log
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingLog ? 'Edit Weekly Log' : 'Add New Weekly Log'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingLog(null);
                  setFormError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {formError}
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Log Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="log_date"
                    value={formData.log_date}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Milestone <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="milestone"
                    value={formData.milestone}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Milestone</option>
                    {milestones.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.milestone_order}. {m.milestone_name} ({parseFloat(m.weight).toFixed(1)}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weather Conditions <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="weather_conditions"
                    value={formData.weather_conditions}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Sunny, Rainy, Cloudy"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crew Size <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="crew_size"
                    value={formData.crew_size}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="Number of workers"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Equipment & Work Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment Used <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="equipment_used"
                    value={formData.equipment_used}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    placeholder="List equipment used on site"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Progress Detail <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="work_progress_detail"
                    value={formData.work_progress_detail}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Describe the work completed this week"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area Completed <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="area_completed"
                    value={formData.area_completed}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 500m stretch, Foundation of Building A"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issues / Risks
                  </label>
                  <textarea
                    name="issues_risks"
                    value={formData.issues_risks}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Any issues or risks encountered (optional)"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Week Plan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="next_week_plan"
                    value={formData.next_week_plan}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    placeholder="Plan for next week's work"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logged By <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="created_by"
                    value={formData.created_by}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Engineer</option>
                    {engineers.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.account?.full_name || `Engineer #${e.id}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ── Dynamic milestone completion checkbox ── */}
                <div className="flex items-start pt-6">
                  {(() => {
                    // Already completed from Project Overview (not via this log)
                    const alreadyDoneElsewhere =
                      selectedMilestone?.is_completed && !formData.is_milestone_completed;

                    return (
                      <label className={`flex items-start gap-3 rounded-lg border p-3 w-full transition-colors ${
                        selectedMilestone?.is_completed
                          ? "bg-green-50 border-green-300"
                          : "bg-gray-50 border-gray-200 hover:border-blue-300"
                      } ${!selectedMilestone ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                        <input
                          type="checkbox"
                          name="is_milestone_completed"
                          checked={formData.is_milestone_completed}
                          onChange={handleInputChange}
                          // Disable unchecking if milestone was already completed from Overview
                          // — only Overview can unmark it
                          disabled={!selectedMilestone || alreadyDoneElsewhere}
                          className="mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div className="flex-1 min-w-0">
                          {selectedMilestone ? (
                            <>
                              <p className="text-sm font-medium text-gray-800 leading-snug">
                                Is <span className="text-blue-700 font-semibold">"{selectedMilestone.milestone_name}"</span> completed?
                              </p>
                              {alreadyDoneElsewhere ? (
                                <p className="text-xs text-green-600 mt-0.5">
                                  ✓ Already marked complete in Project Overview. To unmark, use the milestone toggle there.
                                </p>
                              ) : (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Checking this will add{" "}
                                  <strong className="text-green-700">
                                    {parseFloat(selectedMilestone.weight).toFixed(1)}%
                                  </strong>{" "}
                                  to overall project progress.
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-gray-400 italic">Select a milestone first</p>
                          )}
                        </div>
                        {selectedMilestone?.is_completed && (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        )}
                      </label>
                    );
                  })()}
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Photo
                </label>
                <div className="flex items-start gap-4">
                  <label className="flex-shrink-0 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition">
                      <div className="flex flex-col items-center gap-2">
                        <Camera className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-600">Upload Photo</span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {photoPreview && (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null);
                          setFormData(prev => ({ ...prev, log_photo: null }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingLog(null);
                    setFormError(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingLog ? 'Update Log' : 'Add Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logs List */}
      {logs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Weekly Logs Yet</h3>
          <p className="text-gray-500 mb-4">Start tracking weekly progress by adding your first log</p>
          <button
            onClick={handleAddLog}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add First Log
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">{formatDate(log.log_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                      <span className="text-sm font-medium text-blue-700">
                        {getMilestoneName(log.milestone)}
                      </span>
                      {getMilestoneWeight(log.milestone) && (
                        <span className="text-xs text-blue-400">
                          {getMilestoneWeight(log.milestone).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    {log.is_milestone_completed && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Milestone Completed</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditLog(log)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <InfoItem icon={CloudRain} label="Weather" value={log.weather_conditions} />
                    <InfoItem icon={Users} label="Crew Size" value={`${log.crew_size} workers`} />
                    <InfoItem icon={Wrench} label="Equipment" value={log.equipment_used} />
                    <InfoItem label="Area Completed" value={log.area_completed} />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Work Progress</h4>
                      <p className="text-sm text-gray-900">{log.work_progress_detail}</p>
                    </div>
                    
                    {log.issues_risks && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          Issues / Risks
                        </h4>
                        <p className="text-sm text-gray-900">{log.issues_risks}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Next Week Plan</h4>
                      <p className="text-sm text-gray-900">{log.next_week_plan}</p>
                    </div>
                  </div>
                </div>

                {/* Photo */}
                {log.log_photo && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Site Photo
                    </h4>
                    <img
                      src={log.log_photo}
                      alt="Site photo"
                      className="w-full max-w-md rounded-lg border"
                    />
                  </div>
                )}

                {/* Footer */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                  <span>Logged by: <strong>{getEngineerName(log.created_by)}</strong></span>
                  <span>Created: {formatDate(log.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </h4>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
}