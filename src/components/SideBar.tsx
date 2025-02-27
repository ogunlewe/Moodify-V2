import React from "react";
import { Link } from "react-router-dom";
import { Home, Upload, Music, User, ListMusic } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 h-full bg-gray-900 w-64 p-5 flex flex-col justify-between hidden md:flex">
      {/* Navigation Links */}
      <ul className="space-y-2">
        <li>
          <Link
            to="/"
            className="flex items-center space-x-3 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition duration-200"
          >
            <Home size={24} className="text-leaf-green" />
            <span className="text-lg font-medium">Home</span>
          </Link>
        </li>
        <li>
          <Link
            to="/upload"
            className="flex items-center space-x-3 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition duration-200"
          >
            <Upload size={24} className="text-leaf-green" />
            <span className="text-lg font-medium">Upload</span>
          </Link>
        </li>
        <li>
          <Link
            to="/songs"
            className="flex items-center space-x-3 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition duration-200"
          >
            <Music size={24} className="text-leaf-green" />
            <span className="text-lg font-medium">Songs</span>
          </Link>
        </li>
        <li>
          <Link
            to="/playlists"
            className="flex items-center space-x-3 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition duration-200"
          >
            <ListMusic size={24} className="text-leaf-green" />
            <span className="text-lg font-medium">Playlists</span>
          </Link>
        </li>
      </ul>

      {/* Profile Button at the Bottom */}
      <div className="mt-auto pb-6">
        <Link
          to="/profile"
          className="flex items-center space-x-3 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition duration-200"
        >
          <User size={24} className="text-leaf-green" />
          <span className="text-lg font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
