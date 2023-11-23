import React, { useState } from 'react';
import ChessGame from './ChessGame';
import { Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, Slider, TextField, Paper } from '@mui/material';


const StartInterface = () => {
  const [mode, setMode] = useState('playerVsComputer');
  const [duration, setDuration] = useState(5);
  const [rank, setRank] = useState(50);
  const [gameStarted, setGameStarted] = useState(false);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleStartGame = () => {
    // If mode is "PlayerVsComputer", set player2 to "Computer"
    if (mode === 'playerVsComputer' || mode === 'dailyChallenge') {
      setPlayer2('Computer');
    }
    setGameStarted(true);
  };

  const handleSliderChange = (event, newValue) => {
    setRank(newValue); // Update rank state when slider changes
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      {!gameStarted &&
        <Paper elevation={3} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          borderRadius: '20px',
          p: 3,
          m: 2,
          maxWidth: '500px',
          width: '100%',
          backdropFilter: 'blur(10px)'
        }}
        >
          <Typography variant="h2" component="div" gutterBottom align="center" style={{ color: 'black', fontFamily: 'Arial', margin: '20px 0' }}>
            REALLY <span style={{ fontSize: "20px" }}>bad</span> CHESS
          </Typography>
          <Box m={2} width={1 / 2}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="mode-label" style={{ color: 'darkblack' }}>Mode</InputLabel>
              <Select labelId="mode-label" value={mode} onChange={handleModeChange} label="Mode">
                <MenuItem value={'playerVsComputer'}>Player vs Computer</MenuItem>
                <MenuItem value={'playerVsPlayer'}>Player vs Player</MenuItem>
                <MenuItem value={'playerVsPlayerOnline'}>Player vs Player (online)</MenuItem>
                <MenuItem value={'dailyChallenge'}>Daily Challenge</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {
            mode === 'playerVsPlayer' &&
            <>
              <Box m={2} width={1 / 2}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="duration-label" style={{ color: 'darkblack' }}>Duration</InputLabel>
                  <Select labelId="duration-label" label="Duration" value={duration} onChange={handleDurationChange}>
                    <MenuItem value={0.25}>15 seconds</MenuItem>
                    <MenuItem value={1}>1 minute</MenuItem>
                    <MenuItem value={5}>5 minutes</MenuItem>
                    <MenuItem value={10}>10 minutes</MenuItem>
                    <MenuItem value={15}>15 minutes</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <form>
                <Typography variant="h8" component="div" gutterBottom align="center" style={{ color: 'black', fontFamily: 'Arial', margin: '20px 0' }}>
                  Player names
                </Typography>
                <TextField
                  label="Player 1"
                  value={player1}
                  onChange={e => setPlayer1(e.target.value)}
                />
                <TextField
                  label="Player 2"
                  value={player2}
                  onChange={e => setPlayer2(e.target.value)}
                />
              </form>
            </>
          }

          <Typography variant="h8" component="div" gutterBottom align="center" style={{ color: 'black', fontFamily: 'Arial', margin: '20px 0' }}>
            Rank slider
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
        </Paper>
      }
      {gameStarted && <ChessGame mode={mode} duration={duration} rank={rank} player1={player1 || 'Player 1'} player2={player2 || 'Player 2'} />}
    </Box>


  );
};

export default StartInterface;