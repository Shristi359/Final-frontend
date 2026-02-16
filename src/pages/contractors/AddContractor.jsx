import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { contractorsAPI } from "../../api/axios";
import { Loader2, Upload, X } from "lucide-react";

export default function AddContractor() {
  const navigate = useNavigate();
  
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
    suchidarta_completed: true, // NEW: true = completed/active, false = pending
  });

  const [files, setFiles] = useState({
    registration_certificate: null,
    pan_vat_certificate: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const removeFile = (fieldName) => {
    setFiles(prev => ({ ...prev, [fieldName]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();

      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key === 'suchidarta_completed') {
          // Map suchidarta_completed to suchidarta_flagged (SAME VALUE)
          // suchidarta_completed: true → suchidarta_flagged: true (COMPLETED/ACTIVE)
          // suchidarta_completed: false → suchidarta_flagged: false (PENDING)
          submitData.append('suchidarta_flagged', formData.suchidarta_completed);
        } else if (formData[key] !== "" && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      // Always set is_active to true
      submitData.append('is_active', true);

      // Append files if selected
      if (files.registration_certificate) {
        submitData.append('registration_certificate', files.registration_certificate);
      }
      if (files.pan_vat_certificate) {
        submitData.append('pan_vat_certificate', files.pan_vat_certificate);
      }

      await contractorsAPI.create(submitData);
      
      alert("Contractor added successfully!");
      navigate('/app/contractors');
    } catch (error) {
      console.error("Error creating contractor:", error);
      console.error("Error response:", error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          setError(errorMessages);
        } else {
          setError("Failed to create contractor");
        }
      } else {
        setError("Failed to create contractor");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel?")) {
      navigate('/app/contractors');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow max-w-6xl mx-auto">
      <div className="bg-[#1F4E79] text-white text-center py-3 rounded-t-2xl text-lg font-semibold">
        Contractor Details
      </div>

      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* BASIC DETAILS */}
        <div className="grid md:grid-cols-3 gap-6">
          <Input 
            label="Contractor Name *" 
            name="contractor_name" 
            value={formData.contractor_name}
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Address" 
            name="address" 
            value={formData.address}
            onChange={handleChange} 
          />
          <Input 
            label="Registration No." 
            name="registration_no" 
            value={formData.registration_no}
            onChange={handleChange} 
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Input 
            type="date" 
            label="Latest Renewal Date" 
            name="latest_renewal_date" 
            value={formData.latest_renewal_date}
            onChange={handleChange} 
          />
          <Input 
            type="email" 
            label="Email" 
            name="email" 
            value={formData.email}
            onChange={handleChange} 
          />
          <Select
            label="Contractor Type"
            name="contractor_type"
            value={formData.contractor_type}
            onChange={handleChange}
            options={[
              { value: "A", label: "Type A" },
              { value: "B", label: "Type B" },
              { value: "C", label: "Type C" },
              { value: "D", label: "Type D" },
            ]}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Input 
            label="PAN/VAT No." 
            name="pan_vat_no" 
            value={formData.pan_vat_no}
            onChange={handleChange} 
          />
          <Input 
            label="Contact Number" 
            name="contact_number" 
            value={formData.contact_number}
            onChange={handleChange} 
          />
        </div>

        <hr />

        {/* COMPANY SECTION */}
        <div className="text-sm font-semibold text-gray-600">
          Company Information (If Firm/Company Type)
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Input 
            label="Company Name" 
            name="company_name" 
            value={formData.company_name}
            onChange={handleChange} 
          />
          <Input 
            label="Company Phone" 
            name="company_phone" 
            value={formData.company_phone}
            onChange={handleChange} 
          />
          <Input 
            label="Company Email" 
            name="company_email" 
            value={formData.company_email}
            onChange={handleChange} 
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Input 
            label="Company Address" 
            name="company_address" 
            value={formData.company_address}
            onChange={handleChange} 
          />
          <Input 
            label="Municipality" 
            name="municipality" 
            value={formData.municipality}
            onChange={handleChange} 
          />
          <Input 
            label="District" 
            name="district" 
            value={formData.district}
            onChange={handleChange} 
          />
        </div>

        <hr />

        {/* DOCUMENTS SECTION */}
        <div className="text-sm font-semibold text-gray-600">
          Documents
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FileInput 
            label="Registration Certificate"
            name="registration_certificate"
            file={files.registration_certificate}
            onChange={handleFileChange}
            onRemove={() => removeFile('registration_certificate')}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <FileInput 
            label="PAN/VAT Certificate"
            name="pan_vat_certificate"
            file={files.pan_vat_certificate}
            onChange={handleFileChange}
            onRemove={() => removeFile('pan_vat_certificate')}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>

        <hr />

        {/* SUCHIDARTA STATUS */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="suchidarta_completed"
              checked={formData.suchidarta_completed}
              onChange={handleChange}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1">
                Suchidarta Completed
              </label>
              <p className="text-xs text-gray-600">
                ✓ <strong>Checked (Yes)</strong> = Suchidarta completed → Status: <strong className="text-green-700">ACTIVE/APPROVED</strong> → Will appear in project forms<br/>
                ✗ <strong>Unchecked (No)</strong> = Suchidarta pending → Status: <strong className="text-orange-700">PENDING APPROVAL</strong> → Will NOT appear in project forms
              </p>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-8 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1F4E79] hover:bg-[#163a5a] text-white px-8 py-2 rounded-md transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Adding..." : "Add Contractor"}
          </button>
        </div>

      </form>
    </div>
  );
}

function Input({ label, name, type = "text", value, onChange, required = false }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1F4E79]"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options = [], required = false }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1F4E79]"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileInput({ label, name, file, onChange, onRemove, accept = "", required = false }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      
      {!file ? (
        <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-md px-4 py-6 cursor-pointer hover:border-[#1F4E79] hover:bg-gray-50 transition">
          <Upload size={20} className="text-gray-400" />
          <span className="text-sm text-gray-600">Choose file or drag & drop</span>
          <input
            type="file"
            name={name}
            onChange={onChange}
            accept={accept}
            required={required}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-3 bg-gray-50">
          <div className="flex items-center gap-2">
            <Upload size={16} className="text-green-600" />
            <span className="text-sm text-gray-700">{file.name}</span>
            <span className="text-xs text-gray-500">
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800"
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      <p className="text-xs text-gray-500">Accepted: PDF, JPG, PNG (Max 5MB)</p>
    </div>
  );
}