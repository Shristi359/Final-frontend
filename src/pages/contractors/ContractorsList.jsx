import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ContractorsList() {
  const navigate = useNavigate();

  const contractors = [
    {
      id: 1,
      name: "ABC Builders",
      contact: "9841XXXXXX",
      email: "abc@builders.com",
      status: "Active",
    },
    {
      id: 2,
      name: "Urban Infra Pvt. Ltd.",
      contact: "9818XXXXXX",
      email: "urban@infra.com",
      status: "Inactive",
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Contractors</h2>

        <button
          onClick={() => navigate("/app/contractors/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <Plus size={18} />
          Add Contractor
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Contact</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {contractors.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.contact}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
