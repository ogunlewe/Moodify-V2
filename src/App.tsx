import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, useLocation, Routes } from 'react-router-dom';
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

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
}

const App: React.FC = () => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);

  useEffect(() => {
    if (!loading) {
      setIsAuthenticated(!!user);
    }
  }, [user, loading]);

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
    const idx = queue.findIndex((s) => s.id === currentSong?.id);
    const nextSong = idx === -1 || idx === queue.length - 1 ? queue[0] : queue[idx + 1];
    setCurrentSong(nextSong);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const idx = queue.findIndex((s) => s.id === currentSong?.id);
    const prevSong = idx === -1 || idx === 0 ? queue[queue.length - 1] : queue[idx - 1];
    setCurrentSong(prevSong);
    setIsPlaying(true);
  };

  const handleAddToQueue = (song: Song) => {
    setQueue([...queue, song]);
  };

  const handleRemoveFromQueue = (songId: string) => {
    setQueue(queue.filter((song) => song.id !== songId));
  };

  return (
    <div className="flex">
      {isAuthenticated && location.pathname !== '/login' && <Navbar />}
      <div className="flex-1 md:ml-64 p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <Home
              currentSong={currentSong}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              handleAddToQueue={handleAddToQueue}
            />
          } />
          <Route path="/upload" element={isAuthenticated ? <Upload /> : <Navigate to="/login" />} />
          <Route path="/songs" element={
            <Songs
              currentSong={currentSong}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              handleAddToQueue={handleAddToQueue}
            />
          } />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/playlists" element={
            <Playlists
              currentSong={currentSong}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              handleAddToQueue={handleAddToQueue}
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
            queue={queue}
            onRemoveFromQueue={handleRemoveFromQueue}
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