import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

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

// CONTRACTORS
import ContractorsList from "./pages/contractors/ContractorsList";
import AddContractor from "./pages/contractors/AddContractor";

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
        {/* Default → Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected Layout */}
        <Route
          path="/app"
          element={
            <RequireAuth allowedRoles={["ADMIN", "STAFF"]}>
              <AppLayout />
            </RequireAuth>
          }
        >
          {/* Nested Routes */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Projects */}
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/ongoing" element={<OngoingProjects />} />
          <Route path="projects/completed" element={<CompletedProjects />} />
          <Route path="projects/delayed" element={<DelayedProjects />} />
          <Route path="projects/add" element={<AddProject />} />

          {/* Contractors */}
          <Route path="contractors" element={<ContractorsList />} />
          <Route path="contractors/add" element={<AddContractor />} />
        </Route>
      </Routes>
    </Router>
  );
}
