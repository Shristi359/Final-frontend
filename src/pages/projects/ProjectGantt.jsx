import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ProjectGantt() {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGanttData();
  }, [projectId]);

  const fetchGanttData = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/projects/${projectId}/milestones/`);
      // setProjectData(response.data);
      // setMilestones(response.data.milestones);
      
      // Mock data - Different data based on project ID to demonstrate differences
      const isCompletedProject = projectId.includes('001') || projectId.includes('002');
      const isDelayedProject = projectId.includes('015');
      
      let mockData;
      
      if (isCompletedProject) {
        // COMPLETED PROJECT - All milestones done, some ahead of schedule
        mockData = {
          projectName: "Ward Road Improvement Project",
          status: "COMPLETED",
          overallProgress: 100,
          stats: {
            onTime: 8,
            delayed: 1,
            ahead: 3
          },
          milestones: [
            {
              id: 1,
              name: "Land Acquisition & Clearance",
              startDate: "2023-01-15",
              endDate: "2023-02-25",
              plannedStart: "2023-01-15",
              plannedEnd: "2023-02-28",
              actualProgress: 100,
              status: "AHEAD"
            },
            {
              id: 2,
              name: "Design & Engineering",
              startDate: "2023-02-01",
              endDate: "2023-03-15",
              plannedStart: "2023-02-01",
              plannedEnd: "2023-03-15",
              actualProgress: 100,
              status: "COMPLETED"
            },
            {
              id: 3,
              name: "Site Mobilization",
              startDate: "2023-03-01",
              endDate: "2023-03-28",
              plannedStart: "2023-03-01",
              plannedEnd: "2023-04-01",
              actualProgress: 100,
              status: "AHEAD"
            },
            {
              id: 4,
              name: "Earthwork & Excavation",
              startDate: "2023-04-01",
              endDate: "2023-05-30",
              plannedStart: "2023-04-01",
              plannedEnd: "2023-05-30",
              actualProgress: 100,
              status: "COMPLETED"
            },
            {
              id: 5,
              name: "Drainage Installation",
              startDate: "2023-05-15",
              endDate: "2023-07-10",
              plannedStart: "2023-05-15",
              plannedEnd: "2023-07-10",
              actualProgress: 100,
              status: "COMPLETED"
            },
            {
              id: 6,
              name: "Pavement Base Layer",
              startDate: "2023-07-01",
              endDate: "2023-08-20",
              plannedStart: "2023-07-01",
              plannedEnd: "2023-08-20",
              actualProgress: 100,
              status: "COMPLETED"
            },
            {
              id: 7,
              name: "Surface Layer Application",
              startDate: "2023-08-15",
              endDate: "2023-09-25",
              plannedStart: "2023-08-15",
              plannedEnd: "2023-10-05",
              actualProgress: 100,
              status: "AHEAD"
            },
            {
              id: 8,
              name: "Road Marking & Signage",
              startDate: "2023-09-20",
              endDate: "2023-10-15",
              plannedStart: "2023-09-20",
              plannedEnd: "2023-10-15",
              actualProgress: 100,
              status: "COMPLETED"
            },
            {
              id: 9,
              name: "Final Inspection",
              startDate: "2023-10-10",
              endDate: "2023-10-25",
              plannedStart: "2023-10-10",
              plannedEnd: "2023-10-20",
              actualProgress: 100,
              status: "DELAYED"
            },
            {
              id: 10,
              name: "Project Handover",
              startDate: "2023-10-25",
              endDate: "2024-01-10",
              plannedStart: "2023-10-25",
              plannedEnd: "2024-01-10",
              actualProgress: 100,
              status: "COMPLETED"
            }
          ]
        };
      } else if (isDelayedProject) {
        // DELAYED PROJECT - Some milestones incomplete, multiple delays
        mockData = {
          projectName: "Nepalgunj-Kohalpur Highway Section",
          status: "DELAYED",
          overallProgress: 52,
          stats: {
            onTime: 3,
            delayed: 4,
            ahead: 0
          },
          milestones: [
            {
              id: 1,
              name: "Land Acquisition & Clearance",
              startDate: "2023-08-15",
              endDate: "2023-10-20",
              plannedStart: "2023-08-15",
              plannedEnd: "2023-09-30",
              actualProgress: 100,
              status: "DELAYED"
            },
            {
              id: 2,
              name: "Design & Engineering",
              startDate: "2023-09-01",
              endDate: "2023-11-15",
              plannedStart: "2023-09-01",
              plannedEnd: "2023-10-15",
              actualProgress: 100,
              status: "DELAYED"
            },
            {
              id: 3,
              name: "Site Mobilization",
              startDate: "2023-10-15",
              endDate: "2023-11-30",
              plannedStart: "2023-10-15",
              plannedEnd: "2023-11-30",
              actualProgress: 100,
              status: "COMPLETED"
            },
            {
              id: 4,
              name: "Earthwork & Excavation",
              startDate: "2023-12-01",
              endDate: "2024-03-15",
              plannedStart: "2023-12-01",
              plannedEnd: "2024-02-15",
              actualProgress: 100,
              status: "DELAYED"
            },
            {
              id: 5,
              name: "Bridge Foundation",
              startDate: "2024-02-01",
              endDate: "2024-04-30",
              plannedStart: "2024-02-01",
              plannedEnd: "2024-04-30",
              actualProgress: 100,
              status: "COMPLETED"
            },
            {
              id: 6,
              name: "Bridge Superstructure",
              startDate: "2024-04-15",
              endDate: "2024-07-20",
              plannedStart: "2024-04-15",
              plannedEnd: "2024-06-30",
              actualProgress: 100,
              status: "DELAYED"
            },
            {
              id: 7,
              name: "Pavement Base Layer",
              startDate: "2024-07-01",
              endDate: "2024-09-30",
              plannedStart: "2024-07-01",
              plannedEnd: "2024-09-30",
              actualProgress: 100,
              status: "COMPLETED"
            },
            {
              id: 8,
              name: "Surface Layer Application",
              startDate: "2024-10-01",
              endDate: "2025-02-14",
              plannedStart: "2024-10-01",
              plannedEnd: "2024-11-30",
              actualProgress: 35,
              status: "ONGOING"
            },
            {
              id: 9,
              name: "Road Furniture Installation",
              startDate: "2024-12-01",
              endDate: "2025-02-14",
              plannedStart: "2024-12-01",
              plannedEnd: "2024-12-31",
              actualProgress: 20,
              status: "ONGOING"
            },
            {
              id: 10,
              name: "Final Testing & QA",
              startDate: "2025-01-15",
              endDate: "2025-02-14",
              plannedStart: "2025-01-15",
              plannedEnd: "2025-01-25",
              actualProgress: 0,
              status: "PENDING"
            }
          ]
        };
      } else {
        // ONGOING PROJECT - Mix of completed and ongoing
        mockData = {
          projectName: "Highway Expansion Project",
          status: "ONGOING",
          overallProgress: 65,
          stats: {
            onTime: 4,
            delayed: 2,
            ahead: 1
          },
          milestones: [
            {
              id: 1,
              name: "Initial Survey",
              startDate: "2024-01-01",
              endDate: "2024-02-15",
              plannedStart: "2024-01-01",
              plannedEnd: "2024-02-15",
              actualProgress: 100,
              status: "COMPLETED"
            },
            {
              id: 2,
              name: "Land Clearance",
              startDate: "2024-02-10",
              endDate: "2024-03-20",
              plannedStart: "2024-02-10",
              plannedEnd: "2024-03-30",
              actualProgress: 100,
              status: "AHEAD"
            },
            {
              id: 3,
              name: "Foundation Work",
              startDate: "2024-03-15",
              endDate: "2024-05-10",
              plannedStart: "2024-03-15",
              plannedEnd: "2024-05-10",
              actualProgress: 100,
              status: "COMPLETED"
            },
            {
              id: 4,
              name: "Structural Construction",
              startDate: "2024-05-05",
              endDate: "2024-08-25",
              plannedStart: "2024-05-05",
              plannedEnd: "2024-07-30",
              actualProgress: 100,
              status: "DELAYED"
            },
            {
              id: 5,
              name: "Roadway Paving",
              startDate: "2024-08-15",
              endDate: "2024-11-30",
              plannedStart: "2024-08-15",
              plannedEnd: "2024-11-30",
              actualProgress: 100,
              status: "COMPLETED"
            },
            {
              id: 6,
              name: "Drainage Systems",
              startDate: "2024-11-01",
              endDate: "2025-01-20",
              plannedStart: "2024-11-01",
              plannedEnd: "2024-12-31",
              actualProgress: 75,
              status: "ONGOING"
            },
            {
              id: 7,
              name: "Safety Features",
              startDate: "2025-01-05",
              endDate: "2025-02-14",
              plannedStart: "2025-01-05",
              plannedEnd: "2025-02-20",
              actualProgress: 40,
              status: "ONGOING"
            },
            {
              id: 8,
              name: "Final Inspection",
              startDate: "2025-02-15",
              endDate: "2025-03-15",
              plannedStart: "2025-02-15",
              plannedEnd: "2025-03-15",
              actualProgress: 0,
              status: "PENDING"
            }
          ]
        };
      }

      setProjectData(mockData);
      setMilestones(mockData.milestones);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gantt data:", error);
      setLoading(false);
    }
  };

  // Generate month columns for the timeline based on actual project dates
  const generateMonths = () => {
    if (!milestones || milestones.length === 0) {
      // Default timeline if no milestones
      const months = [];
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2025-02-01");
      
      let current = new Date(startDate);
      while (current <= endDate) {
        months.push({
          label: current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          date: new Date(current)
        });
        current.setMonth(current.getMonth() + 1);
      }
      return months;
    }

    // Find earliest and latest dates from milestones
    const allDates = milestones.flatMap(m => [
      new Date(m.plannedStart),
      new Date(m.plannedEnd),
      new Date(m.startDate),
      new Date(m.endDate)
    ]);
    
    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));
    
    // Add buffer months
    minDate.setMonth(minDate.getMonth() - 1);
    maxDate.setMonth(maxDate.getMonth() + 1);
    
    // Set to first of month
    const startDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const endDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    
    const months = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      months.push({
        label: current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        date: new Date(current)
      });
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  };

  const months = generateMonths();
  
  // Get timeline boundaries for bar positioning
  const getTimelineBounds = () => {
    if (months.length === 0) {
      return {
        start: new Date("2024-01-01"),
        end: new Date("2025-02-01")
      };
    }
    return {
      start: months[0].date,
      end: new Date(months[months.length - 1].date.getFullYear(), months[months.length - 1].date.getMonth() + 1, 0)
    };
  };

  // Calculate position and width for timeline bars
  const calculateBarPosition = (startDate, endDate) => {
    const { start: timelineStart, end: timelineEnd } = getTimelineBounds();
    const totalDays = (timelineEnd - timelineStart) / (1000 * 60 * 60 * 24);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startOffset = ((start - timelineStart) / (1000 * 60 * 60 * 24)) / totalDays * 100;
    const duration = ((end - start) / (1000 * 60 * 60 * 24)) / totalDays * 100;
    
    return { left: `${Math.max(0, startOffset)}%`, width: `${Math.max(0.5, duration)}%` };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500";
      case "DELAYED":
        return "bg-red-500";
      case "AHEAD":
        return "bg-blue-500";
      case "ONGOING":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "COMPLETED":
        return "COMPLETED";
      case "DELAYED":
        return "DELAYED";
      case "AHEAD":
        return "AHEAD";
      case "ONGOING":
        return "ONGOING";
      default:
        return "PENDING";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading Gantt chart...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Status Badge */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{projectData.projectName}</h3>
            <p className="text-sm text-gray-500">Project Timeline Overview</p>
          </div>
          <span className={`px-4 py-2 rounded-lg font-semibold ${
            projectData.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
            projectData.status === 'DELAYED' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {projectData.status}
          </span>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">OVERALL PROGRESS</p>
          <p className="text-2xl font-bold text-gray-900">{projectData.overallProgress}%</p>
          <p className="text-xs text-gray-400 mt-1">of total project scope</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">ON TIME</p>
          <p className="text-2xl font-bold text-green-600">{projectData.stats.onTime}</p>
          <p className="text-xs text-gray-400 mt-1">milestones completed on time</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">DELAYED</p>
          <p className="text-2xl font-bold text-red-600">{projectData.stats.delayed}</p>
          <p className="text-xs text-gray-400 mt-1">milestones behind schedule</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">AHEAD</p>
          <p className="text-2xl font-bold text-blue-600">{projectData.stats.ahead}</p>
          <p className="text-xs text-gray-400 mt-1">milestones ahead of schedule</p>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend:</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Executed Timeline (Completed)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Ahead (Ahead of Time)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Actual Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-600">Actual (Ongoing)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Today</span>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Project Milestones</h3>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Timeline Header */}
            <div className="flex border-b bg-gray-50">
              <div className="w-80 p-3 border-r">
                <span className="text-sm font-semibold text-gray-700">Milestone</span>
              </div>
              <div className="flex-1 flex">
                {months.map((month, idx) => (
                  <div key={idx} className="flex-1 p-3 text-center border-r last:border-r-0">
                    <span className="text-xs font-medium text-gray-600">{month.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            {milestones.map((milestone) => (
              <div key={milestone.id} className="flex border-b hover:bg-gray-50">
                {/* Milestone Info */}
                <div className="w-80 p-3 border-r">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">{milestone.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(milestone.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                        {new Date(milestone.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-medium ml-2 ${
                      milestone.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      milestone.status === 'DELAYED' ? 'bg-red-100 text-red-800' :
                      milestone.status === 'AHEAD' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getStatusLabel(milestone.status)}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 relative p-3">
                  {/* Planned timeline (light gray background) */}
                  <div 
                    className="absolute h-6 bg-gray-200 rounded"
                    style={calculateBarPosition(milestone.plannedStart, milestone.plannedEnd)}
                  ></div>
                  
                  {/* Actual timeline (colored bar) */}
                  <div 
                    className={`absolute h-6 rounded ${getStatusColor(milestone.status)} opacity-90`}
                    style={calculateBarPosition(milestone.startDate, milestone.endDate)}
                  >
                    <div className="h-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium px-2">
                        {milestone.actualProgress}%
                      </span>
                    </div>
                  </div>

                  {/* Today indicator (if applicable) */}
                  {projectData.status !== "COMPLETED" && 
                   new Date() >= new Date(milestone.startDate) && 
                   new Date() <= new Date(milestone.endDate) && (
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-green-600 z-10"
                      style={{ 
                        left: (() => {
                          const { start: timelineStart, end: timelineEnd } = getTimelineBounds();
                          const totalDays = (timelineEnd - timelineStart) / (1000 * 60 * 60 * 24);
                          const today = new Date();
                          const todayOffset = ((today - timelineStart) / (1000 * 60 * 60 * 24)) / totalDays * 100;
                          return `${todayOffset}%`;
                        })()
                      }}
                    >
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}