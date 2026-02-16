import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

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
import CancelledProjects from "./pages/projects/CancelledProjects";
import AddProject from "./pages/projects/AddProject";

// PROJECT DETAILS
import ProjectLayout from "./pages/projects/ProjectLayout";
import ProjectOverview from "./pages/projects/ProjectOverview";
import ProjectMeasurement from "./pages/projects/ProjectMeasurement";
import ProjectAbstract from "./pages/projects/ProjectAbstract";
import ProjectMaterials from "./pages/projects/ProjectMaterials";
import ProjectGantt from "./pages/projects/ProjectGantt";

// LOGS
import ProjectLogs from "./pages/projects/ProjectLogs";
import WeeklyLogs from "./pages/projects/WeeklyLogs";

// CONTRACTORS
import ContractorsList from "./pages/contractors/ContractorsList";
import AddContractor from "./pages/contractors/AddContractor";

// ENGINEERS
import EngineersList from "./pages/engineers/EngineersList";
import AddEngineer from "./pages/engineers/AddEngineer";

// CHAIRPERSONS
import ChairpersonsList from "./pages/chairpersons/ChairpersonsList";
import AddChairperson from "./pages/chairpersons/AddChairperson";

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
      <AuthProvider>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected App Layout */}
          <Route
            path="/app"
            element={
              <RequireAuth allowedRoles={["ADMIN", "USER"]}>
                <AppLayout />
              </RequireAuth>
            }
          >
            {/* Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />

            {/* Projects */}
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/ongoing" element={<OngoingProjects />} />
            <Route path="projects/completed" element={<CompletedProjects />} />
            <Route path="projects/delayed" element={<DelayedProjects />} />
            <Route path="projects/cancelled" element={<CancelledProjects />} />
            <Route path="projects/add" element={<AddProject />} />

            {/* Project Details with Tabs */}
            <Route path="projects/:projectId" element={<ProjectLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<ProjectOverview />} />
              <Route path="measurement" element={<ProjectMeasurement />} />
              <Route path="abstract" element={<ProjectAbstract />} />
              <Route path="materials" element={<ProjectMaterials />} />
              <Route path="gantt" element={<ProjectGantt />} />
              <Route path="weekly-logs" element={<WeeklyLogs />} />
            </Route>

            {/* Legacy Logs Routes (keeping for backward compatibility) */}
            <Route path="projects/:projectId/logs" element={<ProjectLogs />} />

            {/* Delay Logs */}
            <Route path="delay-logs/:projectId" element={<DelayLogs />} />

            {/* Contractors */}
            <Route path="contractors" element={<ContractorsList />} />
            <Route path="contractors/add" element={<AddContractor />} />

            {/* Engineers */}
            <Route path="engineers" element={<EngineersList />} />
            <Route path="engineers/add" element={<AddEngineer />} />

            {/* Chairpersons */}
            <Route path="chairpersons" element={<ChairpersonsList />} />
            <Route path="chairpersons/add" element={<AddChairperson />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Global Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}