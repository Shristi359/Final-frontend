import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 border-b">
      {/* Left */}
      <h1 className="text-lg font-semibold">
        Welcome Back <span>👋</span>
      </h1>

      {/* Center */}
      <div className="flex items-center bg-gray-200 rounded-lg px-3 py-2 w-96">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none px-2 text-sm w-full"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Bell size={20} />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
          <div className="text-sm">
            <p className="font-medium">Shristi Shakya</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
