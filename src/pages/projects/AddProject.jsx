export default function AddProject() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h2 className="text-xl font-semibold">Add New Project</h2>

      <form className="bg-white border rounded-lg p-6 space-y-8">

        {/* BASIC INFO */}
        <Section title="Basic Project Information">
          <Input label="Project Name" />
          <Textarea label="Project Description" />
        </Section>

        {/* LOCATION */}
        <Section title="Location & Ward">
          <Input label="Municipality" />
          <Input label="Ward Number" />
          <Input label="Project Location" />
        </Section>

        {/* CONTRACTOR */}
        <Section title="Contractor Assignment">
          <Select label="Assigned Contractor" />
          <Input label="Contractor Contact Person" />
        </Section>

        {/* TIMELINE */}
        <Section title="Project Timeline">
          <DateInput label="Start Date" />
          <DateInput label="Expected Completion Date" />
        </Section>

        {/* BUDGET */}
        <Section title="Budget Details">
          <Input label="Estimated Budget (NPR)" />
          <Input label="Allocated Budget (NPR)" />
        </Section>

        {/* MILESTONES */}
        <Section title="Milestones">
          <Input label="Milestone Name" />
          <DateInput label="Target Date" />
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
          >
            + Add another milestone
          </button>
        </Section>

        {/* DOCUMENTS */}
        <Section title="Project Documents">
          <input
            type="file"
            className="block w-full text-sm border rounded px-3 py-2"
          />
          <p className="text-xs text-gray-500">
            Upload DPR, contract files, approvals, etc.
          </p>
        </Section>

        {/* STATUS */}
        <Section title="Project Status">
          <Select label="Project Status" options={["Ongoing", "Completed", "Delayed"]} />
          <Select label="Priority Level" options={["Low", "Medium", "High"]} />
        </Section>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            className="px-6 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#1F4E79] text-white rounded"
          >
            Save Project
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
      <h3 className="font-medium text-gray-700">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Input({ label }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input className="w-full border rounded px-3 py-2" />
    </div>
  );
}

function Textarea({ label }) {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <textarea className="w-full border rounded px-3 py-2" rows={3} />
    </div>
  );
}

function Select({ label, options = [] }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <select className="w-full border rounded px-3 py-2">
        <option>Select</option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function DateInput({ label }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type="date"
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}
