import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Songs from './pages/Songs';
import Profile from './pages/Profile';
import Playlists from './pages/Playlists';
import MusicPlayerWidget from './components/MusicPlayerWidget';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Song } from './pages/Home';

const App: React.FC = () => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    if (!loading) {
      setIsAuthenticated(!!user);
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchSongs = async () => {
      const querySnapshot = await getDocs(collection(db, "songs"));
      const fetchedSongs: Song[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Song[];
      setSongs(fetchedSongs);
    };
    fetchSongs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const togglePlay = (song: Song) => {
    if (currentSong && currentSong.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % songs.length;
      setCurrentSong(songs[nextIndex]);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
      setCurrentSong(songs[prevIndex]);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex">
      {isAuthenticated && location.pathname !== '/login' && <Navbar />}
      <div className="flex-1 md:ml-64 p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={isAuthenticated ? <Upload /> : <Navigate to="/login" />} />
          <Route path="/songs" element={
            <Songs
              currentSong={currentSong}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
            />
          } />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/playlists" element={
            <Playlists
              currentSong={currentSong}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
            />
          } />
        </Routes>
        {currentSong && (
          <MusicPlayerWidget
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </div>
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;

