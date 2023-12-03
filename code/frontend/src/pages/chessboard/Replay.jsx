// Replay.jsx
import React, {useEffect}  from 'react';
import { Button } from '@mui/material';
import ChessGameStyles from './ChessGameStyles';

const Replay = ({ gameHistory, currentMove, setCurrentMove, selectedGameId, setModalIsOpen1, chess, fen, setFen }) => {
    let allGames = JSON.parse(localStorage.getItem('allGames')) || [];
    let isNextMoveAvailable = false;
    if (allGames[selectedGameId]) {
        isNextMoveAvailable = currentMove + 1 < allGames[selectedGameId].history.length;
    }
    let isPreviousMoveAvailable = currentMove - 1 >= 0;

    useEffect(() => {
        if (selectedGameId !== null) {
            replayGame(selectedGameId);
        }
    }, [selectedGameId]);

    const replayGame = (gameIndex) => {
        console.log('Rendering Replay component');
        // Set the current move to the first move
        setCurrentMove(0);
        chess.reset();
        if (gameIndex >= 0 && gameIndex < allGames.length) { // Check if gameIndex is a valid index in allGames
        let gameToReplay = allGames[gameIndex]; // Get the game to replay
        if (gameToReplay && gameToReplay.history) { // Check if gameToReplay and gameToReplay.history are defined
            // Load the initial game state
            loadGameState(gameToReplay.history[currentMove]);
        } else {
            console.error(`No saved game found with index ${gameIndex}`);
        }
        } else {
        console.error(`Invalid game index: ${gameIndex}`);
        }
        setModalIsOpen1(false);
    };

    const loadGameState = (fen) => {
        chess.load(fen);
        setFen(chess.fen());
    };

    function handleNextMove() {
        let allGames = JSON.parse(localStorage.getItem('allGames')) || [];
        if (currentMove + 1 < allGames[selectedGameId].history.length) {
        // Load the next state from the game history
        let nextState = allGames[selectedGameId].history[currentMove + 1];
        loadGameState(nextState);
        // Increment the current move index
        setCurrentMove(currentMove => currentMove + 1);
        }
    }

    function handlePreviousMove() {
        let allGames = JSON.parse(localStorage.getItem('allGames')) || [];
        if (currentMove > 0) {
        // Decrement currentMove first
        setCurrentMove(currentMove - 1);
    
        // Then load the game state at the new currentMove
        loadGameState(allGames[selectedGameId].history[currentMove - 1]);
        }
    }
  return (
    <>
        <Button variant="contained" color="primary" onClick={handlePreviousMove} disabled={!isPreviousMoveAvailable}>Previous move</Button>
        <Button variant="contained" color="primary" style={{ marginLeft: '20px' }} onClick={handleNextMove} disabled={!isNextMoveAvailable}>Next move</Button>    
        <Button variant="contained" color="primary" style={{ marginLeft: '20px' }} onClick={() => window.location.href = '/play'}>Stop Replay</Button>
    </>
  );
};

export default Replay;