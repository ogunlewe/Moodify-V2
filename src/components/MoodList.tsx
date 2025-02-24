import React from 'react';

interface MoodListProps {
  onSelectMood: (mood: string) => void;
}

const moods = [
  'Happy', 'Sad', 'Energetic', 'Calm', 'Relaxed', 'Romantic', 'Motivating', 'Focus', 'Party', 'Chill', 'Uplifting', 'Intense', 'Dreamy', 'Nostalgic', 'Contemplative'
];

const MoodList: React.FC<MoodListProps> = ({ onSelectMood }) => {
  return (
    <div>
      <h2>Browse by Mood</h2>
      <ul>
        {moods.map(mood => (
          <li key={mood} onClick={() => onSelectMood(mood)}>
            {mood}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoodList;