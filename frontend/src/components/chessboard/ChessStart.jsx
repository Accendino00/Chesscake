import React, { useState } from 'react';
import ChessGame from './ChessGame';
import './chessStart.css';


const StartInterface = () => {
  const [mode, setMode] = useState('playerVsComputer');
  const [duration, setDuration] = useState(5);
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

  return (
    <div className='gameDiv'>
      {!gameStarted &&
      <>
      <h1>Chess Game</h1>
      <div>
        <label>
          <input
            type="radio"
            value="playerVsComputer"
            checked={mode === 'playerVsComputer'}
            onChange={handleModeChange}
          />
          Player vs Computer
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="dailyChallenge"
            checked={mode === 'dailyChallenge'}
            onChange={handleModeChange}
          />
          Daily Challenge
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="playerVsPlayerLocal"
            checked={mode === 'playerVsPlayerLocal'}
            onChange={handleModeChange}
          />
          Player vs Player (local)
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="playerVsPlayerOnline"
            checked={mode === 'playerVsPlayerOnline'}
            onChange={handleModeChange}
          />
          Player vs Player (online)
        </label>
      </div>
      <div>
        <label>
          Duration (minutes):
          <input
            type="number"
            value={duration}
            onChange={handleDurationChange}
          />
        </label>
      </div>
      <div>
        <button onClick={handleStartGame}>Start Game</button>
      </div>
      </>
      }
      {gameStarted && <ChessGame mode={mode} duration={duration}/> }
    </div>
  );
};

export default StartInterface;