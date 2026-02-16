import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  Building2, 
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  Edit,
  Trash2,
  X,
  AlertTriangle
} from "lucide-react";

export default function ProjectOverview() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Milestone form state
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [milestoneFormData, setMilestoneFormData] = useState({
    milestone_name: "",
    milestone_order: "",
    weight: "",
    planned_start_date: "",
    planned_completion_date: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      
      const [projectResponse, milestonesResponse] = await Promise.all([
        fetch(`/api/projects/project/${projectId}/`).then(r => r.json()),
        fetch(`/api/milestones/milestone/?project=${projectId}`).then(r => r.json())
      ]);
      
      setProject(projectResponse);
      setMilestones(milestonesResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError("Failed to load project details");
      setLoading(false);
    }
  };

  // Calculate total weight of milestones (excluding the one being edited)
  const calculateTotalWeight = (excludeMilestoneId = null) => {
    return milestones
      .filter(m => m.id !== excludeMilestoneId)
      .reduce((sum, m) => sum + parseFloat(m.weight || 0), 0);
  };

  // Calculate available weight
  const getAvailableWeight = () => {
    const currentTotal = calculateTotalWeight(editingMilestone?.id);
    return 100 - currentTotal;
  };

  // Validate weight
  const validateWeight = (weight) => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return "Weight must be a positive number";
    }
    
    const availableWeight = getAvailableWeight();
    if (weightNum > availableWeight) {
      return `Weight exceeds available ${availableWeight.toFixed(2)}%`;
    }
    
    return null;
  };

  // Get weight status
  const getWeightStatus = () => {
    const total = calculateTotalWeight();
    const currentFormWeight = parseFloat(milestoneFormData.weight) || 0;
    const projectedTotal = total + currentFormWeight;
    
    if (editingMilestone) {
      return {
        total: projectedTotal,
        remaining: 100 - projectedTotal,
        isComplete: projectedTotal === 100,
        isOverLimit: projectedTotal > 100
      };
    }
    
    return {
      total: projectedTotal,
      remaining: 100 - projectedTotal,
      isComplete: projectedTotal === 100,
      isOverLimit: projectedTotal > 100
    };
  };

  const handleMilestoneFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMilestoneFormData({
      ...milestoneFormData,
      [name]: type === 'checkbox' ? checked : value
    });
    setFormError(null);
  };

  const handleAddMilestone = () => {
    const availableWeight = getAvailableWeight();
    if (availableWeight <= 0) {
      alert("Cannot add milestone: Total weight already at 100%");
      return;
    }
    
    setShowMilestoneForm(true);
    setEditingMilestone(null);
    setMilestoneFormData({
      milestone_name: "",
      milestone_order: milestones.length + 1,
      weight: "",
      planned_start_date: "",
      planned_completion_date: ""
    });
  };

  const handleEditMilestone = (milestone) => {
    setEditingMilestone(milestone);
    setShowMilestoneForm(true);
    setMilestoneFormData({
      milestone_name: milestone.milestone_name,
      milestone_order: milestone.milestone_order,
      weight: milestone.weight,
      planned_start_date: milestone.planned_start_date || "",
      planned_completion_date: milestone.planned_completion_date || ""
    });
  };

  const handleDeleteMilestone = async (milestoneId) => {
    if (!window.confirm("Are you sure you want to delete this milestone?")) {
      return;
    }

    try {
      const response = await fetch(`/api/milestones/milestone/${milestoneId}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCookie('csrftoken')
        }
      });

      if (response.ok) {
        await fetchProjectDetails();
        alert("Milestone deleted successfully");
      } else {
        alert("Failed to delete milestone");
      }
    } catch (error) {
      console.error("Error deleting milestone:", error);
      alert("Failed to delete milestone");
    }
  };

  const handleMilestoneSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    // Validate weight
    const weightError = validateWeight(milestoneFormData.weight);
    if (weightError) {
      setFormError(weightError);
      setFormLoading(false);
      return;
    }

    try {
      const data = {
        project: parseInt(projectId),
        milestone_name: milestoneFormData.milestone_name,
        milestone_order: parseInt(milestoneFormData.milestone_order),
        weight: parseFloat(milestoneFormData.weight),
        planned_start_date: milestoneFormData.planned_start_date || null,
        planned_completion_date: milestoneFormData.planned_completion_date || null,
        is_critical_path: false,
        is_completed: editingMilestone?.is_completed || false
      };

      const url = editingMilestone
        ? `/api/milestones/milestone/${editingMilestone.id}/`
        : `/api/milestones/milestone/`;
      
      const method = editingMilestone ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await fetchProjectDetails();
        setShowMilestoneForm(false);
        setEditingMilestone(null);
        alert(editingMilestone ? "Milestone updated successfully" : "Milestone added successfully");
      } else {
        const errorData = await response.json();
        setFormError(JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error saving milestone:", error);
      setFormError("Failed to save milestone");
    } finally {
      setFormLoading(false);
    }
  };

  const toggleMilestoneComplete = async (milestone) => {
    try {
      const response = await fetch(`/api/milestones/milestone/${milestone.id}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          is_completed: !milestone.is_completed
        })
      });

      if (response.ok) {
        await fetchProjectDetails();
      }
    } catch (error) {
      console.error("Error toggling milestone:", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ONGOING: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Ongoing' },
      COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Completed' },
      DELAYED: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Delayed' },
      CANCELLED: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'Cancelled' },
    };
    
    const config = statusConfig[status] || statusConfig.ONGOING;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      LOW: { color: 'bg-gray-100 text-gray-800', label: 'Low' },
      MEDIUM: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      HIGH: { color: 'bg-red-100 text-red-800', label: 'High' },
    };
    
    const config = priorityConfig[priority] || priorityConfig.MEDIUM;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProgress = () => {
    if (milestones.length === 0) return 0;
    const completedWeight = milestones
      .filter(m => m.is_completed)
      .reduce((sum, m) => sum + parseFloat(m.weight || 0), 0);
    return Math.round(completedWeight);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading project details...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-gray-600">{error || "Project not found"}</p>
        <button
          onClick={() => navigate('/app/projects')}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Back to Projects
        </button>
      </div>
    );
  }

  const progress = calculateProgress();
  const currentWeightTotal = calculateTotalWeight();
  const weightStatus = getWeightStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/projects')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.project_name}</h1>
            <p className="text-sm text-gray-500 mt-1">Code: {project.project_code}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(project.status)}
          {getPriorityBadge(project.priority)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Overall Progress</h3>
          <span className="text-2xl font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-500">
            {milestones.filter(m => m.is_completed).length} of {milestones.length} milestones completed
          </p>
          <p className="text-sm font-medium text-gray-700">
            Total Weight: {currentWeightTotal.toFixed(2)}%
            {currentWeightTotal < 100 && (
              <span className="text-orange-600 ml-2">
                ({(100 - currentWeightTotal).toFixed(2)}% remaining)
              </span>
            )}
          </p>
        </div>
        
        {/* Weight Warning */}
        {currentWeightTotal < 100 && milestones.length > 0 && (
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-800">
              <strong>Warning:</strong> Total milestone weight is {currentWeightTotal.toFixed(2)}%. 
              You need to add {(100 - currentWeightTotal).toFixed(2)}% more to reach 100%.
            </p>
          </div>
        )}
        
        {currentWeightTotal === 100 && milestones.length > 0 && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">
              <strong>Perfect!</strong> All milestones total to 100% weight.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Description */}
          {project.project_description && (
            <Card title="Project Description" icon={FileText}>
              <p className="text-gray-700 whitespace-pre-wrap">{project.project_description}</p>
            </Card>
          )}

          {/* Location Details */}
          <Card title="Location Details" icon={MapPin}>
            <InfoGrid>
              <InfoItem label="Ward No" value={project.ward_no} />
              <InfoItem label="Municipality" value={project.municipality} />
              <InfoItem label="District" value={project.district} />
              <InfoItem label="Province" value={project.province} />
              <InfoItem label="Specific Location" value={project.location} fullWidth />
            </InfoGrid>
          </Card>

          {/* Budget Information */}
          <Card title="Budget Information" icon={DollarSign}>
            <InfoGrid>
              <InfoItem 
                label="Total Approved Budget" 
                value={formatCurrency(project.total_approved_budget)} 
              />
              <InfoItem 
                label="Budget Source" 
                value={project.budget_source_details?.name || 'N/A'} 
              />
              <InfoItem 
                label="Fiscal Year" 
                value={project.fiscal_year_details?.year_label || 'N/A'} 
              />
            </InfoGrid>
          </Card>

          {/* Timeline */}
          <Card title="Project Timeline" icon={Calendar}>
            <InfoGrid>
              <InfoItem label="Proposed Date" value={formatDate(project.proposed_date)} />
              <InfoItem label="Approved Date" value={formatDate(project.approved_date)} />
              <InfoItem label="Planned Start" value={formatDate(project.planned_start_date)} />
              <InfoItem label="Planned Completion" value={formatDate(project.planned_completion_date)} />
              <InfoItem label="Duration" value={project.planned_duration_days ? `${project.planned_duration_days} days` : 'N/A'} />
            </InfoGrid>
          </Card>

          {/* Personnel */}
          <Card title="Personnel & Contractor" icon={User}>
            <InfoGrid>
              <InfoItem 
                label="Assigned Engineer" 
                value={project.assigned_engineer_details?.account?.full_name || 'Not Assigned'} 
              />
              <InfoItem 
                label="Chairperson" 
                value={project.chairperson_details?.account?.full_name || 'Not Assigned'} 
              />
              <InfoItem 
                label="Contractor" 
                value={project.contractor_details?.contractor_name || 'Not Assigned'} 
                fullWidth
              />
              {project.contractor_contact_person && (
                <InfoItem 
                  label="Contractor Contact Person" 
                  value={project.contractor_contact_person} 
                  fullWidth
                />
              )}
            </InfoGrid>
          </Card>

          {/* Milestones Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Project Milestones
              </h3>
              <button
                onClick={handleAddMilestone}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition"
                disabled={currentWeightTotal >= 100}
              >
                <Plus className="w-4 h-4" />
                Add Milestone
              </button>
            </div>
            
            <div className="p-6">
              {/* Milestone Form */}
              {showMilestoneForm && (
                <div className="mb-6 bg-gray-50 rounded-lg p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">
                      {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
                    </h4>
                    <button
                      onClick={() => {
                        setShowMilestoneForm(false);
                        setEditingMilestone(null);
                        setFormError(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {formError && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {formError}
                    </div>
                  )}

                  {/* Weight Status Indicator */}
                  <div className={`mb-4 p-3 rounded-lg border ${
                    weightStatus.isOverLimit ? 'bg-red-50 border-red-200' :
                    weightStatus.isComplete ? 'bg-green-50 border-green-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {weightStatus.isOverLimit ? '❌ Over Limit' :
                         weightStatus.isComplete ? '✅ Complete' :
                         '⚠️ In Progress'}
                      </span>
                      <span>
                        Projected Total: <strong>{weightStatus.total.toFixed(2)}%</strong>
                        {' | '}
                        Remaining: <strong>{weightStatus.remaining.toFixed(2)}%</strong>
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Milestone Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="milestone_name"
                          value={milestoneFormData.milestone_name}
                          onChange={handleMilestoneFormChange}
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Foundation Work"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Order <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="milestone_order"
                          value={milestoneFormData.milestone_order}
                          onChange={handleMilestoneFormChange}
                          required
                          min="1"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (%) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="weight"
                          value={milestoneFormData.weight}
                          onChange={handleMilestoneFormChange}
                          required
                          min="0.01"
                          max={getAvailableWeight()}
                          step="0.01"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Max: ${getAvailableWeight().toFixed(2)}`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Available: {getAvailableWeight().toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Planned Start Date
                        </label>
                        <input
                          type="date"
                          name="planned_start_date"
                          value={milestoneFormData.planned_start_date}
                          onChange={handleMilestoneFormChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Planned Completion Date
                        </label>
                        <input
                          type="date"
                          name="planned_completion_date"
                          value={milestoneFormData.planned_completion_date}
                          onChange={handleMilestoneFormChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setShowMilestoneForm(false);
                          setEditingMilestone(null);
                          setFormError(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={formLoading || weightStatus.isOverLimit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                      >
                        {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingMilestone ? 'Update' : 'Add'} Milestone
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Milestones List */}
              {milestones.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Milestones Yet</h3>
                  <p className="text-gray-500 mb-4">Add milestones to track project progress</p>
                  <button
                    onClick={handleAddMilestone}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add First Milestone
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {milestones
                    .sort((a, b) => a.milestone_order - b.milestone_order)
                    .map((milestone) => (
                      <div 
                        key={milestone.id}
                        className={`border rounded-lg p-4 transition ${
                          milestone.is_completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 flex items-start gap-3">
                            <button
                              onClick={() => toggleMilestoneComplete(milestone)}
                              className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                                milestone.is_completed
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300 hover:border-blue-500'
                              }`}
                            >
                              {milestone.is_completed && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              )}
                            </button>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex-shrink-0">
                                  {milestone.milestone_order}
                                </span>
                                <h4 className={`font-medium ${milestone.is_completed ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                                  {milestone.milestone_name}
                                </h4>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 ml-11">
                                <span className="font-semibold text-blue-600">
                                  {milestone.weight}% weight
                                </span>
                                {milestone.planned_start_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Start: {formatDate(milestone.planned_start_date)}
                                  </span>
                                )}
                                {milestone.planned_completion_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    End: {formatDate(milestone.planned_completion_date)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEditMilestone(milestone)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMilestone(milestone.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          
          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow text-white p-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <StatItem label="Status" value={project.status} />
              <StatItem label="Priority" value={project.priority} />
              <StatItem label="Progress" value={`${progress}%`} />
              <StatItem 
                label="Days Planned" 
                value={project.planned_duration_days || 'N/A'} 
              />
              <StatItem 
                label="Milestones" 
                value={`${milestones.filter(m => m.is_completed).length}/${milestones.length}`} 
              />
            </div>
          </div>

          {/* Project Document */}
          {project.project_document && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Project Document
              </h3>
              <a
                href={project.project_document}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                View Document →
              </a>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Metadata</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="text-gray-900">{formatDate(project.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Project ID:</span>
                <span className="text-gray-900">{project.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get CSRF token
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

// Reusable Components
function Card({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          {title}
        </h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function InfoGrid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  );
}

function InfoItem({ label, value, fullWidth = false }) {
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
      <dd className="text-sm text-gray-900 font-medium">{value || 'N/A'}</dd>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-blue-100">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}