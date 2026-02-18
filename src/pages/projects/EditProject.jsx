import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Info, Search, MapPin } from "lucide-react";
import { projectsAPI } from "../../api/axios";

export default function EditProject() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [formData, setFormData] = useState({
    project_code: "",
    project_name: "",
    project_description: "",
    priority: "",
    project_type: "",
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
    proposed_date: "",
    approved_date: "",
    planned_start_date: "",
    planned_completion_date: "",
    planned_duration_days: "",
    status: "",
  });

  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [roadData, setRoadData] = useState({ road_length_km: "", road_width_m: "", road_type: "" });

  const [dropdownData, setDropdownData] = useState({
    priorityLevels: [], projectTypes: [], roadTypes: [],
    budgetSources: [], fiscalYears: [], engineers: [],
    chairpersons: [], contractors: [], locations: []
  });

  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationMode, setLocationMode] = useState("manual");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  // Auto-calculate duration when dates change
  useEffect(() => {
    if (formData.planned_start_date && formData.planned_completion_date) {
      const start = new Date(formData.planned_start_date);
      const end   = new Date(formData.planned_completion_date);
      const diff  = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff !== parseInt(formData.planned_duration_days)) {
        setFormData(prev => ({ ...prev, planned_duration_days: diff.toString() }));
      }
    }
  }, [formData.planned_start_date, formData.planned_completion_date]);

  useEffect(() => {
    fetchAll();
  }, [projectId]);

  const fetchAll = async () => {
    try {
      setLoadingData(true);

      const [
        projectRes,
        priorityLevels, projectTypes, roadTypes,
        budgetSources, fiscalYears,
        engineers, chairpersons, contractors, locations
      ] = await Promise.all([
        projectsAPI.get(projectId),
        fetch('/api/lookups/priority-levels/').then(r => r.json()),
        fetch('/api/lookups/project-types/').then(r => r.json()),
        fetch('/api/lookups/road-types/').then(r => r.json()),
        fetch('/api/lookups/budget-sources/').then(r => r.json()),
        fetch('/api/lookups/fiscal-years/').then(r => r.json()),
        fetch('/api/engineers/engineer/').then(r => r.json()),
        fetch('/api/chairpersons/chairperson/').then(r => r.json()),
        fetch('/api/contractors/contractor/').then(r => r.json()),
        fetch('/api/locations/location/').then(r => r.json()),
      ]);

      const activeContractors = contractors.filter(c => c.suchidarta_flagged);

      setDropdownData({ priorityLevels, projectTypes, roadTypes, budgetSources, fiscalYears, engineers, chairpersons, contractors: activeContractors, locations });

      // Pre-fill form with existing project data
      const p = projectRes.data;
      setFormData({
        project_code:            p.project_code            || "",
        project_name:            p.project_name            || "",
        project_description:     p.project_description     || "",
        priority:                p.priority                 || "",
        project_type:            p.project_type            || "",
        ward_no:                 p.ward_no?.toString()      || "",
        municipality:            p.municipality             || "",
        district:                p.district                || "",
        province:                p.province                || "",
        location:                p.location                || "",
        total_approved_budget:   p.total_approved_budget   || "",
        budget_source:           p.budget_source           || "",
        fiscal_year:             p.fiscal_year             || "",
        assigned_engineer:       p.assigned_engineer       || "",
        chairperson:             p.chairperson             || "",
        contractor:              p.contractor              || "",
        proposed_date:           p.proposed_date           || "",
        approved_date:           p.approved_date           || "",
        planned_start_date:      p.planned_start_date      || "",
        planned_completion_date: p.planned_completion_date || "",
        planned_duration_days:   p.planned_duration_days?.toString() || "",
        status:                  p.status                  || "ONGOING",
      });

      // Pre-fill contractor company name
      if (p.contractor_details?.company_name) {
        setSelectedCompanyName(p.contractor_details.company_name);
      }

    } catch (err) {
      console.error("Error loading project:", err);
      setError("Failed to load project data. Please go back and try again.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoadChange = (e) => {
    const { name, value } = e.target;
    setRoadData(prev => ({ ...prev, [name]: value }));
  };

  const handleContractorChange = (e) => {
    const contractorId = e.target.value;
    setFormData(prev => ({ ...prev, contractor: contractorId }));
    if (contractorId) {
      const selected = dropdownData.contractors.find(c => c.id.toString() === contractorId.toString());
      setSelectedCompanyName(selected?.company_name || "No company name on file");
    } else {
      setSelectedCompanyName("");
    }
  };

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setLocationSearch(`Ward ${loc.ward_no}, ${loc.place_or_street}`);
    setShowLocationDropdown(false);
    setFormData(prev => ({
      ...prev,
      ward_no:      loc.ward_no.toString(),
      municipality: loc.municipality,
      district:     loc.district,
      province:     loc.province,
      location:     loc.place_or_street,
    }));
  };

  const filteredLocations = dropdownData.locations.filter(loc =>
    loc.place_or_street.toLowerCase().includes(locationSearch.toLowerCase()) ||
    loc.ward_no.toString().includes(locationSearch) ||
    loc.municipality.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const getSelectedProjectTypeName = () => {
    if (!formData.project_type) return null;
    const pt = dropdownData.projectTypes.find(p => p.id.toString() === formData.project_type.toString());
    return pt ? pt.name.toLowerCase() : null;
  };

  const isRoadProject  = () => getSelectedProjectTypeName() === 'road';
  const isFutureProject = () => {
    const name = getSelectedProjectTypeName();
    return name === 'building' || name === 'bridge';
  };

  const getContractorLabel = (contractor) => {
    const name = contractor.contractor_name || `Contractor #${contractor.id}`;
    const pan  = contractor.pan_vat_no ? ` — PAN: ${contractor.pan_vat_no}` : '';
    return `${name}${pan}`;
  };

  const getEngineerName = (engineer) =>
    engineer.account?.full_name || engineer.full_name || `Engineer #${engineer.id}`;

  const getChairpersonName = (chairperson) =>
    chairperson.account?.full_name || chairperson.full_name || `Chairperson #${chairperson.id}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        project_code:            formData.project_code,
        project_name:            formData.project_name,
        project_description:     formData.project_description || "",
        priority:                formData.priority || "LOW",
        ward_no:                 parseInt(formData.ward_no) || 16,
        municipality:            formData.municipality || "Kathmandu",
        district:                formData.district    || "Kathmandu",
        province:                formData.province    || "Bagmati",
        location:                formData.location,
        total_approved_budget:   formData.total_approved_budget ? parseFloat(formData.total_approved_budget) : null,
        budget_source:           formData.budget_source  ? parseInt(formData.budget_source)  : null,
        fiscal_year:             formData.fiscal_year    ? parseInt(formData.fiscal_year)    : null,
        assigned_engineer:       formData.assigned_engineer ? parseInt(formData.assigned_engineer) : null,
        chairperson:             formData.chairperson    ? parseInt(formData.chairperson)    : null,
        contractor:              formData.contractor     ? parseInt(formData.contractor)     : null,
        proposed_date:           formData.proposed_date  || null,
        approved_date:           formData.approved_date  || null,
        planned_start_date:      formData.planned_start_date      || null,
        planned_completion_date: formData.planned_completion_date || null,
        planned_duration_days:   formData.planned_duration_days   ? parseInt(formData.planned_duration_days) : null,
        status:                  formData.status,
      };

      await projectsAPI.update(projectId, projectData);
      alert("Project updated successfully!");
      navigate(`/app/projects/${projectId}/overview`);

    } catch (error) {
      console.error("Error updating project:", error);
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const msgs = Object.entries(errorData)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join('\n');
          alert(`Failed to update project:\n\n${msgs}`);
        } else {
          alert(`Failed to update project: ${errorData}`);
        }
      } else {
        alert(`Failed to update project: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Discard changes and go back?")) navigate(-1);
  };

  if (loadingData) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600"/>
      <span className="ml-3 text-gray-600">Loading project data...</span>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">← Go Back</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Edit Project</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {formData.project_code} · {formData.project_name}
          </p>
        </div>
        {/* Status selector — useful for manual override */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 font-medium">Status:</label>
          <select
            name="status" value={formData.status} onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="COMING_SOON">Coming Soon</option>
            <option value="ONGOING">Ongoing</option>
            <option value="DELAYED">Delayed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-8">

        {/* BASIC INFO */}
        <Section title="Basic Project Information">
          <Input label="Project Code" name="project_code" value={formData.project_code} onChange={handleInputChange} placeholder="e.g., PRJ-2026-001" required />
          <Input label="Project Name" name="project_name" value={formData.project_name} onChange={handleInputChange} placeholder="e.g., Road Widening Project" required />

          <div>
            <label className="block text-sm text-gray-600 mb-1">Priority <span className="text-red-500">*</span></label>
            <select name="priority" value={formData.priority} onChange={handleInputChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Project Type <span className="text-red-500">*</span></label>
            <select name="project_type" value={formData.project_type} onChange={handleInputChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select Project Type</option>
              {dropdownData.projectTypes.map(pt => (
                <option key={pt.id} value={pt.id}>{pt.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Project Description</label>
            <textarea name="project_description" value={formData.project_description} onChange={handleInputChange}
              placeholder="Brief description of the project" rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
          </div>
        </Section>

        {/* FUTURE PROJECT NOTICE */}
        {isFutureProject() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 flex items-start gap-4">
            <Info className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0"/>
            <div>
              <h3 className="font-semibold text-yellow-800 capitalize">{getSelectedProjectTypeName()} Project</h3>
              <p className="text-yellow-700 mt-1 text-sm">
                Detailed fields for <span className="font-semibold capitalize">{getSelectedProjectTypeName()}</span> projects will be implemented in a later version.
              </p>
            </div>
          </div>
        )}

        {/* ROAD DETAILS */}
        {isRoadProject() && (
          <Section title="Road Details">
            <Input label="Road Length (km)" name="road_length_km" type="number" value={roadData.road_length_km} onChange={handleRoadChange} placeholder="e.g., 2.5"/>
            <Input label="Road Width (m)"   name="road_width_m"  type="number" value={roadData.road_width_m}  onChange={handleRoadChange} placeholder="e.g., 6.0"/>
            <Select label="Road Type" name="road_type" value={roadData.road_type} onChange={handleRoadChange}
              options={dropdownData.roadTypes.map(rt => ({ value: rt.id, label: rt.name }))} required/>
          </Section>
        )}

        {/* LOCATION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-medium text-gray-700 text-lg">Location Details</h3>
            <div className="flex gap-2">
              <button type="button"
                onClick={() => { setLocationMode("search"); setSelectedLocation(null); setLocationSearch(""); }}
                className={`px-3 py-1 text-sm rounded-md transition ${locationMode === "search" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                Search Existing
              </button>
              <button type="button"
                onClick={() => { setLocationMode("manual"); setSelectedLocation(null); setLocationSearch(""); }}
                className={`px-3 py-1 text-sm rounded-md transition ${locationMode === "manual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                Enter Manually
              </button>
            </div>
          </div>

          {locationMode === "search" && (
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm text-gray-600 mb-1">Search Location</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/>
                  <input type="text" value={locationSearch}
                    onChange={e => { setLocationSearch(e.target.value); setShowLocationDropdown(true); setSelectedLocation(null); }}
                    onFocus={() => setShowLocationDropdown(true)}
                    placeholder="Search by ward, place, or municipality..."
                    className="w-full border border-gray-300 rounded px-3 py-2 pl-9 focus:ring-2 focus:ring-blue-500"/>
                </div>
                {showLocationDropdown && locationSearch && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredLocations.length > 0 ? filteredLocations.map(loc => (
                      <button key={loc.id} type="button" onClick={() => handleSelectLocation(loc)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-0 transition">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0"/>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Ward {loc.ward_no} – {loc.place_or_street}</div>
                            <div className="text-xs text-gray-500">{loc.municipality}, {loc.district}, {loc.province}</div>
                          </div>
                        </div>
                      </button>
                    )) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">No locations found. Try "Enter Manually".</div>
                    )}
                  </div>
                )}
              </div>
              {selectedLocation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-blue-600"/>
                    <span className="font-medium text-blue-800 text-sm">Selected Location</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><span className="text-gray-500">Ward No:</span><p className="font-medium">{selectedLocation.ward_no}</p></div>
                    <div><span className="text-gray-500">Municipality:</span><p className="font-medium">{selectedLocation.municipality}</p></div>
                    <div><span className="text-gray-500">District:</span><p className="font-medium">{selectedLocation.district}</p></div>
                    <div><span className="text-gray-500">Province:</span><p className="font-medium">{selectedLocation.province}</p></div>
                    <div className="md:col-span-4"><span className="text-gray-500">Place/Street:</span><p className="font-medium">{selectedLocation.place_or_street}</p></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {locationMode === "manual" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Ward No"        name="ward_no"      type="number" value={formData.ward_no}      onChange={handleInputChange} placeholder="e.g., 16"         required/>
              <Input label="Municipality"   name="municipality"               value={formData.municipality}  onChange={handleInputChange} placeholder="e.g., Kathmandu"  required/>
              <Input label="District"       name="district"                   value={formData.district}      onChange={handleInputChange} placeholder="e.g., Kathmandu"  required/>
              <Input label="Province"       name="province"                   value={formData.province}      onChange={handleInputChange} placeholder="e.g., Bagmati"    required/>
              <div className="md:col-span-2">
                <Input label="Place / Street" name="location"                 value={formData.location}      onChange={handleInputChange} placeholder="e.g., Near City Hall" required/>
              </div>
            </div>
          )}
        </div>

        {/* BUDGET */}
        <Section title="Budget Details">
          <Input label="Total Approved Budget (NPR)" name="total_approved_budget" type="number" value={formData.total_approved_budget} onChange={handleInputChange} placeholder="e.g., 50000000" required/>
          <Select label="Budget Source" name="budget_source" value={formData.budget_source} onChange={handleInputChange}
            options={dropdownData.budgetSources.map(bs => ({ value: bs.id, label: bs.name }))} required/>
          <Select label="Fiscal Year" name="fiscal_year" value={formData.fiscal_year} onChange={handleInputChange}
            options={dropdownData.fiscalYears.map(fy => ({ value: fy.id, label: fy.year_label }))} required/>
        </Section>

        {/* PERSONNEL */}
        <Section title="Personnel Assignment">
          <Select label="Assigned Engineer" name="assigned_engineer" value={formData.assigned_engineer} onChange={handleInputChange}
            options={dropdownData.engineers.map(eng => ({ value: eng.id, label: getEngineerName(eng) }))}/>
          <Select label="Chairperson" name="chairperson" value={formData.chairperson} onChange={handleInputChange}
            options={dropdownData.chairpersons.map(chair => ({ value: chair.id, label: getChairpersonName(chair) }))}/>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Contractor <span className="text-red-500">*</span></label>
            <select name="contractor" value={formData.contractor} onChange={handleContractorChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select Contractor</option>
              {dropdownData.contractors.map(cont => (
                <option key={cont.id} value={cont.id}>{getContractorLabel(cont)}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Only active (approved) contractors are shown</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Company Name</label>
            <input type="text" value={selectedCompanyName} readOnly placeholder="Auto-filled when contractor is selected"
              className={`w-full border rounded px-3 py-2 cursor-not-allowed ${selectedCompanyName ? "border-green-300 bg-green-50 text-gray-800" : "border-gray-300 bg-gray-50 text-gray-400"}`}/>
            <p className="text-xs text-gray-500 mt-1">ℹ️ Auto-filled from selected contractor's company name</p>
          </div>
        </Section>

        {/* TIMELINE */}
        <Section title="Project Timeline">
          <DateInput label="Proposed Date"           name="proposed_date"           value={formData.proposed_date}           onChange={handleInputChange}/>
          <DateInput label="Approved Date"            name="approved_date"            value={formData.approved_date}            onChange={handleInputChange}/>
          <DateInput label="Planned Start Date"       name="planned_start_date"       value={formData.planned_start_date}       onChange={handleInputChange} required/>
          <DateInput label="Planned Completion Date"  name="planned_completion_date"  value={formData.planned_completion_date}  onChange={handleInputChange} required/>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Planned Duration (Days)</label>
            <input type="number" name="planned_duration_days" value={formData.planned_duration_days} readOnly
              placeholder="Auto-calculated"
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-700 cursor-not-allowed"/>
            <p className="text-xs text-gray-500 mt-1">ℹ️ Auto-calculated from start and completion dates</p>
          </div>
        </Section>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button type="button" onClick={handleCancel} disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin"/>}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Reusable UI ── */
function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700 text-lg border-b pb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
    </div>
  );
}

function Select({ label, name, value, onChange, options = [], required = false }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select name={name} value={value} onChange={onChange} required={required}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
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
      <input type="date" name={name} value={value} onChange={onChange} required={required}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
    </div>
  );
}