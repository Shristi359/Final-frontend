import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Eye, Calendar, Upload, X } from "lucide-react";

export default function WeeklyLogs() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    logDate: "",
    selectedMilestone: "",
    weatherConditions: "",
    crewSize: "",
    equipmentUsed: "",
    workProgressDetail: "",
    issuesRisks: "",
    planForTomorrow: "",
    sitePhotos: [],
    milestoneCompleted: false
  });

  useEffect(() => {
    fetchWeeklyLogs();
    fetchMilestones();
    fetchProjectInfo();
  }, [projectId]);

  const fetchProjectInfo = async () => {
    try {
      // TODO: Get project status to determine if completed
      // For completed projects, milestone checkbox shouldn't affect anything
      setProjectStatus("ONGOING"); // or "COMPLETED", "DELAYED"
    } catch (error) {
      console.error("Error fetching project info:", error);
    }
  };

  const fetchWeeklyLogs = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/projects/${projectId}/weekly-logs/`);
      
      const mockLogs = [
        {
          id: "WL-001",
          weekNumber: "Week 1",
          logDate: "2024-01-12",
          milestone: "Land Acquisition & Clearance",
          weatherConditions: "Sunny, 25°C",
          crewSize: 15,
          equipmentUsed: "Excavator, Roller, Paver",
          workProgressDetail: "Completed land clearing for section A. Removed vegetation and debris. Total area cleared: 2.5 hectares. Site preparation in progress.",
          issuesRisks: "Minor delay due to equipment maintenance. Safety concerns addressed with additional barriers.",
          planForTomorrow: "Begin excavation work in section B. Deploy additional equipment. Conduct safety briefing for new crew members.",
          sitePhotos: [
            "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1590586767908-20d6d1b6db58?w=400&h=300&fit=crop"
          ],
          milestoneCompleted: false,
          createdBy: "Site Engineer",
          createdAt: "2024-01-12"
        },
        {
          id: "WL-002",
          weekNumber: "Week 3",
          logDate: "2024-01-26",
          milestone: "Land Acquisition & Clearance",
          weatherConditions: "Partly cloudy, 23°C",
          crewSize: 18,
          equipmentUsed: "Bulldozer, Excavator, Dump Trucks (3 units)",
          workProgressDetail: "Excavation of section B completed. Soil testing conducted. Foundation groundwork initiated. Total excavation: 3,500 cubic meters. Milestone achieved.",
          issuesRisks: "Unexpected water table encountered at depth of 4m. Pumping equipment deployed and issue resolved.",
          planForTomorrow: "Start next milestone activities. Prepare equipment for foundation work.",
          sitePhotos: [
            "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop"
          ],
          milestoneCompleted: true,
          createdBy: "Project Manager",
          createdAt: "2024-01-26"
        },
        {
          id: "WL-003",
          weekNumber: "Week 5",
          logDate: "2024-02-09",
          milestone: "Bridge Foundation",
          weatherConditions: "Rainy, 20°C - work suspended on Day 3",
          crewSize: 22,
          equipmentUsed: "Pile driver, Concrete mixer, Reinforcement tools",
          workProgressDetail: "Bridge foundation work in progress. Pile driving completed for piers 1-3. Concrete pouring scheduled for next week. Weather causing minor delays.",
          issuesRisks: "Rain caused 1-day work suspension. Additional waterproofing measures required. Schedule adjusted.",
          planForTomorrow: "Continue pile driving for remaining piers. Monitor weather conditions. Prepare for concrete work.",
          sitePhotos: [
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1628193726550-31c1f5de6b7d?w=400&h=300&fit=crop"
          ],
          milestoneCompleted: false,
          createdBy: "Bridge Engineer",
          createdAt: "2024-02-09"
        }
      ];

      setLogs(mockLogs);
      setProjectName("Nepalgunj-Kohalpur Highway Section");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weekly logs:", error);
      setLoading(false);
    }
  };

  const fetchMilestones = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/projects/${projectId}/milestones/`);
      
      const mockMilestones = [
        { id: "M1", name: "Land Acquisition & Clearance", weight: 10, completed: true },
        { id: "M2", name: "Design & Engineering", weight: 5, completed: true },
        { id: "M3", name: "Site Mobilization", weight: 5, completed: true },
        { id: "M4", name: "Earthwork & Excavation", weight: 15, completed: true },
        { id: "M5", name: "Bridge Foundation", weight: 20, completed: false },
        { id: "M6", name: "Bridge Superstructure", weight: 20, completed: false },
        { id: "M7", name: "Pavement Base Layer", weight: 10, completed: false },
        { id: "M8", name: "Surface Layer Application", weight: 10, completed: false },
        { id: "M9", name: "Road Furniture Installation", weight: 3, completed: false },
        { id: "M10", name: "Final Testing & QA", weight: 2, completed: false }
      ];

      setMilestones(mockMilestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  const handleAddLog = () => {
    setShowAddForm(true);
  };

  const handleViewLog = (log) => {
    setSelectedLog(log);
    setShowViewModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // TODO: Replace with actual API call
      // await api.post(`/projects/${projectId}/weekly-logs/`, formData);
      
      // Get milestone name from id
      const selectedMilestoneName = milestones.find(m => m.id === formData.selectedMilestone)?.name || formData.selectedMilestone;
      
      const newLog = {
        id: `WL-${Date.now()}`,
        weekNumber: `Week ${logs.length + 1}`,
        milestone: selectedMilestoneName,
        ...formData,
        createdBy: "Current User",
        createdAt: new Date().toISOString()
      };
      
      setLogs([newLog, ...logs]);
      
      // If milestone completed AND project is not already completed, update milestone status
      if (formData.milestoneCompleted && formData.selectedMilestone && projectStatus !== "COMPLETED") {
        const updatedMilestones = milestones.map(m => 
          m.id === formData.selectedMilestone ? { ...m, completed: true } : m
        );
        setMilestones(updatedMilestones);
        
        // TODO: Send milestone update to backend
        // await api.patch(`/projects/${projectId}/milestones/${formData.selectedMilestone}/`, { completed: true });
        
        // TODO: Update project progress based on milestone weights
        // const newProgress = calculateProgress(updatedMilestones);
        // await api.patch(`/projects/${projectId}/`, { progress: newProgress });
      }
      
      // Reset form
      setFormData({
        logDate: "",
        selectedMilestone: "",
        weatherConditions: "",
        crewSize: "",
        equipmentUsed: "",
        workProgressDetail: "",
        issuesRisks: "",
        planForTomorrow: "",
        sitePhotos: [],
        milestoneCompleted: false
      });
      
      setShowAddForm(false);
      alert("Weekly log added successfully!");
    } catch (error) {
      console.error("Error adding weekly log:", error);
      alert("Failed to add weekly log. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // In real app, upload to server and get URLs
    const fileUrls = files.map(file => URL.createObjectURL(file));
    setFormData({ ...formData, sitePhotos: [...formData.sitePhotos, ...fileUrls] });
  };

  const removePhoto = (index) => {
    const newPhotos = formData.sitePhotos.filter((_, i) => i !== index);
    setFormData({ ...formData, sitePhotos: newPhotos });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateProgress = () => {
    const totalWeight = milestones.reduce((sum, m) => sum + m.weight, 0);
    const completedWeight = milestones
      .filter(m => m.completed)
      .reduce((sum, m) => sum + m.weight, 0);
    return Math.round((completedWeight / totalWeight) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading weekly logs...</div>
      </div>
    );
  }

  // Add Form View
  if (showAddForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAddForm(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Add Weekly Log</h2>
        </div>

        <form onSubmit={handleFormSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Log Date *</label>
              <input
                type="date"
                value={formData.logDate}
                onChange={(e) => setFormData({ ...formData, logDate: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Milestone *</label>
              <select
                value={formData.selectedMilestone}
                onChange={(e) => setFormData({ ...formData, selectedMilestone: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Milestone</option>
                {milestones.map(milestone => (
                  <option key={milestone.id} value={milestone.id}>
                    {milestone.name} {milestone.completed ? "(Completed)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weather Conditions</label>
            <input
              type="text"
              value={formData.weatherConditions}
              onChange={(e) => setFormData({ ...formData, weatherConditions: e.target.value })}
              placeholder="e.g., Sunny, 75°F"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crew Size</label>
            <input
              type="number"
              value={formData.crewSize}
              onChange={(e) => setFormData({ ...formData, crewSize: e.target.value })}
              placeholder="Number of workers"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Used</label>
            <input
              type="text"
              value={formData.equipmentUsed}
              onChange={(e) => setFormData({ ...formData, equipmentUsed: e.target.value })}
              placeholder="e.g., Excavator, Roller, Paver"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Progress Detail *</label>
            <textarea
              value={formData.workProgressDetail}
              onChange={(e) => setFormData({ ...formData, workProgressDetail: e.target.value })}
              required
              rows={4}
              placeholder="Describe today's work accomplishments, areas completed, quantities installed..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issues & Risks Encountered *</label>
            <textarea
              value={formData.issuesRisks}
              onChange={(e) => setFormData({ ...formData, issuesRisks: e.target.value })}
              required
              rows={4}
              placeholder="Document any problems, delays, safety concerns, or potential risks..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan for Tomorrow</label>
            <textarea
              value={formData.planForTomorrow}
              onChange={(e) => setFormData({ ...formData, planForTomorrow: e.target.value })}
              rows={4}
              placeholder="Outline tomorrow's planned activities, tasks, and objectives..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Evidence / Photos</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload photos</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each</span>
              </label>
            </div>

            {formData.sitePhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {formData.sitePhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img src={photo} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Only show milestone completion checkbox if project is not completed */}
          {projectStatus !== "COMPLETED" && (
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.milestoneCompleted}
                  onChange={(e) => setFormData({ ...formData, milestoneCompleted: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Has this milestone been completed?
                </span>
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Log
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Main List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Weekly Progress Logs</h2>
            <p className="text-sm text-gray-500 mt-1">{projectName}</p>
          </div>
        </div>
        <button
          onClick={handleAddLog}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Log
        </button>
      </div>

      {/* Progress Card - Only show if not completed */}
      {projectStatus !== "COMPLETED" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress</h3>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Completion</span>
              <span className="text-sm font-bold text-gray-900">{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {milestones.filter(m => m.completed).length} of {milestones.length} milestones completed
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">TOTAL LOGS</p>
          <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">MILESTONES COMPLETED</p>
          <p className="text-2xl font-bold text-green-600">
            {logs.filter(l => l.milestoneCompleted).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">IN PROGRESS</p>
          <p className="text-2xl font-bold text-blue-600">
            {logs.filter(l => !l.milestoneCompleted).length}
          </p>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-200">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No weekly logs recorded yet. Click "Add Log" to create one.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900">{log.weekNumber}</h3>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{formatDate(log.logDate)}</span>
                      {log.milestoneCompleted && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                          Milestone Completed
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 font-medium mb-2 ml-8">
                      Milestone: {log.milestone}
                    </p>
                    
                    <div className="text-sm text-gray-600 ml-8 space-y-1">
                      <p><span className="font-medium">Weather:</span> {log.weatherConditions}</p>
                      <p><span className="font-medium">Crew Size:</span> {log.crewSize} workers</p>
                      <p className="line-clamp-2">{log.workProgressDetail}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewLog(log)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedLog.weekNumber} - Log Details</h2>
                <p className="text-sm text-gray-500">{formatDate(selectedLog.logDate)}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Log Date</label>
                <p className="text-gray-900">{formatDate(selectedLog.logDate)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Milestone</label>
                <p className="text-gray-900">{selectedLog.milestone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weather Conditions</label>
                <p className="text-gray-900">{selectedLog.weatherConditions}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crew Size</label>
                <p className="text-gray-900">{selectedLog.crewSize} workers</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Used</label>
                <p className="text-gray-900">{selectedLog.equipmentUsed}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Progress Detail</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedLog.workProgressDetail}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issues & Risks Encountered</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedLog.issuesRisks}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan for Tomorrow</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedLog.planForTomorrow}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Evidence / Photos</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedLog.sitePhotos.map((photo, idx) => (
                    <div key={idx} className="aspect-video rounded-lg overflow-hidden border">
                      <img 
                        src={photo} 
                        alt={`Site photo ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => window.open(photo, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedLog.milestoneCompleted}
                    disabled
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Milestone completed</span>
                </label>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Created by: <span className="font-medium text-gray-900">{selectedLog.createdBy}</span>
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}