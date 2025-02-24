import React, { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react"; // Ensure this import
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import SearchBar from "../components/SearchBar";
import FollowButton from "../components/FollowButton";

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  userId?: string;
  uploaderName?: string;
}

interface HomeProps {
  currentSong: Song | null;
  isPlaying: boolean;
  togglePlay: (song: Song) => void;
  handleAddToQueue: (song: Song) => void;
}

const Home: React.FC<HomeProps> = ({ currentSong, isPlaying, togglePlay, handleAddToQueue }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSearch = (query: string) => {
    // Implement search functionality here
    console.log("Searching for:", query);
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "songs"));
        const allSongs = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Song[];
        // Select 3 random songs
        const randomSongs = allSongs.sort(() => 0.5 - Math.random()).slice(0, 3);
        setSongs(randomSongs);
      } catch (err) {
        setError("Failed to load songs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-80 bg-gradient-to-r from-green-600 to-blue-600 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Discover Music</h1>
          <p className="text-lg mb-6">Find the perfect soundtrack for every moment.</p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Recommended Songs Section */}
      <section className="px-6 py-4">
        <h2 className="text-2xl font-semibold mb-4">Recommended Songs</h2>

        {loading && <p className="text-gray-400">Loading songs...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {songs.length > 0 ? (
            songs.map((song) => (
              <div
                key={song.id}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                onClick={() => togglePlay(song)}
              >
                <img
                  src={song.cover || "https://via.placeholder.com/300"}
                  alt={song.title}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
                <h3 className="font-semibold">{song.title}</h3>
                <p className="text-sm text-gray-400">{song.artist}</p>
                {/* Show uploader name */}
                <p className="text-xs text-gray-300">
                  Uploaded by: {song.uploaderName ? song.uploaderName : "Anonymous"}
                </p>
                {/* Follow uploader button */}
                <div className="mt-2">
                  {song.userId && <FollowButton userIdToFollow={song.userId} />}
                </div>
                <button
                  className="mt-3 bg-green-500 p-2 rounded-full transition hover:bg-green-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay(song);
                  }}
                >
                  {currentSong && currentSong.id === song.id && isPlaying ? (
                    <Pause size={20} />
                  ) : (
                    <Play size={20} />
                  )}
                </button>
                <button
                  className="mt-3 bg-blue-500 p-2 rounded-full transition hover:bg-blue-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToQueue(song);
                  }}
                >
                  Add to Queue
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No songs available</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;