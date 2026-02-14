import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CompletedProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedProjects();
  }, []);

  const fetchCompletedProjects = async () => {
    try {
      // Mock data - replace with actual API call when backend is ready
      const mockData = [
        {
          id: "PRJ-2024-001",
          name: "Ward Road Improvement Project",
          image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=150&fit=crop"
        },
        {
          id: "PRJ-2024-002",
          name: "Bridge Construction Project",
          image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=200&h=150&fit=crop"
        },
        {
          id: "PRJ-2024-003",
          name: "Drainage System Installation",
          image: "https://images.unsplash.com/photo-1590586767908-20d6d1b6db58?w=200&h=150&fit=crop"
        },
        {
          id: "PRJ-2024-004",
          name: "Highway Expansion Phase 2",
          image: "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=200&h=150&fit=crop"
        },
        {
          id: "PRJ-2024-005",
          name: "Pedestrian Walkway Construction",
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=150&fit=crop"
        },
        {
          id: "PRJ-2024-006",
          name: "Rural Road Improvement",
          image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=200&h=150&fit=crop"
        },
        {
          id: "PRJ-2024-007",
          name: "Urban Intersection Upgrade",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop"
        },
        {
          id: "PRJ-2024-008",
          name: "Canal Restoration Project",
          image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=200&h=150&fit=crop"
        }
      ];

      setTimeout(() => {
        setProjects(mockData);
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error fetching completed projects:", error);
      setLoading(false);
    }
  };

  const handleView = (projectId) => {
    navigate(`/app/projects/${projectId}/overview`, {
      state: { from: 'completed' }
    });
  };

  const handleLogs = (projectId) => {
    navigate(`/app/projects/${projectId}/logs`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading completed projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/app/projects')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Back to Projects"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Completed Projects</h2>
          <p className="text-sm text-gray-500 mt-1">{projects.length} projects completed successfully</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-200">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4"
            >
              {/* Project Image */}
              <img
                src={project.image}
                alt={project.name}
                className="w-20 h-20 rounded object-cover flex-shrink-0"
              />

              {/* Project Name */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{project.name}</h3>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleView(project.id)}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => handleLogs(project.id)}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Logs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {projects.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Completed Projects
          </h3>
          <p className="text-gray-500">
            There are no completed projects to display at this time.
          </p>
        </div>
      )}
    </div>
  );
}