import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, FileText, AlertTriangle } from "lucide-react";

export default function DelayedProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDelayedProjects();
  }, []);

  const fetchDelayedProjects = async () => {
    try {
      setLoading(true);
      
      // Mock data for testing - replace with actual API call when backend is ready
      const mockProjects = [
        {
          id: 1,
          name: "Nepalgunj-Kohalpur Highway Section",
          image: null,
          location: { district: "Banke" },
          contractor: { name: "Western Mega Projects Ltd" },
          hasDelayLog: false
        },
        {
          id: 2,
          name: "Ring Road Expansion Project",
          image: null,
          location: { district: "Kathmandu" },
          contractor: { name: "ABC Construction" },
          hasDelayLog: true
        },
        {
          id: 3,
          name: "Bridge Construction - Koshi River",
          image: null,
          location: { district: "Sunsari" },
          contractor: { name: "Bridge Builders Ltd" },
          hasDelayLog: false
        },
        {
          id: 4,
          name: "Rural Road Network - Phase 2",
          image: null,
          location: { district: "Dhading" },
          contractor: { name: "Mountain Roads Co" },
          hasDelayLog: true
        }
      ];
      
      // Simulate API delay
      setTimeout(() => {
        setProjects(mockProjects);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      console.error("Error fetching delayed projects:", err);
      setLoading(false);
    }
  };

  const handleViewProject = (projectId) => {
    // Navigate to project overview with state indicating it came from delayed projects
    navigate(`/app/projects/${projectId}/overview`, {
      state: { from: 'delayed' }
    });
  };

  const handleWeeklyLogs = (projectId) => {
    // Navigate to weekly logs page (can add new logs)
    navigate(`/app/projects/${projectId}/weekly-logs`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading delayed projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-800">Delayed Projects</h1>
        </div>
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold">
          {projects.length} Projects
        </div>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500">No delayed projects found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            // Check if project has delay logs
            const hasDelayLog = project.hasDelayLog || false;
            
            return (
              <div
                key={project.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                {/* Project Info */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={project.image || "https://via.placeholder.com/80"}
                    alt={project.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">
                      {project.location?.district} • {project.contractor?.name}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleViewProject(project.id)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  
                  <button
                    onClick={() => handleWeeklyLogs(project.id)}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Weekly Logs
                  </button>
                  
                  {hasDelayLog ? (
                    <span className="bg-green-500 text-white px-4 py-2 rounded-md font-medium">
                      Logged
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-4 py-2 rounded-md font-medium">
                      Missing Log
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}