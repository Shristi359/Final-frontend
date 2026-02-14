import { NavLink, Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ProjectLayout() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const tabClass = ({ isActive }) =>
    `px-4 py-2 rounded transition-colors ${
      isActive 
        ? "bg-blue-500 text-white" 
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;

  const handleBack = () => {
    // Determine where to go back based on previous location
    const from = location.state?.from;
    
    if (from === 'delayed') {
      navigate('/app/projects/delayed');
    } else if (from === 'ongoing') {
      navigate('/app/projects/ongoing');
    } else if (from === 'completed') {
      navigate('/app/projects/completed');
    } else {
      navigate('/app/projects');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Back to Projects List"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          Project Details
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 flex-wrap">
        <NavLink to="overview" className={tabClass}>
          Overview
        </NavLink>

        <NavLink to="measurement" className={tabClass}>
          Measurement Book
        </NavLink>

        <NavLink to="abstract" className={tabClass}>
          Abstract Record
        </NavLink>

        <NavLink to="materials" className={tabClass}>
          Materials
        </NavLink>

        <NavLink to="gantt" className={tabClass}>
          Gantt Chart
        </NavLink>
      </div>

      {/* Tab Content */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}