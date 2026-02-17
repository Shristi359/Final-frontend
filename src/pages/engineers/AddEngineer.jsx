import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { engineersAPI, accountsAPI } from "../../api/axios";
import { Loader2 } from "lucide-react";

export default function AddEngineer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [step, setStep] = useState(isEdit ? 2 : 1); // Edit skips to step 2
  const [createdAccountId, setCreatedAccountId] = useState(null);

  const [accountData, setAccountData] = useState({
    user_id: "", full_name: "", email: "", password: "", role: "USER"
  });

  const [engineerData, setEngineerData] = useState({
    ward_no: "", role: "ENGINEER"
  });

  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError]       = useState(null);

  // Pre-fill engineer data when editing
  useEffect(() => {
    if (!isEdit) return;
    engineersAPI.get(id)
      .then(res => {
        const d = res.data;
        setEngineerData({
          ward_no: d.ward_no || "",
          role:    d.role    || "ENGINEER",
        });
      })
      .catch(() => setError("Failed to load engineer data."))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const handleAccountChange  = (e) => setAccountData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEngineerChange = (e) => setEngineerData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await accountsAPI.create(accountData);
      setCreatedAccountId(res.data.id);
      setStep(2);
    } catch (err) {
      console.error("Error creating account:", err);
      setError(err.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleEngineerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ward_no:    engineerData.ward_no ? parseInt(engineerData.ward_no) : null,
        role:       engineerData.role,
        is_active:  true,
        ...(!isEdit && { account: createdAccountId }),
      };

      if (isEdit) {
        await engineersAPI.update(id, payload);
        alert("Engineer updated successfully!");
      } else {
        await engineersAPI.create(payload);
        alert("Engineer added successfully!");
      }
      navigate("/app/engineers");
    } catch (err) {
      console.error("Error saving engineer:", err);
      setError(err.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} engineer.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel?")) navigate("/app/engineers");
  };

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <h2 className="text-2xl font-bold text-gray-800">
        {isEdit ? "Edit Engineer" : "Add New Engineer"}
      </h2>

      {/* Step indicator — only show for add mode */}
      {!isEdit && (
        <div className="flex items-center justify-center gap-4 mb-8">
          <StepIndicator number={1} label="Account Info"     active={step === 1} completed={step > 1} />
          <div className="w-16 h-1 bg-gray-300" />
          <StepIndicator number={2} label="Engineer Details" active={step === 2} />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* STEP 1 — Account (add only) */}
      {step === 1 && !isEdit && (
        <form onSubmit={handleAccountSubmit} className="bg-white border rounded-lg p-6 space-y-6">
          <Section title="Account Information">
            <Input label="User ID *"   name="user_id"   value={accountData.user_id}   onChange={handleAccountChange} required placeholder="e.g., eng001" />
            <Input label="Full Name *" name="full_name" value={accountData.full_name} onChange={handleAccountChange} required />
            <Input label="Email *"     name="email"     type="email" value={accountData.email} onChange={handleAccountChange} required />
            <Input label="Password *"  name="password"  type="password" value={accountData.password} onChange={handleAccountChange} required />
          </Section>
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button type="button" onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating..." : "Next"}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2 — Engineer details */}
      {step === 2 && (
        <form onSubmit={handleEngineerSubmit} className="bg-white border rounded-lg p-6 space-y-6">
          <Section title="Engineer Information">
            <Input label="Ward Number" name="ward_no" type="number"
              value={engineerData.ward_no} onChange={handleEngineerChange} placeholder="e.g., 16" />
            <Select label="Role *" name="role" value={engineerData.role} onChange={handleEngineerChange} required
              options={[
                { value: "ENGINEER",   label: "Engineer" },
                { value: "SUPERVISOR", label: "Supervisor" },
              ]} />
          </Section>
          <div className="flex justify-end gap-4 pt-4 border-t">
            {!isEdit && (
              <button type="button" onClick={() => setStep(1)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Back
              </button>
            )}
            {isEdit && (
              <button type="button" onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
            )}
            <button type="submit" disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Save Engineer"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function StepIndicator({ number, label, active, completed }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
        completed ? "bg-green-500 text-white" :
        active    ? "bg-blue-600 text-white"  :
                    "bg-gray-300 text-gray-600"
      }`}>
        {completed ? "✓" : number}
      </div>
      <span className="text-xs text-gray-600 mt-2">{label}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700 text-lg">{title}</h3>
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
        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}