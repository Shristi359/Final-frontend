import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contractorsAPI } from "../../api/axios";
import { Loader2, Upload, X } from "lucide-react";

export default function AddContractor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    contractor_name: "",
    address: "",
    registration_no: "",
    latest_renewal_date: "",
    email: "",
    contractor_type: "",
    pan_vat_no: "",
    contact_number: "",
    company_name: "",
    company_phone: "",
    company_email: "",
    company_address: "",
    municipality: "",
    district: "",
    suchidarta_completed: true,
  });

  const [files, setFiles] = useState({
    registration_certificate: null,
    pan_vat_certificate: null,
  });

  const [existingFiles, setExistingFiles] = useState({
    registration_certificate: null,
    pan_vat_certificate: null,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (!isEdit) return;
    contractorsAPI.get(id)
      .then(res => {
        const d = res.data;
        setFormData({
          contractor_name:     d.contractor_name     || "",
          address:             d.address             || "",
          registration_no:     d.registration_no     || "",
          latest_renewal_date: d.latest_renewal_date || "",
          email:               d.email               || "",
          contractor_type:     d.contractor_type     || "",
          pan_vat_no:          d.pan_vat_no          || "",
          contact_number:      d.contact_number      || "",
          company_name:        d.company_name        || "",
          company_phone:       d.company_phone       || "",
          company_email:       d.company_email       || "",
          company_address:     d.company_address     || "",
          municipality:        d.municipality        || "",
          district:            d.district            || "",
          suchidarta_completed: d.suchidarta_flagged ?? true,
        });
        setExistingFiles({
          registration_certificate: d.registration_certificate || null,
          pan_vat_certificate:      d.pan_vat_certificate      || null,
        });
      })
      .catch(() => setError("Failed to load contractor data."))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selected } = e.target;
    if (selected?.[0]) setFiles(prev => ({ ...prev, [name]: selected[0] }));
  };

  const removeNewFile      = (name) => setFiles(prev => ({ ...prev, [name]: null }));
  const removeExistingFile = (name) => setExistingFiles(prev => ({ ...prev, [name]: null }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === "suchidarta_completed") {
          submitData.append("suchidarta_flagged", formData.suchidarta_completed);
        } else if (formData[key] !== "" && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      submitData.append("is_active", true);

      if (files.registration_certificate)
        submitData.append("registration_certificate", files.registration_certificate);
      if (files.pan_vat_certificate)
        submitData.append("pan_vat_certificate", files.pan_vat_certificate);

      if (isEdit) {
        await contractorsAPI.update(id, submitData);
        alert("Contractor updated successfully!");
      } else {
        await contractorsAPI.create(submitData);
        alert("Contractor added successfully!");
      }

      navigate("/app/contractors");
    } catch (err) {
      console.error("Error submitting contractor:", err);
      const data = err.response?.data;
      if (data && typeof data === "object") {
        setError(Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("; "));
      } else {
        setError(`Failed to ${isEdit ? "update" : "add"} contractor.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel?")) navigate("/app/contractors");
  };

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow max-w-6xl mx-auto">
      <div className="bg-[#1F4E79] text-white text-center py-3 rounded-t-2xl text-lg font-semibold">
        {isEdit ? "Edit Contractor" : "Contractor Details"}
      </div>

      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-8">

        {/* BASIC DETAILS */}
        <div className="grid md:grid-cols-3 gap-6">
          <Input label="Contractor Name *" name="contractor_name" value={formData.contractor_name} onChange={handleChange} required />
          <Input label="Address"           name="address"         value={formData.address}         onChange={handleChange} />
          <Input label="Registration No."  name="registration_no" value={formData.registration_no} onChange={handleChange} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Input type="date"  label="Latest Renewal Date" name="latest_renewal_date" value={formData.latest_renewal_date} onChange={handleChange} />
          <Input type="email" label="Email"               name="email"               value={formData.email}               onChange={handleChange} />
          <Select label="Contractor Type" name="contractor_type" value={formData.contractor_type} onChange={handleChange}
            options={[
              { value: "A", label: "Type A" },
              { value: "B", label: "Type B" },
              { value: "C", label: "Type C" },
              { value: "D", label: "Type D" },
            ]} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Input label="PAN/VAT No."    name="pan_vat_no"     value={formData.pan_vat_no}     onChange={handleChange} />
          <Input label="Contact Number" name="contact_number" value={formData.contact_number} onChange={handleChange} />
        </div>

        <hr />

        {/* COMPANY */}
        <div className="text-sm font-semibold text-gray-600">
          Company Information (If Firm/Company Type)
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Input label="Company Name"  name="company_name"  value={formData.company_name}  onChange={handleChange} />
          <Input label="Company Phone" name="company_phone" value={formData.company_phone} onChange={handleChange} />
          <Input label="Company Email" name="company_email" value={formData.company_email} onChange={handleChange} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Input label="Company Address" name="company_address" value={formData.company_address} onChange={handleChange} />
          <Input label="Municipality"    name="municipality"    value={formData.municipality}    onChange={handleChange} />
          <Input label="District"        name="district"        value={formData.district}        onChange={handleChange} />
        </div>

        <hr />

        {/* DOCUMENTS */}
        <div className="text-sm font-semibold text-gray-600">Documents</div>

        <div className="grid md:grid-cols-2 gap-6">
          <FileInput
            label="Registration Certificate"
            name="registration_certificate"
            newFile={files.registration_certificate}
            existingUrl={existingFiles.registration_certificate}
            onChange={handleFileChange}
            onRemoveNew={() => removeNewFile("registration_certificate")}
            onRemoveExisting={() => removeExistingFile("registration_certificate")}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <FileInput
            label="PAN/VAT Certificate"
            name="pan_vat_certificate"
            newFile={files.pan_vat_certificate}
            existingUrl={existingFiles.pan_vat_certificate}
            onChange={handleFileChange}
            onRemoveNew={() => removeNewFile("pan_vat_certificate")}
            onRemoveExisting={() => removeExistingFile("pan_vat_certificate")}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>

        <hr />

        {/* SUCHIDARTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <input type="checkbox" name="suchidarta_completed" checked={formData.suchidarta_completed}
              onChange={handleChange}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1">Suchidarta Completed</label>
              <p className="text-xs text-gray-600">
                ✓ <strong>Checked (Yes)</strong> = Suchidarta completed → Status: <strong className="text-green-700">ACTIVE/APPROVED</strong> → Will appear in project forms<br />
                ✗ <strong>Unchecked (No)</strong> = Suchidarta pending → Status: <strong className="text-orange-700">PENDING APPROVAL</strong> → Will NOT appear in project forms
              </p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button type="button" onClick={handleCancel} disabled={loading}
            className="px-8 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="bg-[#1F4E79] hover:bg-[#163a5a] text-white px-8 py-2 rounded-md transition flex items-center gap-2 disabled:opacity-50">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Contractor"}
          </button>
        </div>

      </form>
    </div>
  );
}

/* ---------- REUSABLE ---------- */

function Input({ label, name, type = "text", value, onChange, required = false }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1F4E79]" />
    </div>
  );
}

function Select({ label, name, value, onChange, options = [], required = false }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <select name={name} value={value} onChange={onChange} required={required}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1F4E79]">
        <option value="">Select</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function FileInput({ label, name, newFile, existingUrl, onChange, onRemoveNew, onRemoveExisting, accept = "" }) {
  const existingName = existingUrl ? existingUrl.split("/").pop() : null;
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>

      {/* Existing file from backend */}
      {existingUrl && !newFile && (
        <div className="flex items-center justify-between border border-green-300 rounded-md px-4 py-3 bg-green-50 mb-2">
          <div className="flex items-center gap-2">
            <Upload size={16} className="text-green-600" />
            <a href={existingUrl} target="_blank" rel="noreferrer"
              className="text-sm text-green-700 underline truncate max-w-[180px]">
              {existingName}
            </a>
            <span className="text-xs text-gray-400">(current)</span>
          </div>
          <button type="button" onClick={onRemoveExisting} className="text-red-500 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* New file selected */}
      {newFile ? (
        <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-3 bg-gray-50">
          <div className="flex items-center gap-2">
            <Upload size={16} className="text-blue-600" />
            <span className="text-sm text-gray-700">{newFile.name}</span>
            <span className="text-xs text-gray-500">({(newFile.size / 1024).toFixed(1)} KB)</span>
          </div>
          <button type="button" onClick={onRemoveNew} className="text-red-500 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-md px-4 py-6 cursor-pointer hover:border-[#1F4E79] hover:bg-gray-50 transition">
          <Upload size={20} className="text-gray-400" />
          <span className="text-sm text-gray-600">{existingUrl ? "Replace file" : "Choose file or drag & drop"}</span>
          <input type="file" name={name} onChange={onChange} accept={accept} className="hidden" />
        </label>
      )}
      <p className="text-xs text-gray-500">Accepted: PDF, JPG, PNG (Max 5MB)</p>
    </div>
  );
}