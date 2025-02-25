import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  uploaderName?: string;
  userId?: string;
}

const Home: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [randomSongs, setRandomSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const querySnapshot = await getDocs(collection(db, "songs"));
      const fetchedSongs: Song[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Song[];
      setSongs(fetchedSongs);
      setFilteredSongs(fetchedSongs);

      // Select three random songs
      const shuffledSongs = fetchedSongs.sort(() => 0.5 - Math.random());
      setRandomSongs(shuffledSongs.slice(0, 3));
    };
    fetchSongs();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(song =>
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  };

  return (
    <section className="p-6 bg-black text-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-4">Discover Music</h1>
        <p className="text-lg mb-6">Find the perfect soundtrack for every moment.</p>
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Featured Songs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {randomSongs.map((song: Song) => (
            <div key={song.id} className="bg-gray-800 p-4 rounded-lg">
              <img src={song.cover || "https://via.placeholder.com/150"} alt={song.title} className="mb-2 rounded" />
              <h2 className="text-xl font-semibold">{song.title}</h2>
              <p className="text-sm text-gray-400">{song.artist}</p>
              <p className="text-xs text-gray-300">
                Uploaded by: {song.uploaderName ? song.uploaderName : "Anonymous"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;