import {
  AlertTriangle,
  CheckCircle,
  Loader,
  Clock,
  XCircle,
} from "lucide-react";

import ExpenseBreakdown from "../components/charts/ExpenseBreakdown";
import BudgetStatus from "../components/charts/BudgetStatus";
import CalendarWidget from "../components/CalendarWidget";


export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* ALERT */}
      <div className="bg-red-500 text-white px-6 py-3 rounded flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <AlertTriangle size={18} />
          <span>
            URGENT: Missing Delay Documentation (3 delayed projects without delay logs)
          </span>
        </div>
        <button className="bg-white text-red-500 px-4 py-1 text-sm rounded">
          View Projects →
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Completed Projects"
          value="12"
          icon={<CheckCircle />}
          color="bg-blue-100"
        />
        <StatCard
          title="Ongoing Projects"
          value="12"
          icon={<Loader />}
          color="bg-yellow-200"
        />
        <StatCard
          title="Delayed Projects"
          value="12"
          icon={<Clock />}
          badge="3 missing delay logs"
          color="bg-purple-200"
        />
        <StatCard
          title="Cancelled Projects"
          value="12"
          icon={<XCircle />}
          color="bg-red-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ExpenseBreakdown />
          {/* All Projects section stays here */}
        </div>

        <div className="space-y-6">
          <BudgetStatus />
          <CalendarWidget />
        </div>
      </div>



      {/* PROJECT LIST */}
      <div className="bg-white p-4 rounded border">
        <h3 className="font-semibold mb-3">All Projects (36)</h3>
        <p className="text-sm text-gray-500">
          Project cards will appear here.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, badge }) {
  return (
    <div className={`p-4 rounded ${color} relative`}>
      <div className="flex items-center justify-between">
        <p className="text-sm">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-semibold mt-2">{value}</p>
      {badge && (
        <span className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
          {badge}
        </span>
      )}
    </div>
  );
}
