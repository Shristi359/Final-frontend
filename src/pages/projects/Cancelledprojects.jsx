import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Loader2, XCircle, RotateCcw } from "lucide-react";
import { projectsAPI } from "../../api/axios";

export default function CancelledProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.list();
      const cancelled = response.data.filter(p => p.status === "CANCELLED");
      setProjects(cancelled);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  const handleRestoreProject = async (project) => {
    const confirmMessage = `Restore project "${project.project_name}"?\n\nThis will:\n- Set status back to ONGOING\n- Make it visible in active projects`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await projectsAPI.update(project.id, {
          ...project,
          status: "ONGOING"
        });
        
        fetchProjects();
        alert("Project restored successfully");
      } catch (error) {
        console.error("Error restoring project:", error);
        alert("Failed to restore project. Please try again.");
      }
    }
  };

  const handlePermanentDelete = async (project) => {
    const confirmMessage = `⚠️ PERMANENT DELETE ⚠️\n\nAre you ABSOLUTELY SURE you want to permanently delete project "${project.project_name}"?\n\nThis will:\n- Delete ALL project data\n- Delete ALL milestones\n- Delete ALL logs\n- This CANNOT be undone!\n\nType the project code "${project.project_code}" to confirm.`;
    
    const userInput = prompt(confirmMessage);
    
    if (userInput === project.project_code) {
      try {
        await projectsAPI.delete(project.id);
        fetchProjects();
        alert("Project permanently deleted");
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project. Please try again.");
      }
    } else if (userInput !== null) {
      alert("Project code did not match. Deletion cancelled.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <XCircle className="w-8 h-8 text-gray-600" />
        <h1 className="text-2xl font-semibold text-gray-800">Cancelled Projects</h1>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          {projects.length}
        </span>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Note:</strong> Cancelled projects are archived here. You can restore them back to ongoing status or permanently delete them.
        </p>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Cancelled Projects</h3>
          <p className="text-gray-500">All your projects are active or completed.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contractor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cancelled Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {project.project_code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">
                      {project.project_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {project.municipality}, Ward {project.ward_no}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.location || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.contractor?.contractor_name || 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/app/projects/${project.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRestoreProject(project)}
                        className="text-green-600 hover:text-green-900"
                        title="Restore Project"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(project)}
                        className="text-red-600 hover:text-red-900"
                        title="Permanently Delete"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}