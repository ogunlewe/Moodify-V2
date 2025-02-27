import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Maximize,
  Minimize,
} from "lucide-react";
import { Song } from "../pages/Home";

interface MusicPlayerWidgetProps {
  currentSong: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onExpand: () => void;
  onMinimize: () => void;
}

const MusicPlayerWidget: React.FC<MusicPlayerWidgetProps> = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onExpand,
  onMinimize,
}) => {
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          if (isPlaying) {
            await audioRef.current.play();
          } else {
            audioRef.current.pause();
          }
        } catch (error) {
          console.error("Audio play failed:", error);
        }
      }
    };

    playAudio();
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const handleEnded = () => {
      onNext();
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleEnded);
      }
    };
  }, [onNext]);

  return (
    <>
      {isWidgetVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 flex items-center justify-between z-20">
          <button
            onClick={onPrev}
            className="text-white hover:text-green-400 transition"
          >
            <SkipBack size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <img
              src={currentSong.cover || "https://via.placeholder.com/150"}
              alt={currentSong.title}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-medium text-white">
                {currentSong.title}
              </h3>
              <p className="text-sm text-gray-400">{currentSong.artist}</p>
            </div>
          </div>
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
          <button
            onClick={() => setIsWidgetVisible(false)}
            className="bg-red-500 text-white p-2 rounded-full"
          >
            <X size={24} />
          </button>
        </div>
      )}
      {!isWidgetVisible && (
        <div className="fixed bottom-4 right-4 bg-gray-900 p-2 rounded-full cursor-pointer z-20">
          <img
            src={currentSong.cover || "https://via.placeholder.com/150"}
            alt={currentSong.title}
            className={`w-12 h-12 rounded-full object-cover ${
              isPlaying ? "animate-spin-slow" : ""
            }`}
            onClick={() => setIsWidgetVisible(true)}
          />
        </div>
      )}
      <audio ref={audioRef} src={currentSong.url} />
    </>
  );
};

export default MusicPlayerWidget;
