import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

export default function ProjectAbstract() {
  const { projectId } = useParams();
  
  const [showForm, setShowForm] = useState(false);
  const [abstracts, setAbstracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [stats, setStats] = useState({
    totalRecords: 0,
    approved: 0,
    pending: 0,
    draft: 0
  });

  useEffect(() => {
    fetchAbstracts();
  }, [projectId]);

  const fetchAbstracts = async () => {
    try {
      // Mock data - replace with actual API call when backend is ready
      const mockData = [
        {
          id: "AC-2024-001",
          date: "2024-07-15",
          description: "Foundation Work - Phase 1",
          totalAmount: 450000,
          status: "APPROVED"
        },
        {
          id: "AC-2024-002",
          date: "2024-07-20",
          description: "Road Base Layer Construction",
          totalAmount: 680000,
          status: "APPROVED"
        },
        {
          id: "AC-2024-003",
          date: "2024-07-25",
          description: "Drainage System Installation",
          totalAmount: 320000,
          status: "PENDING"
        }
      ];

      setTimeout(() => {
        setAbstracts(mockData);
        
        setStats({
          totalRecords: mockData.length,
          approved: mockData.filter(a => a.status === "APPROVED").length,
          pending: mockData.filter(a => a.status === "PENDING").length,
          draft: mockData.filter(a => a.status === "DRAFT").length
        });
        
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error fetching abstracts:", error);
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (abstract) => {
    setEditingId(abstract.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this abstract record?")) {
      try {
        setAbstracts(abstracts.filter(a => a.id !== id));
        alert("Abstract record deleted successfully!");
      } catch (error) {
        console.error("Error deleting abstract:", error);
        alert("Failed to delete abstract record.");
      }
    }
  };

  const handleFormSubmit = (newAbstract) => {
    if (editingId) {
      setAbstracts(abstracts.map(a => 
        a.id === editingId ? { ...newAbstract, id: editingId } : a
      ));
    } else {
      setAbstracts([...abstracts, { ...newAbstract, id: `AC-2024-${Date.now()}` }]);
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
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
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
      <AbstractForm
        projectId={projectId}
        editingId={editingId}
        existingData={editingId ? abstracts.find(a => a.id === editingId) : null}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading abstract records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Abstract Cost Records</h3>
        <button
          onClick={handleAddNew}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Abstract Cost
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">TOTAL RECORDS</p>
          <p className="text-2xl font-bold">{stats.totalRecords}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">APPROVED</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">PENDING</p>
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
          Approved
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Pending
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Draft
        </button>
      </div>

      {/* Abstracts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abstract ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
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
              {abstracts.map((abstract) => (
                <tr key={abstract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {abstract.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {abstract.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {abstract.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    {formatCurrency(abstract.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(abstract.status)}`}>
                      {abstract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(abstract)}
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
                        onClick={() => handleDelete(abstract.id)}
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

// Abstract Form Component
function AbstractForm({ projectId, editingId, existingData, onSubmit, onCancel }) {
  const [workItems, setWorkItems] = useState([
    {
      id: 1,
      description: "",
      unit: "Un",
      quantity: "",
      rate: "",
      amount: 0
    }
  ]);

  const [formData, setFormData] = useState({
    date: existingData?.date || "",
    status: existingData?.status || "DRAFT"
  });

  const [subtotal, setSubtotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [contingency, setContingency] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    calculateTotals();
  }, [workItems]);

  const calculateTotals = () => {
    const sub = workItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const vatAmount = sub * 0.13;
    const contingencyAmount = sub * 0.04;
    const grand = sub + vatAmount + contingencyAmount;
    
    setSubtotal(sub);
    setVat(vatAmount);
    setContingency(contingencyAmount);
    setGrandTotal(grand);
  };

  const handleItemChange = (id, field, value) => {
    setWorkItems(workItems.map(item => {
      if (item.id === id) {
        const updated = { ...item };
        updated[field] = value;
        
        if (field === 'quantity' || field === 'rate') {
          const qty = field === 'quantity' ? (parseFloat(value) || 0) : (parseFloat(item.quantity) || 0);
          const rate = field === 'rate' ? (parseFloat(value) || 0) : (parseFloat(item.rate) || 0);
          updated.amount = qty * rate;
        }
        
        return updated;
      }
      return item;
    }));
  };

  const addWorkItem = () => {
    setWorkItems([...workItems, {
      id: workItems.length + 1,
      description: "",
      unit: "Un",
      quantity: "",
      rate: "",
      amount: 0
    }]);
  };

  const removeWorkItem = (id) => {
    if (workItems.length > 1) {
      setWorkItems(workItems.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const description = workItems.map(w => w.description).filter(Boolean).join(", ");
    
    const abstractData = {
      date: formData.date,
      description: description || "Abstract Cost Record",
      totalAmount: grandTotal,
      status: formData.status
    };
    
    onSubmit(abstractData);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        {editingId ? "Edit Abstract Cost" : "Create Abstract Cost"}
      </h3>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Form Header */}
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
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
            </select>
          </div>
        </div>

        {/* Work Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">S.N</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">DESCRIPTION OF WORK</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">UNIT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">QUANTITY</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">RATE</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">AMOUNT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {workItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 border text-sm text-center">{item.id}</td>
                  <td className="px-4 py-3 border">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      placeholder="Work description"
                      className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 border">
                    <select
                      value={item.unit}
                      onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                      className="w-24 px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option>Un</option>
                      <option>m³</option>
                      <option>m²</option>
                      <option>m</option>
                      <option>kg</option>
                      <option>ton</option>
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
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                      placeholder="0.00"
                      className="w-32 px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 border text-sm font-medium">
                    {item.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 border text-center">
                    <button
                      type="button"
                      onClick={() => removeWorkItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={workItems.length === 1}
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
          onClick={addWorkItem}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Work Item
        </button>

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-t">
            <span className="font-medium">Sub-Total</span>
            <span className="font-semibold">NPR {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium">VAT @ 13%</span>
            <span className="font-semibold">NPR {vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium">Contingency @ 4%</span>
            <span className="font-semibold">NPR {contingency.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
            <span className="text-lg font-bold">Grand Total</span>
            <span className="text-lg font-bold text-blue-600">NPR {grandTotal.toFixed(2)}</span>
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
            Save Abstract Cost
          </button>
        </div>
      </form>
    </div>
  );
}