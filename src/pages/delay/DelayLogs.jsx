import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function DelayLogs() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-8">

      <h1 className="text-2xl font-semibold">
        Delay Logs Management
      </h1>

      {/* Example Delay Card */}
      <div className="border border-red-400 bg-red-50 rounded-xl p-5 flex justify-between items-center">
        <div>
          <p className="font-semibold">Nepalgunj-Kohalpur Highway</p>
          <p className="text-sm text-red-600">Delayed for 45 days - NO DOCUMENTATION</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
        >
          Submit Delay Log
        </button>
      </div>

      {showModal && <DelayLogModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

/* ================= MODAL ================= */

function DelayLogModal({ onClose }) {
  const [formData, setFormData] = useState({
    logDate: "",
    delayType: "",
    estimatedDays: "",
    progress: "",
    description: "",
    actions: "",
    impact: "",
    reportedBy: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Delay Log Submitted (Temporary)");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">

      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={22} />
            <h2 className="text-lg font-semibold">
              Project Delay Log (Project Name)
            </h2>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700">
          <strong>Important:</strong> Use this form to document any delays
          affecting the project timeline. Provide detailed information to
          help with analysis and mitigation planning.
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <Input
            label="Log Date *"
            type="date"
            name="logDate"
            onChange={handleChange}
          />

          <Select
            label="Delay Type *"
            name="delayType"
            onChange={handleChange}
            options={[
              "Weather",
              "Material Shortage",
              "Labor Issues",
              "Administrative Delay",
              "Technical Issues",
              "Other",
            ]}
          />

          <Input
            label="Estimated Delay (Days) *"
            name="estimatedDays"
            placeholder="e.g., 15"
            onChange={handleChange}
          />

          <Input
            label="Current Progress (%)"
            name="progress"
            placeholder="e.g., 65"
            onChange={handleChange}
          />

          <Textarea
            label="Delay Description *"
            name="description"
            placeholder="Provide detailed description..."
            onChange={handleChange}
          />

          <Textarea
            label="Actions Taken *"
            name="actions"
            placeholder="Describe corrective actions..."
            onChange={handleChange}
          />

          <Textarea
            label="Impact on Schedule"
            name="impact"
            placeholder="Describe schedule impact..."
            onChange={handleChange}
          />

          <Input
            label="Reported By *"
            name="reportedBy"
            placeholder="Your name and position"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition font-medium"
          >
            Submit Delay Log
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================= Reusable Inputs ================= */

function Input({ label, name, type = "text", placeholder, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}

function Textarea({ label, name, placeholder, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        rows="4"
        placeholder={placeholder}
        onChange={onChange}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}

function Select({ label, name, options, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        onChange={onChange}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="">Select Delay Type</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
