import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Upload, Music, User, ListMusic } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-leaf-green text-white p-2 rounded"
        onClick={toggleSidebar}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full bg-gray-900 w-64 p-5 flex flex-col justify-between 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        {/* Navigation Links */}
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="flex items-center space-x-3 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition duration-200"
              onClick={toggleSidebar}
            >
              <Home size={24} className="text-leaf-green" />
              <span className="text-lg font-medium">Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/upload"
              className="flex items-center space-x-3 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition duration-200"
              onClick={toggleSidebar}
            >
              <Upload size={24} className="text-leaf-green" />
              <span className="text-lg font-medium">Upload</span>
            </Link>
          </li>
          <li>
            <Link
              to="/songs"
              className="flex items-center space-x-3 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition duration-200"
              onClick={toggleSidebar}
            >
              <Music size={24} className="text-leaf-green" />
              <span className="text-lg font-medium">Songs</span>
            </Link>
          </li>
          <li>
            <Link
              to="/playlists"
              className="flex items-center space-x-3 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition duration-200"
              onClick={toggleSidebar}
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
            onClick={toggleSidebar}
          >
            <User size={24} className="text-leaf-green" />
            <span className="text-lg font-medium">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Overlay for Mobile Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Navbar;