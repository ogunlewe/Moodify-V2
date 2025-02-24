import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';
import { Play, Pause } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  mood: string;
  url: string;
  cover: string;
}

interface RecommendationsProps {
  togglePlay: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

const Recommendations: React.FC<RecommendationsProps> = ({ togglePlay, currentSong, isPlaying }) => {
  const [user] = useAuthState(auth);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchRecommendedSongs = async () => {
      if (user) {
        try {
          const likedSongsQuery = query(collection(db, 'likes'), where('userId', '==', user.uid));
          const likedSongsSnapshot = await getDocs(likedSongsQuery);
          const likedMoods = likedSongsSnapshot.docs.map(doc => doc.data().mood).filter(Boolean);

          if (likedMoods.length > 0) {
            const recommendedSongsQuery = query(collection(db, 'songs'), where('mood', 'in', likedMoods));
            const recommendedSongsSnapshot = await getDocs(recommendedSongsQuery);
            const recommendedSongsData = recommendedSongsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Song[];
            setRecommendedSongs(recommendedSongsData);
          } else {
            setRecommendedSongs([]);
          }
        } catch (error) {
          console.error('Error fetching recommended songs:', error);
        }
      }
    };

    fetchRecommendedSongs();
  }, [user]);

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {recommendedSongs.length > 0 ? (
        recommendedSongs.map(song => (
          <div key={song.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <img src={song.cover} alt={song.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-lg font-semibold text-white">{song.title}</h3>
            <p className="text-sm text-gray-400">{song.artist}</p>
            <button
              className="mt-2 bg-green-500 p-2 rounded-full"
              onClick={() => togglePlay(song)}
            >
              {currentSong && currentSong.id === song.id && isPlaying ? <Pause /> : <Play />}
            </button>
          </div>
        ))
      ) : (
        <p className="text-center col-span-full text-white">No recommendations available.</p>
      )}
    </div>
  );
};

export default Recommendations;