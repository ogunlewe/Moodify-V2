import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PlaylistModal from "../components/PlayListModal";
import { Play, Pause, PlusCircle } from "lucide-react";

interface Song { 
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
}

interface Playlist {
  id: string;
  name: string;
  userId: string;
  songs: Song[];
}

interface PlaylistsProps {
  currentSong: Song | null;
  isPlaying: boolean;
  togglePlay: (song: Song) => void;
  handleAddToQueue: (song: Song) => void;
}

const Playlists: React.FC<PlaylistsProps> = ({ currentSong, isPlaying, togglePlay, handleAddToQueue }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "playlists"));
        const allPlaylists = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Playlist[];
        setPlaylists(allPlaylists);
      } catch (err) {
        setError("Failed to load playlists. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

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
      }
    };

    fetchSongs();
  }, []);

  const handleAddSongsToPlaylist = async () => {
    if (selectedPlaylist) {
      try {
        const updatedSongs = [...selectedPlaylist.songs, ...songs.filter(song => selectedSongs.includes(song.id))];
        await addDoc(collection(db, "playlists"), {
          ...selectedPlaylist,
          songs: updatedSongs,
        });
        setSelectedPlaylist({ ...selectedPlaylist, songs: updatedSongs });
        setIsAddModalOpen(false);
      } catch (err) {
        setError("Failed to add songs to playlist. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <section className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">All Playlists</h2>
          <button
            className="bg-green-500 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-green-400 transition"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusCircle size={20} /> Add Song
          </button>
        </div>

        {loading && <p className="text-gray-400">Loading playlists...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                onClick={() => {
                  setSelectedPlaylist(playlist);
                  setIsModalOpen(true);
                }}
              >
                <h3 className="font-semibold">{playlist.name}</h3>
                <p className="text-sm text-gray-400">by {playlist.userId}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No playlists available</p>
          )}
        </div>
      </section>

      {/* View Songs Modal */}
      <PlaylistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedPlaylist && (
          <div>
            <h2 className="text-xl font-semibold mb-4">{selectedPlaylist.name}</h2>
            {selectedPlaylist.songs.length > 0 ? (
              selectedPlaylist.songs.map((song) => (
                <div key={song.id} className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={song.cover || "https://via.placeholder.com/300"}
                      alt={song.title}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="font-semibold">{song.title}</h4>
                      <p className="text-sm text-gray-400">{song.artist}</p>
                    </div>
                  </div>
                  <button
                    className="bg-green-500 p-2 rounded-full transition hover:bg-green-400"
                    onClick={() => togglePlay(song)}
                  >
                    {currentSong && currentSong.id === song.id && isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No songs in this playlist.</p>
            )}
          </div>
        )}
      </PlaylistModal>

      {/* Add Song Modal */}
      <PlaylistModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Add Songs to Playlist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {songs.map((song) => (
            <div key={song.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedSongs.includes(song.id)}
                onChange={() => {
                  if (selectedSongs.includes(song.id)) {
                    setSelectedSongs(selectedSongs.filter(id => id !== song.id));
                  } else {
                    setSelectedSongs([...selectedSongs, song.id]);
                  }
                }}
              />
              <img
                src={song.cover || "https://via.placeholder.com/300"}
                alt={song.title}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div>
                <h4 className="font-semibold">{song.title}</h4>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          className="bg-green-500 px-4 py-2 rounded-full mt-4 hover:bg-green-400 transition"
          onClick={handleAddSongsToPlaylist}
        >
          Add Selected Songs
        </button>
      </PlaylistModal>
    </div>
  );
};

export default Playlists;
