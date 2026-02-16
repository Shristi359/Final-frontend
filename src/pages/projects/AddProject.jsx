import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { projectsAPI } from "../../api/axios";

export default function AddProject() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    project_code: "",
    project_name: "",
    project_description: "",
    priority: "",
    ward_no: "",
    municipality: "",
    district: "",
    province: "",
    location: "",
    total_approved_budget: "",
    budget_source: "",
    fiscal_year: "",
    assigned_engineer: "",
    chairperson: "",
    contractor: "",
    contractor_contact_person: "",
    proposed_date: "",
    approved_date: "",
    planned_start_date: "",
    planned_completion_date: "",
    planned_duration_days: ""
  });

  // Dropdown data from backend
  const [dropdownData, setDropdownData] = useState({
    budgetSources: [],
    fiscalYears: [],
    engineers: [],
    chairpersons: [],
    contractors: []
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch all dropdown data on component mount
  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Auto-calculate planned duration when dates change
  useEffect(() => {
    if (formData.planned_start_date && formData.planned_completion_date) {
      const start = new Date(formData.planned_start_date);
      const end = new Date(formData.planned_completion_date);
      
      // Calculate difference in days
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Only update if positive and different from current value
      if (diffDays >= 0 && diffDays !== parseInt(formData.planned_duration_days)) {
        setFormData(prev => ({
          ...prev,
          planned_duration_days: diffDays.toString()
        }));
      }
    }
  }, [formData.planned_start_date, formData.planned_completion_date]);

  const fetchDropdownData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch all lookup data in parallel
      const [budgetSources, fiscalYears, engineers, chairpersons, contractors] = await Promise.all([
        fetch('/api/lookups/budget-sources/').then(r => r.json()),
        fetch('/api/lookups/fiscal-years/').then(r => r.json()),
        fetch('/api/engineers/engineer/').then(r => r.json()),
        fetch('/api/chairpersons/chairperson/').then(r => r.json()),
        fetch('/api/contractors/contractor/').then(r => r.json())
      ]);
      
      // Filter contractors - only show APPROVED ones (Suchidarta completed)
      const activeContractors = contractors.filter(c => 
        c.is_active === true && c.suchidarta_flagged === true
      );
      
      console.log("✅ Approved contractors:", activeContractors.length);
      
      setDropdownData({
        budgetSources,
        fiscalYears,
        engineers,
        chairpersons,
        contractors: activeContractors
      });

      setLoadingData(false);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      alert("Failed to load form data. Please refresh the page.");
      setLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare project data for backend
      const projectData = {
        project_code: formData.project_code,
        project_name: formData.project_name,
        project_description: formData.project_description || "",
        priority: formData.priority || null,
        ward_no: parseInt(formData.ward_no) || null,
        municipality: formData.municipality,
        district: formData.district,
        province: formData.province,
        location: formData.location,
        total_approved_budget: formData.total_approved_budget ? parseFloat(formData.total_approved_budget) : null,
        budget_source: formData.budget_source ? parseInt(formData.budget_source) : null,
        fiscal_year: formData.fiscal_year ? parseInt(formData.fiscal_year) : null,
        assigned_engineer: formData.assigned_engineer ? parseInt(formData.assigned_engineer) : null,
        chairperson: formData.chairperson ? parseInt(formData.chairperson) : null,
        contractor: formData.contractor ? parseInt(formData.contractor) : null,
        contractor_contact_person: formData.contractor_contact_person || "",
        proposed_date: formData.proposed_date || null,
        approved_date: formData.approved_date || null,
        planned_start_date: formData.planned_start_date || null,
        planned_completion_date: formData.planned_completion_date || null,
        planned_duration_days: formData.planned_duration_days ? parseInt(formData.planned_duration_days) : null,
        status: "ONGOING"
      };
      
      console.log("Submitting project:", projectData);
      
      // Create the project
      const createdProject = await projectsAPI.create(projectData);
      console.log("✅ Project created:", createdProject.data);
      
      alert("Project created successfully!");
      navigate('/app/projects');
      
    } catch (error) {
      console.error("❌ Error creating project:", error);
      console.error("Error response:", error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');
          alert(`Failed to create project:\n\n${errorMessages}`);
        } else {
          alert(`Failed to create project: ${errorData}`);
        }
      } else {
        alert(`Failed to create project: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      navigate(-1);
    }
  };

  // Helper functions
  const getEngineerName = (engineer) => {
    if (engineer.account && engineer.account.full_name) {
      return engineer.account.full_name;
    }
    return engineer.full_name || engineer.name || `Engineer #${engineer.id}`;
  };

  const getChairpersonName = (chairperson) => {
    if (chairperson.account && chairperson.account.full_name) {
      return chairperson.account.full_name;
    }
    return chairperson.full_name || chairperson.name || `Chairperson #${chairperson.id}`;
  };

  const getContractorName = (contractor) => {
    return contractor.contractor_name || contractor.company_name || contractor.name || `Contractor #${contractor.id}`;
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading form data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Add New Project</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-8">

        {/* BASIC INFO */}
        <Section title="Basic Project Information">
          <Input 
            label="Project Code" 
            name="project_code"
            value={formData.project_code}
            onChange={handleInputChange}
            placeholder="e.g., PRJ-2026-001"
            required
          />
          <Input 
            label="Project Name" 
            name="project_name"
            value={formData.project_name}
            onChange={handleInputChange}
            placeholder="e.g., Road Widening Project"
            required
          />
          <Select 
            label="Priority" 
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            options={[
              { value: "LOW", label: "Low" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HIGH", label: "High" }
            ]}
            required
          />
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">
              Project Description
            </label>
            <textarea
              name="project_description"
              value={formData.project_description}
              onChange={handleInputChange}
              placeholder="Brief description of the project"
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </Section>

        {/* LOCATION */}
        <Section title="Location Details">
          <Input 
            label="Ward No" 
            name="ward_no"
            type="number"
            value={formData.ward_no}
            onChange={handleInputChange}
            placeholder="e.g., 16"
            required
          />
          <Input 
            label="Municipality" 
            name="municipality"
            value={formData.municipality}
            onChange={handleInputChange}
            placeholder="e.g., Kathmandu"
            required
          />
          <Input 
            label="District" 
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            placeholder="e.g., Kathmandu"
            required
          />
          <Input 
            label="Province" 
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            placeholder="e.g., Bagmati"
            required
          />
          <div className="md:col-span-2">
            <Input 
              label="Location (Specific)" 
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Near City Hall, Main Street"
              required
            />
          </div>
        </Section>

        {/* BUDGET */}
        <Section title="Budget Details">
          <Input 
            label="Total Approved Budget (NPR)" 
            name="total_approved_budget"
            type="number"
            value={formData.total_approved_budget}
            onChange={handleInputChange}
            placeholder="e.g., 50000000"
            required
          />
          <Select 
            label="Budget Source" 
            name="budget_source"
            value={formData.budget_source}
            onChange={handleInputChange}
            options={dropdownData.budgetSources.map(bs => ({
              value: bs.id,
              label: bs.name
            }))}
            required
          />
          <Select 
            label="Fiscal Year" 
            name="fiscal_year"
            value={formData.fiscal_year}
            onChange={handleInputChange}
            options={dropdownData.fiscalYears.map(fy => ({
              value: fy.id,
              label: fy.year_label
            }))}
            required
          />
        </Section>

        {/* PERSONNEL */}
        <Section title="Personnel Assignment">
          <Select 
            label="Assigned Engineer" 
            name="assigned_engineer"
            value={formData.assigned_engineer}
            onChange={handleInputChange}
            options={dropdownData.engineers.map(eng => ({
              value: eng.id,
              label: getEngineerName(eng)
            }))}
          />
          <Select 
            label="Chairperson" 
            name="chairperson"
            value={formData.chairperson}
            onChange={handleInputChange}
            options={dropdownData.chairpersons.map(chair => ({
              value: chair.id,
              label: getChairpersonName(chair)
            }))}
          />
          <div className="md:col-span-2">
            <Select 
              label="Contractor" 
              name="contractor"
              value={formData.contractor}
              onChange={handleInputChange}
              options={dropdownData.contractors.map(cont => ({
                value: cont.id,
                label: getContractorName(cont)
              }))}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Input 
              label="Contractor Contact Person" 
              name="contractor_contact_person"
              value={formData.contractor_contact_person}
              onChange={handleInputChange}
              placeholder="e.g., John Doe - +977 9841234567"
            />
          </div>
        </Section>

        {/* TIMELINE */}
        <Section title="Project Timeline">
          <DateInput 
            label="Proposed Date" 
            name="proposed_date"
            value={formData.proposed_date}
            onChange={handleInputChange}
          />
          <DateInput 
            label="Approved Date" 
            name="approved_date"
            value={formData.approved_date}
            onChange={handleInputChange}
          />
          <DateInput 
            label="Planned Start Date" 
            name="planned_start_date"
            value={formData.planned_start_date}
            onChange={handleInputChange}
            required
          />
          <DateInput 
            label="Planned Completion Date" 
            name="planned_completion_date"
            value={formData.planned_completion_date}
            onChange={handleInputChange}
            required
          />
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Planned Duration (Days) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="planned_duration_days"
              value={formData.planned_duration_days}
              onChange={handleInputChange}
              placeholder="Auto-calculated"
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-700 cursor-not-allowed"
              title="Auto-calculated from start and completion dates"
            />
            <p className="text-xs text-gray-500 mt-1">
              ℹ️ Auto-calculated from start and completion dates
            </p>
          </div>
        </Section>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- REUSABLE UI ---------- */

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700 text-lg">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options = [], required = false }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select 
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateInput({ label, name, value, onChange, required = false }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}