import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

export default function ProjectMaterials() {
  const { projectId } = useParams();
  
  const [showForm, setShowForm] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalBudget: 0,
    itemsUsed: 0,
    itemsPending: 0
  });

  useEffect(() => {
    fetchMaterials();
  }, [projectId]);

  const fetchMaterials = async () => {
    try {
      // Mock data - replace with actual API call when backend is ready
      const mockData = [
        {
          id: "MAT-2024-001",
          date: "2024-07-15",
          materialName: "Cement",
          specification: "OPC 43 Grade",
          quantity: 500,
          unit: "bags",
          unitRate: 650,
          totalAmount: 325000,
          status: "DELIVERED"
        },
        {
          id: "MAT-2024-002",
          date: "2024-07-18",
          materialName: "Steel Bars",
          specification: "16mm TMT",
          quantity: 2000,
          unit: "kg",
          unitRate: 75,
          totalAmount: 150000,
          status: "DELIVERED"
        },
        {
          id: "MAT-2024-003",
          date: "2024-07-20",
          materialName: "Aggregate",
          specification: "20mm",
          quantity: 100,
          unit: "m³",
          unitRate: 1500,
          totalAmount: 150000,
          status: "ORDERED"
        }
      ];

      setTimeout(() => {
        setMaterials(mockData);
        
        // Calculate stats
        const totalBudget = mockData.reduce((sum, m) => sum + m.totalAmount, 0);
        setStats({
          totalMaterials: mockData.length,
          totalBudget: totalBudget,
          itemsUsed: mockData.filter(m => m.status === "DELIVERED").length,
          itemsPending: mockData.filter(m => m.status === "ORDERED").length
        });
        
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error fetching materials:", error);
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (material) => {
    setEditingId(material.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        setMaterials(materials.filter(m => m.id !== id));
        alert("Material deleted successfully!");
      } catch (error) {
        console.error("Error deleting material:", error);
        alert("Failed to delete material.");
      }
    }
  };

  const handleFormSubmit = (newMaterial) => {
    if (editingId) {
      setMaterials(materials.map(m => 
        m.id === editingId ? { ...newMaterial, id: editingId } : m
      ));
    } else {
      setMaterials([...materials, { ...newMaterial, id: `MAT-2024-${Date.now()}` }]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "ORDERED":
        return "bg-yellow-100 text-yellow-800";
      case "PENDING":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (showForm) {
    return (
      <MaterialsForm
        projectId={projectId}
        editingId={editingId}
        existingData={editingId ? materials.find(m => m.id === editingId) : null}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading materials...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Materials Budget</h3>
        <button
          onClick={handleAddNew}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Material
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">TOTAL MATERIALS</p>
          <p className="text-2xl font-bold">{stats.totalMaterials}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">TOTAL BUDGET</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalBudget)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">DELIVERED</p>
          <p className="text-2xl font-bold text-green-600">{stats.itemsUsed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">ORDERED</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.itemsPending}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          All
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Delivered
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Ordered
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Pending
        </button>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
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
              {materials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {material.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {material.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {material.materialName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {material.specification}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {material.quantity} {material.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(material.unitRate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    {formatCurrency(material.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(material.status)}`}>
                      {material.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(material)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
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
    </div>
  );
}

// Materials Form Component
function MaterialsForm({ projectId, editingId, existingData, onSubmit, onCancel }) {
  const [materialItems, setMaterialItems] = useState([
    {
      id: 1,
      materialName: existingData?.materialName || "",
      specification: existingData?.specification || "",
      unit: existingData?.unit || "Unit",
      quantity: existingData?.quantity || "",
      unitRate: existingData?.unitRate || "",
      totalAmount: existingData?.totalAmount || 0
    }
  ]);

  const [formData, setFormData] = useState({
    date: existingData?.date || "",
    status: existingData?.status || "PENDING"
  });

  const handleItemChange = (id, field, value) => {
    setMaterialItems(materialItems.map(item => {
      if (item.id === id) {
        const updated = { ...item };
        updated[field] = value;
        
        // Auto-calculate total amount
        const quantity = field === 'quantity' ? (parseFloat(value) || 0) : (parseFloat(item.quantity) || 0);
        const unitRate = field === 'unitRate' ? (parseFloat(value) || 0) : (parseFloat(item.unitRate) || 0);
        
        updated.totalAmount = quantity * unitRate;
        
        return updated;
      }
      return item;
    }));
  };

  const addMaterialItem = () => {
    setMaterialItems([...materialItems, {
      id: materialItems.length + 1,
      materialName: "",
      specification: "",
      unit: "Unit",
      quantity: "",
      unitRate: "",
      totalAmount: 0
    }]);
  };

  const removeMaterialItem = (id) => {
    if (materialItems.length > 1) {
      setMaterialItems(materialItems.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const firstItem = materialItems[0];
    
    const materialData = {
      date: formData.date,
      materialName: firstItem.materialName,
      specification: firstItem.specification,
      quantity: parseFloat(firstItem.quantity) || 0,
      unit: firstItem.unit,
      unitRate: parseFloat(firstItem.unitRate) || 0,
      totalAmount: firstItem.totalAmount,
      status: formData.status
    };
    
    onSubmit(materialData);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        {editingId ? "Edit Material" : "Add Material"}
      </h3>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Form Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PENDING">Pending</option>
              <option value="ORDERED">Ordered</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>
        </div>

        {/* Material Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">S.N</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">MATERIAL NAME</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">SPECIFICATION</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">UNIT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">QUANTITY</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">UNIT RATE</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">TOTAL AMOUNT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {materialItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 border text-sm text-center">{item.id}</td>
                  <td className="px-4 py-3 border">
                    <input
                      type="text"
                      value={item.materialName}
                      onChange={(e) => handleItemChange(item.id, 'materialName', e.target.value)}
                      placeholder="e.g., Cement"
                      className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 border">
                    <input
                      type="text"
                      value={item.specification}
                      onChange={(e) => handleItemChange(item.id, 'specification', e.target.value)}
                      placeholder="e.g., OPC 43 Grade"
                      className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 border">
                    <select
                      value={item.unit}
                      onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                      className="w-24 px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option>Unit</option>
                      <option>bags</option>
                      <option>kg</option>
                      <option>ton</option>
                      <option>m³</option>
                      <option>m²</option>
                      <option>m</option>
                      <option>pcs</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 border">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                      placeholder="0"
                      className="w-28 px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 border">
                    <input
                      type="number"
                      value={item.unitRate}
                      onChange={(e) => handleItemChange(item.id, 'unitRate', e.target.value)}
                      placeholder="0.00"
                      className="w-32 px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 border text-sm font-medium">
                    {item.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 border text-center">
                    <button
                      type="button"
                      onClick={() => removeMaterialItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={materialItems.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addMaterialItem}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Material Item
        </button>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Material
          </button>
        </div>
      </form>
    </div>
  );
}