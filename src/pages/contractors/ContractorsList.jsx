import { Plus, Phone, Mail, MapPin, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ContractorsList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">

      {/* TOP SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <button
          onClick={() => navigate("/app/contractors/add")}
          className="flex items-center gap-2 bg-[#1F4E79] hover:bg-[#163a5a] text-white px-6 py-3 rounded-xl shadow transition"
        >
          <Plus size={18} />
          Add Contractor
        </button>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xl font-semibold text-blue-600">6</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-green-600">4</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-600">1</p>
            <p className="text-xs text-gray-500">Inactive</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-orange-500">1</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
        </div>

      </div>

      {/* CONTRACTOR CARD */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">

        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              Himalayan Construction Pvt. Ltd.
            </h2>
            <p className="text-sm text-gray-500">
              Contact: Rajesh Sharma
            </p>
          </div>

          <span className="bg-green-100 text-green-600 px-4 py-1 text-sm rounded-full">
            Active
          </span>
        </div>

        {/* DETAILS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">

          <div className="flex items-center gap-2">
            <Phone size={16} />
            +977 9851234567
          </div>

          <div className="flex items-center gap-2">
            <Mail size={16} />
            info@himalayanconst.com
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} />
            Kathmandu
          </div>

          <div className="flex items-center gap-2">
            <Building2 size={16} />
            Road Construction
          </div>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-xl p-6 text-center">
            <p className="text-2xl font-bold text-blue-600">3</p>
            <p className="text-sm text-gray-500">Active Projects</p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 text-center">
            <p className="text-2xl font-bold text-green-600">12</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition">
          View Details
        </button>

      </div>

    </div>
  );
}
