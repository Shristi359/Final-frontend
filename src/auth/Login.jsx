import { Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlagNepal from "../assets/Flag-Nepal.gif";
import EmblemNepal from "../assets/Emblem_of_Nepal.png";
import KmcLogo from "../assets/kmc_logo.png";
import map from "../assets/map16.jpg";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔐 TEMP LOGIN (replace with Django API later)
    if (email && password) {
      navigate("/app/dashboard");
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#062A4D] px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex overflow-hidden">

        {/* LEFT PANEL */}
        <div className="hidden md:flex w-1/2 bg-[#EAF6FD] items-center justify-center p-6">
          <img
            src={map}
            alt="Ward Map"
            className="max-w-full max-h-[90%] object-contain"
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-10 py-12">

          {/* LOGOS */}
          <div className="flex justify-center gap-6 mb-10">
            <img src={EmblemNepal} alt="Logo 1" className="h-12 object-contain" />
            <img src={KmcLogo} alt="Logo 2" className="h-12 object-contain" />
            <img src={FlagNepal} alt="Logo 3" className="h-12 object-contain" />
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="text-xs text-gray-500">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-[#1F4E79] py-2 text-sm"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <label className="text-xs text-gray-500">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-[#1F4E79] py-2 pr-8 text-sm"
              />
              <Eye
                size={16}
                className="absolute right-1 bottom-2 text-gray-400"
              />
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <button
                type="button"
                className="text-xs text-[#1F4E79] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#F4B000] hover:bg-[#e2a500] text-black py-2 rounded-md shadow font-medium transition"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
