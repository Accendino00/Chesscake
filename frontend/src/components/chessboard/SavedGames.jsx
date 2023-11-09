import React from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const SavedGames = ({ onSelectGame }) => {
  const savedGames = JSON.parse(localStorage.getItem('games')) || [];
  const [selectedGame, setSelectedGame] = React.useState('');

  const handleChange = (event) => {
    setSelectedGame(event.target.value);
    onSelectGame(event.target.value);
  };

  return (
    <div>
      <h1>Saved Games</h1>
      <FormControl>
        <InputLabel id="saved-games-label">Select Game</InputLabel>
        <Select
          labelId="saved-games-label"
          value={selectedGame}
          onChange={handleChange}
          style={{ width: '200px' }}
        >
        {savedGames.map((game) => (
          <MenuItem key={game.id} value={game.id}>
            Game {game.id}
          </MenuItem>
          ))}
      </Select>
      </FormControl>
    </div>
  );
};

export default SavedGames;