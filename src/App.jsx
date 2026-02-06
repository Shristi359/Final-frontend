import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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

export default function App() {
  return (
    <Router>
      <Routes>
        {/* DEFAULT → LOGIN */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route
          path="/app/*"
          element={
            <RequireAuth allowedRoles={["ADMIN", "STAFF"]}>
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Topbar />
                  <main className="p-6 overflow-y-auto">
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />

                      {/* PROJECTS */}
                      <Route path="projects" element={<ProjectsList />} />
                      <Route path="projects/ongoing" element={<OngoingProjects />} />
                      <Route path="projects/completed" element={<CompletedProjects />} />
                      <Route path="projects/delayed" element={<DelayedProjects />} />
                      <Route path="projects/add" element={<AddProject />} />

                      {/* CONTRACTORS */}
                      <Route path="contractors" element={<ContractorsList />} />
                      <Route path="contractors/add" element={<AddContractor />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}
