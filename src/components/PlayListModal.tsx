import React from "react";

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          onClick={onClose}
        >
          &#10005;
        </button>
        {children}
      </div>
    </div>
  );
};

export default PlaylistModal;
