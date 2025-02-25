import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';
import { Song } from '../pages/Home';

interface MusicPlayerWidgetProps {
  currentSong: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const MusicPlayerWidget: React.FC<MusicPlayerWidgetProps> = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
}) => {
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Audio play failed:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const handleEnded = () => {
      onNext();
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [onNext]);

  return (
    <>
      {isWidgetVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 flex items-center justify-between">
          <button onClick={onPrev}>Prev</button>
          <div>
            <h3>{currentSong.title}</h3>
            <p>{currentSong.artist}</p>
          </div>
          <button onClick={onPlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
          <button onClick={onNext}>Next</button>
          <button
            onClick={() => setIsWidgetVisible(false)}
            className="bg-red-500 text-white p-2 rounded-full"
          >
            <X size={24} />
          </button>
        </div>
      )}
      {!isWidgetVisible && (
        <div className="fixed bottom-4 right-4 bg-gray-900 p-2 rounded-full cursor-pointer">
          <img
            src={currentSong.cover || "https://via.placeholder.com/150"}
            alt={currentSong.title}
            className={`w-12 h-12 rounded-full object-cover ${isPlaying ? "animate-spin-slow" : ""}`}
            onClick={() => setIsWidgetVisible(true)}
          />
        </div>
      )}
      <audio ref={audioRef} src={currentSong.url} />
    </>
  );
};

export default MusicPlayerWidget;