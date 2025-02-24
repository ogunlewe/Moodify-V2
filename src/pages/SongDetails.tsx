import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import MusicPlayer from '../components/MusicPlayer';
import Comments from '../components/Comments';

interface Song {
  id: string;
  title: string;
  artist: string;
  mood: string;
  url: string;
}

const SongDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchSong = async () => {
      if (!id) {
        setError('Invalid song ID');
        return;
      }

      try {
        const docRef = doc(db, 'songs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSong({ id: docSnap.id, ...docSnap.data() } as Song);
        } else {
          setError('Song not found');
        }
      } catch (err) {
        console.error('Error fetching song details:', err);
        setError('Failed to fetch song details');
      }
    };

    fetchSong();
  }, [id]);

  const togglePlay = (song: Song) => {
    if (currentSong && currentSong.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!song) {
    return <div>Loading song details...</div>;
  }

  return (
    <div>
      <h1>Song Details</h1>
      <MusicPlayer
        id={song.id}
        url={song.url}
        title={song.title}
        artist={song.artist}
        currentSong={currentSong}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
      />
      <p>Mood: {song.mood}</p>
      <Comments songId={song.id} />
      {/* Add more song details as needed */}
    </div>
  );
};

export default SongDetails;