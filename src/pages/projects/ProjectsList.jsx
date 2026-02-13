import { useNavigate } from "react-router-dom";

export default function ProjectsList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects</h1>

        <button
          onClick={() => navigate("/app/projects/add")}
          className="bg-[#1F4E79] hover:bg-[#163a5a] text-white px-6 py-2 rounded-md transition"
        >
          + Add Project
        </button>
      </div>

      {/* FILTER CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatusCard
          title="Total Projects"
          count="24"
          color="text-blue-600"
        />

        <StatusCard
          title="Ongoing"
          count="8"
          color="text-green-600"
          onClick={() => navigate("/app/projects/ongoing")}
        />

        <StatusCard
          title="Completed"
          count="12"
          color="text-indigo-600"
          onClick={() => navigate("/app/projects/completed")}
        />

        <StatusCard
          title="Delayed"
          count="4"
          color="text-red-600"
          onClick={() => navigate("/app/projects/delayed")}
        />

      </div>

      {/* PROJECT CARD EXAMPLE */}
      <ProjectCard />

    </div>
  );
}

function StatusCard({ title, count, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow cursor-pointer hover:shadow-md transition"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
    </div>
  );
}

function ProjectCard() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-3">

      <div className="flex justify-between">
        <h2 className="font-semibold">Ward Road Improvement Project</h2>
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
          Ongoing
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
        <p>Contractor: Himalayan Construction</p>
        <p>Start Date: 2023-01-15</p>
        <p>Budget: NPR 2,500,000</p>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
        View Details
      </button>

    </div>
  );
}
