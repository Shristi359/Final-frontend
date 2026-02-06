import { Plus } from "lucide-react";

const projects = [
  {
    id: 1,
    name: "Road Expansion Project",
    location: "Ward 16",
    contractor: "ABC Builders",
    status: "delaying",
    image: "https://via.placeholder.com/80",
  },
  {
    id: 2,
    name: "Drainage Improvement",
    location: "Ward 10",
    contractor: "Urban Infra",
    status: "on-time",
    image: "https://via.placeholder.com/80",
  },
];

export default function OngoingProjects() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ongoing Projects</h2>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded">
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Ongoing" value="12" />
        <StatCard title="On Time" value="8" color="bg-green-100" />
        <StatCard title="Delaying" value="4" color="bg-red-100" />
      </div>

      {/* PROJECT LIST */}
      <div className="bg-white rounded border divide-y">
        {projects.map((project) => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ title, value, color = "bg-gray-100" }) {
  return (
    <div className={`p-4 rounded ${color}`}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function ProjectRow({ project }) {
  const isDelaying = project.status === "delaying";

  return (
    <div className="flex items-center gap-4 p-4">
      {/* IMAGE */}
      <img
        src={project.image}
        alt="project"
        className="w-20 h-20 rounded object-cover"
      />

      {/* INFO */}
      <div className="flex-1">
        <p className="font-medium">{project.name}</p>
        <p className="text-sm text-gray-500">
          {project.location} • {project.contractor}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3">
        <button className="px-3 py-1 text-sm border rounded">
          Update Log
        </button>
        <button className="px-3 py-1 text-sm border rounded">
          Update Details
        </button>

        <span
          className={`px-3 py-1 text-xs rounded-full ${
            isDelaying
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {isDelaying ? "Delaying" : "On Time"}
        </span>
      </div>
    </div>
  );
}
