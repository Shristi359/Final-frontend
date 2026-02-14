import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Calendar, MapPin, User, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
// import api from "../../services/axios";

export default function ProjectOverview() {
  const { projectId } = useParams();
  const location = useLocation();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`projects/${projectId}/`);
      // setProjectData(response.data);
      
      // Determine status based on where we came from or projectId
      const from = location.state?.from;
      let mockStatus = "Ongoing";
      let mockPhase = "Tech Phase";
      let mockProgress = 65;
      
      if (from === 'completed' || projectId.includes('001')) {
        mockStatus = "Completed";
        mockPhase = "Completed";
        mockProgress = 100;
      } else if (from === 'delayed') {
        mockStatus = "Delayed";
        mockPhase = "Tech Phase";
        mockProgress = 52;
      }
      
      // Mock data - this will be replaced with actual data from backend
      const mockData = {
        id: projectId,
        name: from === 'completed' ? "Ward Road Improvement Project" : "Nepalgunj-Kohalpur Highway Section",
        projectId: from === 'completed' ? "RO-2024-001" : "RO-2024-015",
        status: mockStatus,
        phase: mockPhase,
        
        location: {
          district: from === 'completed' ? "Kathmandu" : "Banke",
          municipality: from === 'completed' ? "Kathmandu Metropolitan" : "Nepalgunj Sub-Metropolitan",
          ward: from === 'completed' ? "Ward 5" : "Ward 5-12",
          province: from === 'completed' ? "Bagmati Province" : "Lumbini Province"
        },
        
        contractor: {
          name: from === 'completed' ? "Himalayan Construction" : "Western Mega Projects Ltd",
          contact: from === 'completed' ? "+977-1-4123456" : "+977-81-526789",
          email: from === 'completed' ? "info@himalayan.com.np" : "info@westernmega.com.np"
        },
        
        budget: {
          totalBudget: from === 'completed' ? 2500000 : 500000000,
          budgetSource: "Federal Government",
          fiscalYear: from === 'completed' ? "2022/2023" : "2023/2024"
        },
        
        schedule: {
          startDate: from === 'completed' ? "2023-01-15" : "2023-08-15",
          plannedEndDate: from === 'completed' ? "2024-01-15" : "2024-11-30",
          estimatedEndDate: from === 'completed' ? "2024-01-10" : "2025-02-15",
          actualEndDate: mockStatus === "Completed" ? "2024-01-10" : null,
          actualProgress: mockProgress
        },
        
        roadDetails: {
          roadType: from === 'completed' ? "Urban Road" : "National Highway",
          totalLength: from === 'completed' ? 2.5 : 15.5,
          roadWidth: 10,
          lanes: from === 'completed' ? 2 : 4
        },
        
        stats: {
          totalRecords: from === 'completed' ? 32 : 24,
          verified: from === 'completed' ? 32 : 18,
          pending: from === 'completed' ? 0 : 5,
          draft: from === 'completed' ? 0 : 1
        }
      };
      
      setProjectData(mockData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching project data:", error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delayed":
        return "bg-red-100 text-red-800";
      case "Ongoing":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPhaseColor = (phase) => {
    if (phase === "Completed") {
      return "bg-green-100 text-green-800";
    }
    return "bg-orange-100 text-orange-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading project details...</div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Failed to load project details</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{projectData.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{projectData.projectId}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(projectData.status)}`}>
              {projectData.status}
            </span>
            <span className={`px-4 py-2 rounded-lg font-semibold ${getPhaseColor(projectData.phase)}`}>
              {projectData.phase}
            </span>
          </div>
        </div>

        {/* Alert for delayed projects */}
        {projectData.status === "Delayed" && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  This project is currently delayed. Please check delay logs for more information.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success alert for completed projects */}
        {projectData.status === "Completed" && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  This project has been completed successfully on {projectData.schedule.actualEndDate}.
                  {projectData.schedule.actualEndDate < projectData.schedule.plannedEndDate && 
                    " Project was completed ahead of schedule!"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Project Progress</span>
            <span className="text-sm font-bold text-gray-900">{projectData.schedule.actualProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                projectData.status === "Completed" 
                  ? "bg-green-500" 
                  : projectData.status === "Delayed" 
                  ? "bg-red-500" 
                  : "bg-blue-500"
              }`}
              style={{ width: `${projectData.schedule.actualProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">TOTAL RECORDS</p>
          <p className="text-2xl font-bold text-gray-900">{projectData.stats.totalRecords}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">VERIFIED</p>
          <p className="text-2xl font-bold text-green-600">{projectData.stats.verified}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">PENDING</p>
          <p className="text-2xl font-bold text-yellow-600">{projectData.stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">DRAFT</p>
          <p className="text-2xl font-bold text-gray-600">{projectData.stats.draft}</p>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">District</p>
              <p className="font-medium text-gray-900">{projectData.location.district}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Municipality</p>
              <p className="font-medium text-gray-900">{projectData.location.municipality}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ward</p>
              <p className="font-medium text-gray-900">{projectData.location.ward}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Province</p>
              <p className="font-medium text-gray-900">{projectData.location.province}</p>
            </div>
          </div>
        </div>

        {/* Contractor Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Contractor Details</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Company Name</p>
              <p className="font-medium text-gray-900">{projectData.contractor.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Number</p>
              <p className="font-medium text-gray-900">{projectData.contractor.contact}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{projectData.contractor.email}</p>
            </div>
          </div>
        </div>

        {/* Budget Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Budget Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Total Budget</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(projectData.budget.totalBudget)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Budget Source</p>
              <p className="font-medium text-gray-900">{projectData.budget.budgetSource}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fiscal Year</p>
              <p className="font-medium text-gray-900">{projectData.budget.fiscalYear}</p>
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Schedule Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium text-gray-900">{projectData.schedule.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Planned End Date</p>
              <p className="font-medium text-gray-900">{projectData.schedule.plannedEndDate}</p>
            </div>
            {projectData.status === "Completed" ? (
              <div>
                <p className="text-sm text-gray-500">Actual Completion Date</p>
                <p className="font-medium text-green-600">{projectData.schedule.actualEndDate}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500">Estimated End Date</p>
                <p className={`font-medium ${projectData.status === 'Delayed' ? 'text-red-600' : 'text-gray-900'}`}>
                  {projectData.schedule.estimatedEndDate}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Road Specifications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Road Specifications</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Road Type</p>
            <p className="font-medium text-gray-900">{projectData.roadDetails.roadType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Length</p>
            <p className="font-medium text-gray-900">{projectData.roadDetails.totalLength} km</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Road Width</p>
            <p className="font-medium text-gray-900">{projectData.roadDetails.roadWidth} m</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Number of Lanes</p>
            <p className="font-medium text-gray-900">{projectData.roadDetails.lanes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}