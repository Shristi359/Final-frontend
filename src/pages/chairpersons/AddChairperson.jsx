import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { chairpersonsAPI, accountsAPI } from "../../api/axios";
import { Loader2 } from "lucide-react";

export default function AddChairperson() {
  const navigate = useNavigate();
  
  // Step 1: Create Account, Step 2: Create Chairperson Profile
  const [step, setStep] = useState(1);
  const [createdAccountId, setCreatedAccountId] = useState(null);
  
  const [accountData, setAccountData] = useState({
    user_id: "",
    full_name: "",
    email: "",
    password: "",
    role: "USER"
  });

  const [chairpersonData, setChairpersonData] = useState({
    term_start: "",
    term_end: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData({ ...accountData, [name]: value });
  };

  const handleChairpersonChange = (e) => {
    const { name, value } = e.target;
    setChairpersonData({ ...chairpersonData, [name]: value });
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await accountsAPI.create(accountData);
      setCreatedAccountId(response.data.id);
      setStep(2);
    } catch (error) {
      console.error("Error creating account:", error);
      setError(error.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleChairpersonSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        account: createdAccountId,
        term_start: chairpersonData.term_start || null,
        term_end: chairpersonData.term_end || null
      };

      await chairpersonsAPI.create(submitData);
      
      alert("Chairperson added successfully!");
      navigate('/app/chairpersons');
    } catch (error) {
      console.error("Error creating chairperson:", error);
      setError(error.response?.data?.message || "Failed to create chairperson profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      navigate('/app/chairpersons');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Add New Chairperson</h2>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <StepIndicator number={1} label="Account Info" active={step === 1} completed={step > 1} />
        <div className="w-16 h-1 bg-gray-300"></div>
        <StepIndicator number={2} label="Term Details" active={step === 2} completed={false} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* STEP 1: Account Creation */}
      {step === 1 && (
        <form onSubmit={handleAccountSubmit} className="bg-white border rounded-lg p-6 space-y-6">
          <Section title="Account Information">
            <Input
              label="User ID"
              name="user_id"
              value={accountData.user_id}
              onChange={handleAccountChange}
              required
              placeholder="e.g., chair001"
            />
            <Input
              label="Full Name"
              name="full_name"
              value={accountData.full_name}
              onChange={handleAccountChange}
              required
              placeholder="Enter full name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={accountData.email}
              onChange={handleAccountChange}
              required
              placeholder="email@example.com"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={accountData.password}
              onChange={handleAccountChange}
              required
              placeholder="Strong password"
            />
          </Section>

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
              {loading ? "Creating..." : "Next: Term Details"}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Chairperson Profile */}
      {step === 2 && (
        <form onSubmit={handleChairpersonSubmit} className="bg-white border rounded-lg p-6 space-y-6">
          <Section title="Term Information">
            <DateInput
              label="Term Start Date"
              name="term_start"
              value={chairpersonData.term_start}
              onChange={handleChairpersonChange}
            />
            <DateInput
              label="Term End Date"
              name="term_end"
              value={chairpersonData.term_end}
              onChange={handleChairpersonChange}
            />
          </Section>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Saving..." : "Save Chairperson"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function StepIndicator({ number, label, active, completed }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
        completed ? 'bg-green-500 text-white' :
        active ? 'bg-blue-600 text-white' :
        'bg-gray-300 text-gray-600'
      }`}>
        {completed ? '✓' : number}
      </div>
      <span className="text-xs text-gray-600 mt-2">{label}</span>
    </div>
  );
}

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