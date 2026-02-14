import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

export default function ProjectMeasurement() {
  const { projectId } = useParams();
  
  const [showForm, setShowForm] = useState(false);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [stats, setStats] = useState({
    totalRecords: 0,
    verified: 0,
    pending: 0,
    draft: 0
  });

  useEffect(() => {
    fetchMeasurements();
  }, [projectId]);

  const fetchMeasurements = async () => {
    try {
      // Mock data - replace with actual API call when backend is ready
      const mockData = [
        {
          id: "MB-2024-015",
          date: "2024-07-15",
          description: "Excavation of footpath",
          category: "EARTHWORK",
          quantity: 2.500,
          unit: "m³",
          status: "VERIFIED"
        },
        {
          id: "MB-2024-016",
          date: "2024-07-16",
          description: "Granular Sub-base Material",
          category: "EARTHWORK",
          quantity: 1.900,
          unit: "m³",
          status: "VERIFIED"
        },
        {
          id: "MB-2024-017",
          date: "2024-07-22",
          description: "Base Course Layer (150mm)",
          category: "PAVEMENT",
          quantity: 4.000,
          unit: "m³",
          status: "VERIFIED"
        },
        {
          id: "MB-2024-018",
          date: "2024-07-01",
          description: "Concrete for Drainage Culvert",
          category: "CONCRETE",
          quantity: 55,
          unit: "m³",
          status: "PENDING"
        }
      ];

      setTimeout(() => {
        setMeasurements(mockData);
        
        setStats({
          totalRecords: mockData.length,
          verified: mockData.filter(m => m.status === "VERIFIED").length,
          pending: mockData.filter(m => m.status === "PENDING").length,
          draft: mockData.filter(m => m.status === "DRAFT").length
        });
        
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error fetching measurements:", error);
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (measurement) => {
    setEditingId(measurement.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this measurement?")) {
      try {
        setMeasurements(measurements.filter(m => m.id !== id));
        alert("Measurement deleted successfully!");
      } catch (error) {
        console.error("Error deleting measurement:", error);
        alert("Failed to delete measurement.");
      }
    }
  };

  const handleFormSubmit = (newMeasurement) => {
    if (editingId) {
      setMeasurements(measurements.map(m => 
        m.id === editingId ? { ...newMeasurement, id: editingId } : m
      ));
    } else {
      setMeasurements([...measurements, { ...newMeasurement, id: `MB-2024-${Date.now()}` }]);
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
      case "VERIFIED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "EARTHWORK":
        return "bg-orange-100 text-orange-800";
      case "PAVEMENT":
        return "bg-purple-100 text-purple-800";
      case "CONCRETE":
        return "bg-blue-100 text-blue-800";
      case "DRAINAGE":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (showForm) {
    return (
      <MeasurementForm
        projectId={projectId}
        editingId={editingId}
        existingData={editingId ? measurements.find(m => m.id === editingId) : null}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading measurements...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Measurement Book</h3>
        <button
          onClick={handleAddNew}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">TOTAL RECORDS</p>
          <p className="text-2xl font-bold">{stats.totalRecords}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">VERIFIED</p>
          <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">PENDING REVIEW</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">DRAFT</p>
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          All
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Verified
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Pending
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Draft
        </button>
      </div>

      {/* Measurements Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MB Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
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
              {measurements.map((measurement) => (
                <tr key={measurement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {measurement.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {measurement.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {measurement.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(measurement.category)}`}>
                      {measurement.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {measurement.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {measurement.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(measurement.status)}`}>
                      {measurement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(measurement)}
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
                        onClick={() => handleDelete(measurement.id)}
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

// Measurement Form Component
function MeasurementForm({ projectId, editingId, existingData, onSubmit, onCancel }) {
  const [entries, setEntries] = useState([
    {
      id: 1,
      description: "",
      nos: "",
      length: "",
      breadth: "",
      height: "",
      quantity: 0,
      unit: "Unit",
      rate: "",
      amount: 0
    }
  ]);

  const [formData, setFormData] = useState({
    date: existingData?.date || "",
    category: existingData?.category || "",
    status: existingData?.status || "DRAFT"
  });

  const [subtotal, setSubtotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    calculateTotals();
  }, [entries]);

  const calculateTotals = () => {
    const sub = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    const vatAmount = sub * 0.13;
    const grand = sub + vatAmount;
    
    setSubtotal(sub);
    setVat(vatAmount);
    setGrandTotal(grand);
  };

  const handleEntryChange = (id, field, value) => {
    setEntries(entries.map(entry => {
      if (entry.id === id) {
        const updated = { ...entry };
        updated[field] = value;
        
        const nos = field === 'nos' ? (parseFloat(value) || 0) : (parseFloat(entry.nos) || 0);
        const length = field === 'length' ? (parseFloat(value) || 0) : (parseFloat(entry.length) || 0);
        const breadth = field === 'breadth' ? (parseFloat(value) || 0) : (parseFloat(entry.breadth) || 0);
        const height = field === 'height' ? (parseFloat(value) || 0) : (parseFloat(entry.height) || 0);
        const rate = field === 'rate' ? (parseFloat(value) || 0) : (parseFloat(entry.rate) || 0);
        
        const qty = nos * length * breadth * height;
        updated.quantity = qty;
        updated.amount = qty * rate;
        
        return updated;
      }
      return entry;
    }));
  };

  const addEntry = () => {
    setEntries([...entries, {
      id: entries.length + 1,
      description: "",
      nos: "",
      length: "",
      breadth: "",
      height: "",
      quantity: 0,
      unit: "Unit",
      rate: "",
      amount: 0
    }]);
  };

  const removeEntry = (id) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const description = entries.map(e => e.description).filter(Boolean).join(", ");
    const totalQuantity = entries.reduce((sum, e) => sum + (e.quantity || 0), 0);
    
    const measurementData = {
      date: formData.date,
      description: description || "Measurement Entry",
      category: formData.category,
      quantity: totalQuantity,
      unit: entries[0]?.unit || "m³",
      status: formData.status
    };
    
    onSubmit(measurementData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">
          {editingId ? "Edit Measurement" : "New Measurement Entry"}
        </h3>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Fill in the measurement details below.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Form Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              <option value="EARTHWORK">Earthwork</option>
              <option value="PAVEMENT">Pavement</option>
              <option value="CONCRETE">Concrete</option>
              <option value="DRAINAGE">Drainage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
            </select>
          </div>
        </div>

        {/* Measurement Entries Table */}
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 border">E.</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 border">DESCRIPTION</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 border">NOS</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 border">LENGTH</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 border">BREADTH</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 border">HEIGHT</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 border">QUANTITY</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 border">UNIT</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 border">RATE</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 border">AMOUNT</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 border">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-2 py-2 border text-sm">{entry.id}</td>
                  <td className="px-2 py-2 border">
                    <input
                      type="text"
                      value={entry.description}
                      onChange={(e) => handleEntryChange(entry.id, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 border">
                    <input
                      type="number"
                      value={entry.nos}
                      onChange={(e) => handleEntryChange(entry.id, 'nos', e.target.value)}
                      placeholder="0"
                      className="w-16 px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 border">
                    <input
                      type="number"
                      value={entry.length}
                      onChange={(e) => handleEntryChange(entry.id, 'length', e.target.value)}
                      placeholder="0.00"
                      className="w-20 px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 border">
                    <input
                      type="number"
                      value={entry.breadth}
                      onChange={(e) => handleEntryChange(entry.id, 'breadth', e.target.value)}
                      placeholder="0.00"
                      className="w-20 px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 border">
                    <input
                      type="number"
                      value={entry.height}
                      onChange={(e) => handleEntryChange(entry.id, 'height', e.target.value)}
                      placeholder="0.00"
                      className="w-20 px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 border text-sm font-medium">
                    {entry.quantity.toFixed(2)}
                  </td>
                  <td className="px-2 py-2 border">
                    <select
                      value={entry.unit}
                      onChange={(e) => handleEntryChange(entry.id, 'unit', e.target.value)}
                      className="w-20 px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option>Unit</option>
                      <option>m³</option>
                      <option>m²</option>
                      <option>m</option>
                      <option>kg</option>
                    </select>
                  </td>
                  <td className="px-2 py-2 border">
                    <input
                      type="number"
                      value={entry.rate}
                      onChange={(e) => handleEntryChange(entry.id, 'rate', e.target.value)}
                      placeholder="0.00"
                      className="w-24 px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 border text-sm font-medium">
                    {entry.amount.toFixed(2)}
                  </td>
                  <td className="px-2 py-2 border text-center">
                    <button
                      type="button"
                      onClick={() => removeEntry(entry.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={entries.length === 1}
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
          onClick={addEntry}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Entry
        </button>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal</span>
              <span>NPR {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">VAT @ 13%</span>
              <span>NPR {vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Grand Total</span>
              <span className="text-blue-600">NPR {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

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
            Save Measurement
          </button>
        </div>
      </form>
    </div>
  );
}