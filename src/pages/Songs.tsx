import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Play, Pause } from "lucide-react";
import FollowButton from "../components/FollowButton";
import { Song } from "./Home";
import { Link } from "react-router-dom";

interface SongsProps {
  currentSong: Song | null;
  isPlaying: boolean;
  togglePlay: (song: Song) => void;
}

const Songs: React.FC<SongsProps> = ({ currentSong, isPlaying, togglePlay }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "songs"));
        const allSongs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Song[];
        setSongs(allSongs);
      } catch (err) {
        setError("Failed to load songs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  if (loading) return <p className="p-6 text-white">Loading songs...</p>;

  return (
    <section className="p-6 bg-black text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">All Songs</h1>
        <Link to="/playlists" className="md:hidden bg-green-500 px-4 py-2 rounded-full hover:bg-green-400 transition">
          Playlists
        </Link>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-[#1e1e1e] p-4 rounded-lg shadow-lg hover:bg-[#2a2a2a] transition cursor-pointer border border-gray-700"
          >
            <div className="relative group">
              <img
                src={song.cover || "https://via.placeholder.com/300"}
                alt={song.title}
                className="w-full h-48 object-cover rounded-md shadow-md"
              />
              <button
                className="absolute bottom-4 right-4 bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-400 opacity-0 group-hover:opacity-100 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay(song);
                }}
              >
                {currentSong && currentSong.id === song.id && isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} />
                )}
              </button>
            </div>
            <div className="mt-4 text-center">
              <h2 className="text-lg font-semibold truncate text-white">{song.title}</h2>
              <p className="text-sm text-gray-400 truncate">{song.artist}</p>
            </div>
            <div className="mt-3 flex justify-center">
              <FollowButton userIdToFollow={song.userId ? song.userId : ""} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Songs;
