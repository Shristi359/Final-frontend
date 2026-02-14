import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertTriangle, X, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";

export default function DelayLogs() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [delayLogs, setDelayLogs] = useState([]);
  const [projectInfo, setProjectInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingLog, setEditingLog] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchDelayLogs();
      fetchProjectInfo();
    }
  }, [projectId]);

  const fetchDelayLogs = async () => {
    try {
      // Mock data for testing - replace with actual API call when backend is ready
      const mockLogs = [
        {
          id: 1,
          logDate: "2024-07-15",
          delayType: "Weather",
          estimatedDays: 10,
          progress: 65,
          description: "Heavy monsoon rainfall causing work stoppage",
          actions: "Covered exposed areas, rescheduled workforce",
          impact: "10 days delay in concrete work",
          reportedBy: "Site Engineer - Ram Prasad",
          status: "Resolved"
        },
        {
          id: 2,
          logDate: "2024-07-20",
          delayType: "Material Shortage",
          estimatedDays: 15,
          progress: 68,
          description: "Cement shortage due to supply chain issues",
          actions: "Ordered from alternative supplier",
          impact: "15 days delay overall",
          reportedBy: "Project Manager - Sita Sharma",
          status: "Ongoing"
        }
      ];
      
      setTimeout(() => {
        setDelayLogs(mockLogs);
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error fetching delay logs:", error);
      setLoading(false);
    }
  };

  const fetchProjectInfo = async () => {
    try {
      // Mock data - replace with actual API call when backend is ready
      setProjectInfo({
        id: projectId,
        name: "Nepalgunj-Kohalpur Highway Section",
        totalDelayDays: 45,
        hasDocumentation: true
      });
    } catch (error) {
      console.error("Error fetching project info:", error);
    }
  };

  const handleAddLog = () => {
    setEditingLog(null);
    setShowModal(true);
  };

  const handleEditLog = (log) => {
    setEditingLog(log);
    setShowModal(true);
  };

  const handleDeleteLog = async (logId) => {
    if (window.confirm("Are you sure you want to delete this delay log?")) {
      try {
        setDelayLogs(delayLogs.filter(log => log.id !== logId));
        alert("Delay log deleted successfully!");
      } catch (error) {
        console.error("Error deleting delay log:", error);
        alert("Failed to delete delay log.");
      }
    }
  };

  const handleSubmitLog = (logData) => {
    if (editingLog) {
      // Update existing log
      setDelayLogs(delayLogs.map(log => 
        log.id === editingLog.id ? { ...logData, id: editingLog.id } : log
      ));
    } else {
      // Add new log
      setDelayLogs([...delayLogs, { ...logData, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingLog(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Ongoing":
        return "bg-yellow-100 text-yellow-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading delay logs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/projects/delayed')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Back to Delayed Projects"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Delay Logs Management
            </h1>
            {projectInfo && (
              <p className="text-sm text-gray-600 mt-1">{projectInfo.name}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleAddLog}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Add Delay Log
        </button>
      </div>

      {/* Alert Card - Show if no logs */}
      {delayLogs.length === 0 && projectInfo && (
        <div className="border border-red-400 bg-red-50 rounded-xl p-5 flex justify-between items-center">
          <div>
            <p className="font-semibold">{projectInfo.name}</p>
            <p className="text-sm text-red-600">
              Delayed for {projectInfo.totalDelayDays} days - NO DOCUMENTATION
            </p>
          </div>

          <button
            onClick={handleAddLog}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
          >
            Submit Delay Log
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">TOTAL DELAY LOGS</p>
          <p className="text-3xl font-bold text-gray-900">{delayLogs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">RESOLVED</p>
          <p className="text-3xl font-bold text-green-600">
            {delayLogs.filter(log => log.status === "Resolved").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">ONGOING</p>
          <p className="text-3xl font-bold text-yellow-600">
            {delayLogs.filter(log => log.status === "Ongoing").length}
          </p>
        </div>
      </div>

      {/* Delay Logs Table */}
      {delayLogs.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Log Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delay Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estimated Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {delayLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.logDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.delayType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                      {log.estimatedDays} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.progress}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {log.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditLog(log)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <DelayLogModal
          onClose={() => {
            setShowModal(false);
            setEditingLog(null);
          }}
          onSubmit={handleSubmitLog}
          projectName={projectInfo?.name}
          editingLog={editingLog}
        />
      )}
    </div>
  );
}

/* ================= MODAL COMPONENT ================= */

function DelayLogModal({ onClose, onSubmit, projectName, editingLog }) {
  const [formData, setFormData] = useState({
    logDate: editingLog?.logDate || "",
    delayType: editingLog?.delayType || "",
    estimatedDays: editingLog?.estimatedDays || "",
    progress: editingLog?.progress || "",
    description: editingLog?.description || "",
    actions: editingLog?.actions || "",
    impact: editingLog?.impact || "",
    reportedBy: editingLog?.reportedBy || "",
    status: editingLog?.status || "Ongoing",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.logDate || !formData.delayType || !formData.estimatedDays || 
        !formData.description || !formData.actions || !formData.reportedBy) {
      alert("Please fill in all required fields");
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={22} />
            <h2 className="text-lg font-semibold">
              {editingLog ? "Edit Delay Log" : "Project Delay Log"} 
              {projectName && ` - ${projectName}`}
            </h2>
          </div>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
            <X />
          </button>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700">
          <strong>Important:</strong> Use this form to document any delays
          affecting the project timeline.
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Input label="Log Date *" type="date" name="logDate" value={formData.logDate} onChange={handleChange} required />
          <Select label="Delay Type *" name="delayType" value={formData.delayType} onChange={handleChange}
            options={["Weather", "Material Shortage", "Labor Issues", "Administrative Delay", "Technical Issues", "Equipment Failure", "Design Changes", "Other"]} required />
          <Input label="Estimated Delay (Days) *" name="estimatedDays" type="number" value={formData.estimatedDays} placeholder="e.g., 15" onChange={handleChange} required />
          <Input label="Current Progress (%)" name="progress" type="number" value={formData.progress} placeholder="e.g., 65" onChange={handleChange} min="0" max="100" />
          <Textarea label="Delay Description *" name="description" value={formData.description} placeholder="Provide detailed description..." onChange={handleChange} required />
          <Textarea label="Actions Taken *" name="actions" value={formData.actions} placeholder="Describe corrective actions..." onChange={handleChange} required />
          <Textarea label="Impact on Schedule" name="impact" value={formData.impact} placeholder="Describe schedule impact..." onChange={handleChange} />
          <Input label="Reported By *" name="reportedBy" value={formData.reportedBy} placeholder="Your name and position" onChange={handleChange} required />
          <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={["Ongoing", "Resolved", "Critical"]} />

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition font-medium">
              {editingLog ? "Update Delay Log" : "Submit Delay Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, name, type = "text", placeholder, onChange, value, required, min, max }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input type={type} name={name} value={value} placeholder={placeholder} onChange={onChange} required={required} min={min} max={max}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
    </div>
  );
}

function Textarea({ label, name, placeholder, onChange, value, required }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea name={name} value={value} rows="4" placeholder={placeholder} onChange={onChange} required={required}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
    </div>
  );
}

function Select({ label, name, options, onChange, value, required }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select name={name} value={value} onChange={onChange} required={required}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
        <option value="">Select {label.replace(" *", "")}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}