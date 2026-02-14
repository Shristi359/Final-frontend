import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Login from "./auth/Login";
import RequireAuth from "./auth/RequireAuth";

import Dashboard from "./pages/Dashboard";

// PROJECTS
import ProjectsList from "./pages/projects/ProjectsList";
import OngoingProjects from "./pages/projects/OngoingProjects";
import CompletedProjects from "./pages/projects/CompletedProjects";
import DelayedProjects from "./pages/projects/DelayedProjects";
import AddProject from "./pages/projects/AddProject";

// PROJECT DETAILS
import ProjectLayout from "./pages/projects/ProjectLayout";
import ProjectOverview from "./pages/projects/ProjectOverview";
import ProjectMeasurement from "./pages/projects/ProjectMeasurement";
import ProjectAbstract from "./pages/projects/ProjectAbstract";
import ProjectMaterials from "./pages/projects/ProjectMaterials";
import ProjectGantt from "./pages/projects/ProjectGantt.jsx";
import ProjectLogs from "./pages/projects/ProjectLogs"; // NEW: Import ProjectLogs

// CONTRACTORS
import ContractorsList from "./pages/contractors/ContractorsList";
import AddContractor from "./pages/contractors/AddContractor";

// DELAY LOGS
import DelayLogs from "./pages/delay/DelayLogs";

function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-6 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route → Redirect to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected App Layout */}
        <Route
          path="/app"
          element={
            <RequireAuth allowedRoles={["ADMIN", "STAFF"]}>
              <AppLayout />
            </RequireAuth>
          }
        >
          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Projects Lists */}
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/ongoing" element={<OngoingProjects />} />
          <Route path="projects/completed" element={<CompletedProjects />} />
          <Route path="projects/delayed" element={<DelayedProjects />} />
          <Route path="projects/add" element={<AddProject />} />

          {/* Project Detail Layout with Tabs */}
          <Route path="projects/:projectId" element={<ProjectLayout />}>
            {/* Default redirect to overview */}
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<ProjectOverview />} />
            <Route path="measurement" element={<ProjectMeasurement />} />
            <Route path="abstract" element={<ProjectAbstract />} />
            <Route path="materials" element={<ProjectMaterials />} />
            <Route path="gantt" element={<ProjectGantt />} />
          </Route>

          {/* NEW: Project Logs - Standalone page (not inside ProjectLayout) */}
          <Route path="projects/:projectId/logs" element={<ProjectLogs />} />

          {/* Contractors */}
          <Route path="contractors" element={<ContractorsList />} />
          <Route path="contractors/add" element={<AddContractor />} />

          {/* Delay Logs - Project specific */}
          <Route path="delay-logs/:projectId" element={<DelayLogs />} />


          {/* Fallback inside /app */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}