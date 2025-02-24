import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Minimize } from 'lucide-react';


interface Song {
    id: string;
    cover: string;
    title: string;
    artist: string;
}

interface FullPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onMinimize: () => void;
  onRemoveFromQueue: (songId: string) => void;
}

const FullPlayer: React.FC<FullPlayerProps> = ({
  currentSong,
  isPlaying,
  queue,
  onPlayPause,
  onNext,
  onPrev,
  onMinimize,
  onRemoveFromQueue,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 bg-gray-900 p-4 shadow-lg flex flex-col">
      {currentSong ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500">
                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className={`w-full h-full object-cover ${
                    isPlaying ? "animate-spin-slow" : ""
                  }`}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium">{currentSong.title}</h3>
                <p className="text-sm text-gray-400">{currentSong.artist}</p>
              </div>
            </div>
            <button onClick={onMinimize} className="text-white hover:text-green-400 transition">
              <Minimize size={24} />
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <button onClick={onPrev} className="text-white hover:text-green-400 transition">
              <SkipBack size={24} />
            </button>
            <button onClick={onPlayPause} className="text-white hover:text-green-400 transition">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={onNext} className="text-white hover:text-green-400 transition">
              <SkipForward size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-medium mb-2">Queue</h4>
            {queue.length > 0 ? (
              queue.map((song) => (
                <div key={song.id} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500">
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">{song.title}</h5>
                      <p className="text-xs text-gray-400">{song.artist}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveFromQueue(song.id)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No songs in queue</p>
            )}
          </div>
        </>
      ) : (
        <div className="w-full text-center text-gray-500">No song playing</div>
      )}
    </div>
  );
};

export default FullPlayer;