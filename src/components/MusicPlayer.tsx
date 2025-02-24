import React, { useRef, useEffect } from 'react';
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
    if (audioRef.current) {
      if (isPlaying && currentSong?.id === id) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong, id]);

  const handlePlayPause = async () => {
    togglePlay({ id, url, title, artist });

    if (!isPlaying) {
      // Increment play count in Firestore
      const songRef = doc(db, 'songs', id);
      await updateDoc(songRef, {
        playCount: increment(1),
      });
    }
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <button onClick={handlePlayPause} className="bg-green-500 text-white p-2 rounded-full">
        {isPlaying && currentSong?.id === id ? 'Pause' : 'Play'}
      </button>
      <LikeButton songId={id} />
      <audio ref={audioRef} src={url} />
    </div>
  );
};

export default MusicPlayer;