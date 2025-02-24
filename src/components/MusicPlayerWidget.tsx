import React, { useState } from 'react';
import MiniPlayer from './MiniPlayer';
import FullPlayer from './FullPlayer';

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
}

interface MusicPlayerWidgetProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  queue: Song[];
  onRemoveFromQueue: (songId: string) => void;
}

const MusicPlayerWidget: React.FC<MusicPlayerWidgetProps> = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  queue,
  onRemoveFromQueue,
}) => {
  const [isFullPlayer, setIsFullPlayer] = useState(false);

  return (
    <>
      {isFullPlayer ? (
        <FullPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          queue={queue}
          onPlayPause={onPlayPause}
          onNext={onNext}
          onPrev={onPrev}
          onMinimize={() => setIsFullPlayer(false)}
          onRemoveFromQueue={onRemoveFromQueue}
        />
      ) : (
        <MiniPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          onNext={onNext}
          onPrev={onPrev}
          onExpand={() => setIsFullPlayer(true)}
        />
      )}
    </>
  );
};

export default MusicPlayerWidget;