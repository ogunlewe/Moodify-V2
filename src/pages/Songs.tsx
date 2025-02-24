import React, { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import FollowButton from "../components/FollowButton";

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  uploaderName?: string;
  userId?: string;
}

interface SongsProps {
  currentSong: Song | null;
  isPlaying: boolean;
  togglePlay: (song: Song) => void;
  handleAddToQueue: (song: Song) => void;
}

const Songs: React.FC<SongsProps> = ({ currentSong, isPlaying, togglePlay, handleAddToQueue }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "songs"));
        const allSongs = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            artist: data.artist,
            cover: data.cover,
            url: data.url,
            uploaderName: data.uploaderName,
            userId: data.userId,
          } as Song;
        });
        setSongs(allSongs);
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
      <section className="px-6 py-4">
        <h2 className="text-2xl font-semibold mb-4">All Songs</h2>

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
                {song.userId && (
                  <div className="mt-2">
                    <FollowButton userIdToFollow={song.userId} />
                  </div>
                )}
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

export default Songs;