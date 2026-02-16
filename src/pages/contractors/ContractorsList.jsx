import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Loader2, Briefcase } from "lucide-react";
import { contractorsAPI } from "../../api/axios";

export default function ContractorsList() {
  const navigate = useNavigate();
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const response = await contractorsAPI.list();
      setContractors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contractors:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contractor?")) {
      try {
        await contractorsAPI.delete(id);
        setContractors(contractors.filter(c => c.id !== id));
        alert("Contractor deleted successfully");
      } catch (error) {
        console.error("Error deleting contractor:", error);
        alert("Failed to delete contractor");
      }
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Contractors</h1>
        </div>
        <button
          onClick={() => navigate("/app/contractors/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Contractor
        </button>
      </div>

      {contractors.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Contractors Yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first contractor</p>
          <button
            onClick={() => navigate("/app/contractors/add")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Contractor
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Suchidarta Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contractors.map((contractor) => (
                <tr key={contractor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {contractor.contractor_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contractor.company_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Type {contractor.contractor_type || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contractor.contact_number || contractor.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contractor.suchidarta_flagged ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                        ✓ Active (Approved)
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-800 font-medium">
                        ⏳ Pending Approval
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(contractor.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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