import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Calendar, X } from "lucide-react";

export default function ProjectLogs() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchProjectLogs();
  }, [projectId]);

  const fetchProjectLogs = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/projects/${projectId}/logs/`);
      // setLogs(response.data.logs);
      // setProjectName(response.data.projectName);
      
      // Determine if this is a completed project
      const isCompletedProject = projectId.includes('001') || projectId.includes('002');
      
      let mockLogs;
      let mockProjectName;
      
      if (isCompletedProject) {
        // COMPLETED PROJECT - All milestones completed, no ongoing work
        mockProjectName = "Ward Road Improvement Project";
        mockLogs = [
          {
            id: "WL-001",
            weekNumber: "Week 1",
            logDate: "2023-01-20",
            milestone: "Land Acquisition & Clearance",
            weatherConditions: "Sunny, 25°C",
            crewSize: 15,
            equipmentUsed: "Excavator, Roller, Paver",
            workProgressDetail: "Completed land clearing for section A. Removed vegetation and debris. Total area cleared: 2.5 hectares. All land acquisition formalities completed and documented.",
            issuesRisks: "Minor delay due to equipment maintenance resolved. All safety protocols implemented successfully.",
            planForTomorrow: "Completed as planned. Handover to next phase team scheduled.",
            milestoneCompleted: true,
            sitePhotos: [
              "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1590586767908-20d6d1b6db58?w=400&h=300&fit=crop"
            ],
            createdBy: "Site Engineer"
          },
          {
            id: "WL-002",
            weekNumber: "Week 4",
            logDate: "2023-02-15",
            milestone: "Design & Engineering",
            weatherConditions: "Partly cloudy, 23°C",
            crewSize: 12,
            equipmentUsed: "Surveying equipment, AutoCAD stations",
            workProgressDetail: "Final design drawings approved. All engineering calculations verified. Structural design completed and submitted to authorities. Received all necessary approvals.",
            issuesRisks: "All design challenges resolved. No outstanding issues.",
            planForTomorrow: "Design phase completed. Documentation archived.",
            milestoneCompleted: true,
            sitePhotos: [
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop"
            ],
            createdBy: "Design Team Lead"
          },
          {
            id: "WL-003",
            weekNumber: "Week 7",
            logDate: "2023-03-22",
            milestone: "Site Mobilization",
            weatherConditions: "Clear, 27°C",
            crewSize: 25,
            equipmentUsed: "Crane, Concrete mixer, Various construction equipment",
            workProgressDetail: "Site office fully operational. All utilities connected. Safety systems in place. Worker facilities completed. Equipment staging areas prepared. Site mobilization completed successfully.",
            issuesRisks: "All initial setup challenges overcome. Site ready for construction.",
            planForTomorrow: "Mobilization completed. Construction phase initiated.",
            milestoneCompleted: true,
            sitePhotos: [
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop"
            ],
            createdBy: "Site Supervisor"
          },
          {
            id: "WL-004",
            weekNumber: "Week 12",
            logDate: "2023-05-18",
            milestone: "Earthwork & Excavation",
            weatherConditions: "Sunny, 28°C",
            crewSize: 30,
            equipmentUsed: "Excavator (2 units), Bulldozer, Dump trucks (5 units), Compactor",
            workProgressDetail: "All earthwork completed. Total excavation: 8,500 cubic meters. Soil testing passed all requirements. Compaction achieved 98% target. All excavated material properly disposed.",
            issuesRisks: "All groundwork completed without major issues. Quality tests passed.",
            planForTomorrow: "Earthwork milestone completed. Proceeding to next phase.",
            milestoneCompleted: true,
            sitePhotos: [
              "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1590586767908-20d6d1b6db58?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop"
            ],
            createdBy: "Earthwork Coordinator"
          },
          {
            id: "WL-005",
            weekNumber: "Week 18",
            logDate: "2023-07-05",
            milestone: "Drainage Installation",
            weatherConditions: "Clear, 30°C",
            crewSize: 22,
            equipmentUsed: "Pipe layers, Excavator, Concrete pump",
            workProgressDetail: "Complete drainage system installed. All pipes laid and connected. Manholes constructed. System tested and operational. Water flow tests successful. All drainage work completed.",
            issuesRisks: "All drainage installation completed as per design. No pending work.",
            planForTomorrow: "Drainage milestone completed. Moving to pavement work.",
            milestoneCompleted: true,
            sitePhotos: [
              "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1628193726550-31c1f5de6b7d?w=400&h=300&fit=crop"
            ],
            createdBy: "Drainage Specialist"
          },
          {
            id: "WL-006",
            weekNumber: "Week 22",
            logDate: "2023-08-10",
            milestone: "Pavement Base Layer",
            weatherConditions: "Sunny, 29°C",
            crewSize: 28,
            equipmentUsed: "Paver, Roller, Grader, Dump trucks",
            workProgressDetail: "Base layer construction completed for entire road section. Material quality verified. Compaction tests passed. Surface level checked and approved. Ready for surface layer.",
            issuesRisks: "All base layer work completed successfully. Quality standards met.",
            planForTomorrow: "Base layer completed. Surface preparation beginning.",
            milestoneCompleted: true,
            sitePhotos: [
              "https://images.unsplash.com/photo-1599629954294-2c39c1f11c8d?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
            ],
            createdBy: "Pavement Engineer"
          },
          {
            id: "WL-007",
            weekNumber: "Week 26",
            logDate: "2023-09-20",
            milestone: "Surface Layer Application",
            weatherConditions: "Clear, 27°C",
            crewSize: 25,
            equipmentUsed: "Asphalt paver, Compactor, Heating units",
            workProgressDetail: "Asphalt surface layer completed. All sections paved to specification. Temperature monitoring during application successful. Surface smoothness tests passed. Road surface completed.",
            issuesRisks: "All paving completed without issues. Surface quality excellent.",
            planForTomorrow: "Surface layer completed. Road marking phase starting.",
            milestoneCompleted: true,
            sitePhotos: [
              "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop"
            ],
            createdBy: "Paving Supervisor"
          },
          {
            id: "WL-008",
            weekNumber: "Week 30",
            logDate: "2023-10-12",
            milestone: "Road Marking & Signage",
            weatherConditions: "Sunny, 26°C",
            crewSize: 15,
            equipmentUsed: "Line marking machine, Sign installation equipment",
            workProgressDetail: "All road markings completed. Traffic signs installed. Road furniture in place. Safety barriers erected. Lighting systems operational. All finishing work completed successfully.",
            issuesRisks: "All marking and signage completed to standard. No defects noted.",
            planForTomorrow: "Finishing work completed. Final inspection scheduled.",
            milestoneCompleted: true,
            sitePhotos: [
              "https://images.unsplash.com/photo-1587845750802-e0e345f33741?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
            ],
            createdBy: "Finishing Team Lead"
          },
          {
            id: "WL-009",
            weekNumber: "Week 32",
            logDate: "2023-10-25",
            milestone: "Final Inspection & Handover",
            weatherConditions: "Clear, 24°C",
            crewSize: 10,
            equipmentUsed: "Inspection equipment, Documentation tools",
            workProgressDetail: "Final inspection completed by authorities. All quality checks passed. Defect list addressed. Project acceptance certificate received. Handover documentation completed. Project successfully completed.",
            issuesRisks: "All inspections passed. Project completed successfully with no pending issues.",
            planForTomorrow: "Project completed and handed over. Demobilization in progress.",
            milestoneCompleted: true,
            sitePhotos: [
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop"
            ],
            createdBy: "Project Manager"
          }
        ];
      } else {
        // ONGOING/DELAYED PROJECT - Mix of completed and in-progress work
        mockProjectName = "Nepalgunj-Kohalpur Highway Section";
        mockLogs = [
          {
            id: "WL-001",
            weekNumber: "Week 1",
            logDate: "2024-01-12",
            milestone: "Land Acquisition & Clearance",
            weatherConditions: "Sunny, 25°C",
            crewSize: 15,
            equipmentUsed: "Excavator, Roller, Paver",
            workProgressDetail: "Completed land clearing for section A. Removed vegetation and debris. Total area cleared: 2.5 hectares. Site preparation in progress.",
            issuesRisks: "Minor delay due to equipment maintenance. Safety concerns addressed with additional barriers.",
            planForTomorrow: "Begin excavation work in section B. Deploy additional equipment. Conduct safety briefing for new crew members.",
            milestoneCompleted: false,
            sitePhotos: [
              "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1590586767908-20d6d1b6db58?w=400&h=300&fit=crop"
            ],
            createdBy: "Site Engineer"
          },
          {
            id: "WL-002",
            weekNumber: "Week 3",
            logDate: "2024-01-26",
            milestone: "Land Acquisition & Clearance",
            weatherConditions: "Partly cloudy, 23°C",
            crewSize: 18,
            equipmentUsed: "Bulldozer, Excavator, Dump Trucks (3 units)",
            workProgressDetail: "Excavation of section B completed. Soil testing conducted. Foundation groundwork initiated. Total excavation: 3,500 cubic meters. Milestone achieved.",
            issuesRisks: "Unexpected water table encountered at depth of 4m. Pumping equipment deployed and issue resolved.",
            planForTomorrow: "Start next milestone activities. Prepare equipment for foundation work.",
            milestoneCompleted: true,
            sitePhotos: [
              "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop"
            ],
            createdBy: "Project Manager"
          },
          {
            id: "WL-003",
            weekNumber: "Week 5",
            logDate: "2024-02-09",
            milestone: "Bridge Foundation",
            weatherConditions: "Rainy, 20°C - work suspended on Day 3",
            crewSize: 22,
            equipmentUsed: "Pile driver, Concrete mixer, Reinforcement tools",
            workProgressDetail: "Bridge foundation work in progress. Pile driving completed for piers 1-3. Concrete pouring scheduled for next week. Weather causing minor delays.",
            issuesRisks: "Rain caused 1-day work suspension. Additional waterproofing measures required. Schedule adjusted.",
            planForTomorrow: "Continue pile driving for remaining piers. Monitor weather conditions. Prepare for concrete work.",
            milestoneCompleted: false,
            sitePhotos: [
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1628193726550-31c1f5de6b7d?w=400&h=300&fit=crop"
            ],
            createdBy: "Bridge Engineer"
          },
          {
            id: "WL-004",
            weekNumber: "Week 8",
            logDate: "2024-03-01",
            milestone: "Bridge Foundation",
            weatherConditions: "Clear, 27°C",
            crewSize: 25,
            equipmentUsed: "Crane, Concrete mixer, Vibrator units",
            workProgressDetail: "All bridge foundations completed. Quality tests conducted and passed. Pier caps constructed. Ready for superstructure work. Foundation milestone achieved ahead of schedule.",
            issuesRisks: "All foundation work completed successfully. No pending issues.",
            planForTomorrow: "Begin bridge superstructure work. Mobilize steel erection team.",
            milestoneCompleted: true,
            sitePhotos: [
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400&h=300&fit=crop"
            ],
            createdBy: "Site Supervisor"
          },
          {
            id: "WL-005",
            weekNumber: "Week 12",
            logDate: "2024-03-29",
            milestone: "Bridge Superstructure",
            weatherConditions: "Sunny, 28°C",
            crewSize: 30,
            equipmentUsed: "Tower crane, Welding equipment, Lifting gear",
            workProgressDetail: "Superstructure work ongoing. Steel girders erected for span 1 and 2. Deck slab formwork in progress. 60% of superstructure completed. Work progressing as per revised schedule.",
            issuesRisks: "Material delivery delayed by 3 days. Alternative suppliers arranged. Minor adjustment to schedule required.",
            planForTomorrow: "Continue girder erection for span 3. Complete deck slab formwork for span 1. Schedule concrete pour.",
            milestoneCompleted: false,
            sitePhotos: [
              "https://images.unsplash.com/photo-1590586767908-20d6d1b6db58?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1599629954294-2c39c1f11c8d?w=400&h=300&fit=crop"
            ],
            createdBy: "Structural Engineer"
          }
        ];
      }

      setLogs(mockLogs);
      setProjectName(mockProjectName);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching project logs:", error);
      setLoading(false);
    }
  };

  const handleViewLog = (log) => {
    setSelectedLog(log);
    setShowViewModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading project logs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Weekly Project Logs</h2>
          <p className="text-sm text-gray-500 mt-1">{projectName} - {logs.length} weekly logs</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">TOTAL LOGS</p>
          <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">MILESTONES COMPLETED</p>
          <p className="text-2xl font-bold text-green-600">
            {logs.filter(l => l.milestoneCompleted).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">IN PROGRESS</p>
          <p className="text-2xl font-bold text-blue-600">
            {logs.filter(l => !l.milestoneCompleted).length}
          </p>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-200">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Log Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">{log.weekNumber}</h3>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{formatDate(log.logDate)}</span>
                    {log.milestoneCompleted && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                        Milestone Completed
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-700 font-medium mb-2 ml-8">
                    Milestone: {log.milestone}
                  </p>
                  
                  <div className="text-sm text-gray-600 ml-8 space-y-1">
                    <p><span className="font-medium">Weather:</span> {log.weatherConditions}</p>
                    <p><span className="font-medium">Crew Size:</span> {log.crewSize} workers</p>
                    <p className="line-clamp-2">{log.workProgressDetail}</p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleViewLog(log)}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedLog.weekNumber} - Log Details</h2>
                <p className="text-sm text-gray-500">{formatDate(selectedLog.logDate)}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Log Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Log Date</label>
                <p className="text-gray-900">{formatDate(selectedLog.logDate)}</p>
              </div>

              {/* Project Milestone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Milestone</label>
                <p className="text-gray-900">{selectedLog.milestone}</p>
              </div>

              {/* Weather Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weather Conditions</label>
                <p className="text-gray-900">{selectedLog.weatherConditions}</p>
              </div>

              {/* Crew Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crew Size</label>
                <p className="text-gray-900">{selectedLog.crewSize} workers</p>
              </div>

              {/* Equipment Used */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Used</label>
                <p className="text-gray-900">{selectedLog.equipmentUsed}</p>
              </div>

              {/* Work Progress Detail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Progress Detail</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedLog.workProgressDetail}</p>
              </div>

              {/* Issues & Risks Encountered */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issues & Risks Encountered</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedLog.issuesRisks}</p>
              </div>

              {/* Plan for Tomorrow */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan for Tomorrow</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedLog.planForTomorrow}</p>
              </div>

              {/* Site Evidence / Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Evidence / Photos</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedLog.sitePhotos.map((photo, idx) => (
                    <div key={idx} className="aspect-video rounded-lg overflow-hidden border">
                      <img 
                        src={photo} 
                        alt={`Site photo ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => window.open(photo, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Completed */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedLog.milestoneCompleted}
                    disabled
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Has Milestone 1 completed?</span>
                </label>
              </div>

              {/* Created By */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Created by: <span className="font-medium text-gray-900">{selectedLog.createdBy}</span>
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {logs.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Logs Available
          </h3>
          <p className="text-gray-500">
            There are no weekly logs available for this project.
          </p>
        </div>
      )}
    </div>
  );
}