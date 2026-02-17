import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Loader2, HardHat, Eye, Pencil } from "lucide-react";
import { engineersAPI } from "../../api/axios";

export default function EngineersList() {
  const navigate = useNavigate();
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEngineers(); }, []);

  const fetchEngineers = async () => {
    try {
      const res = await engineersAPI.list();
      setEngineers(res.data);
    } catch (err) {
      console.error("Error fetching engineers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this engineer?")) {
      try {
        await engineersAPI.delete(id);
        setEngineers(prev => prev.filter(e => e.id !== id));
        alert("Engineer deleted successfully");
      } catch (err) {
        console.error("Error deleting engineer:", err);
        alert("Failed to delete engineer");
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <HardHat className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Engineers</h1>
        </div>
        <button
          onClick={() => navigate("/app/engineers/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Engineer
        </button>
      </div>

      {engineers.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <HardHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Engineers Yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first engineer</p>
          <button
            onClick={() => navigate("/app/engineers/add")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Engineer
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ward No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {engineers.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {e.account?.full_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {e.account?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {e.role || "Engineer"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {e.ward_no || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      e.account?.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {e.account?.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => navigate(`/app/engineers/${e.id}/view`)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/app/engineers/${e.id}/edit`)}
                        className="text-gray-400 hover:text-amber-500 transition-colors"
                        title="Edit engineer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete engineer"
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
      )}
    </div>
  );
}