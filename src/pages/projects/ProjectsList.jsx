import { useNavigate } from "react-router-dom";

export default function ProjectsList() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button
          onClick={() => navigate("/projects/add")}
          className="bg-slate-800 text-white px-4 py-2"
        >
          Add Project
        </button>
      </div>

      <div className="bg-white p-4 border rounded">
        Project list table here
      </div>
    </div>
  );
}
