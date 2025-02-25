import React, { useEffect, useRef } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import LikeButton from './LikeButton';

interface MusicPlayerProps {
  id: string;
  url: string;
  title: string;
  artist: string;
  currentSong: any;
  isPlaying: boolean;
  togglePlay: (song: any) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ id, url, title, artist, currentSong, isPlaying, togglePlay }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        if (isPlaying && currentSong?.id === id) {
          try {
            await audioRef.current.play();
          } catch (error) {
            console.error("Audio play failed:", error);
          }
        } else {
          audioRef.current.pause();
        }
      }
    };
    playAudio();
  }, [isPlaying, currentSong, id]);

  const handlePlayPause = async () => {
    togglePlay({ id, url, title, artist });
    if (!isPlaying) {
      const songRef = doc(db, 'songs', id);
      try {
        await updateDoc(songRef, { playCount: increment(1) });
      } catch (error) {
        console.error("Failed to update play count:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <button onClick={handlePlayPause} className="bg-green-500 text-white p-2 rounded-full">
        {isPlaying && currentSong?.id === id ? 'Pause' : 'Play'}
      </button>
      <LikeButton songId={id} />
      <audio ref={audioRef} src={url} controls style={{ display: 'none' }} key={id} />
    </div>
  );
};

export default MusicPlayer;