import React from "react";
import { Link } from "react-router-dom";
import { Home, Upload, Music, User } from "lucide-react";

const BottomNavBar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 flex justify-around md:hidden z-10">
      <Link to="/" className="text-white hover:text-green-400 transition">
        <Home size={24} />
      </Link>
      <Link to="/upload" className="text-white hover:text-green-400 transition">
        <Upload size={24} />
      </Link>
      <Link to="/songs" className="text-white hover:text-green-400 transition">
        <Music size={24} />
      </Link>
      <Link to="/profile" className="text-white hover:text-green-400 transition">
        <User size={24} />
      </Link>
    </nav>
  );
};

export default BottomNavBar;