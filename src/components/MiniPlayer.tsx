import React from "react";
import { Play, Pause, SkipBack, SkipForward, Maximize } from "lucide-react";

interface Song {
  cover: string;
  title: string;
  artist: string;
}

interface MiniPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onExpand: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onExpand,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 shadow-lg flex items-center justify-between z-20">
      {currentSong ? (
        <>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500">
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className={`w-full h-full object-cover ${
                  isPlaying ? "animate-spin-slow" : ""
                }`}
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">
                {currentSong.title}
              </h3>
              <p className="text-sm text-gray-400">{currentSong.artist}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onPrev}
              className="text-white hover:text-green-400 transition"
            >
              <SkipBack size={24} />
            </button>
            <button
              onClick={onPlayPause}
              className="text-white hover:text-green-400 transition"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={onNext}
              className="text-white hover:text-green-400 transition"
            >
              <SkipForward size={24} />
            </button>
            <button
              onClick={onExpand}
              className="text-white hover:text-green-400 transition"
            >
              <Maximize size={24} />
            </button>
          </div>
        </>
      ) : (
        <div className="w-full text-center text-gray-500">No song playing</div>
      )}
    </div>
  );
};

export default MiniPlayer;
