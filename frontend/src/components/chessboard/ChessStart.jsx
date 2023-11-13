import React, { useState } from 'react';
import ChessGame from './ChessGame';
import { Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, Slider, Modal } from '@mui/material';


const StartInterface = () => {
  const [mode, setMode] = useState('playerVsComputer');
  const [duration, setDuration] = useState(5);
  const [rank, setRank] = useState(50);
  const [gameStarted, setGameStarted] = useState(false);

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleSliderChange = (event, newValue) => {
    setRank(newValue); // Update rank state when slider changes
  };
  return (
    
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    {!gameStarted &&
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" border={gameStarted ? 0 : 1} p={2} m={2}
      style={{
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backdropFilter: 'blur(10px)'
      }}
    >
    
    <>
      <Typography variant="h1" component="div" gutterBottom align="center" style={{ color: 'black', fontFamily: 'Arial', margin: '20px 0' }}>
        CHESS GAME
      </Typography>
      <Box m={2} width={1/2}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="mode-label" style={{ color: 'darkblack' }}>Mode</InputLabel>
          <Select labelId="mode-label" value={mode} onChange={handleModeChange}>
            <MenuItem value={'playerVsComputer'}>Player vs Computer</MenuItem>
            <MenuItem value={'playerVsPlayer'}>Player vs Player</MenuItem>
            <MenuItem value={'playerVsPlayerOnline'}>Player vs Player (online)</MenuItem>
            <MenuItem value={'dailyChallenge'}>Daily Challenge</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box m={2} width={1/2}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="duration-label" style={{ color: 'darkblack' }}>Duration</InputLabel>
          <Select labelId="duration-label" value={duration} onChange={handleDurationChange}>
            <MenuItem value={5}>5 minutes</MenuItem>
            <MenuItem value={10}>10 minutes</MenuItem>
            <MenuItem value={15}>15 minutes</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Typography id="rank-slider" gutterBottom>
        Rank
      </Typography>
      <Slider
        defaultValue={50}
        getAriaValueText={value => `Rank ${value}`}
        aria-labelledby="rank-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={0}
        max={100}
        onChange={handleSliderChange}
      />
      <Box m={2}>
      <Button variant="contained" color="primary" onClick={handleStartGame} style={{ color: 'darkblack' }}>
        Start Game
      </Button>
      </Box>
    </>
    
    
  </Box>
  }
  {gameStarted && <ChessGame mode={mode} duration={duration} rank={rank}/>}
</Box>


  );
};

export default StartInterface;