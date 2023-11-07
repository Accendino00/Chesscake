import React, { useEffect, useState } from 'react';

function GameReplayer({ gameId, setFen }) {
  const [moves, setMoves] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem('games')) || [];
    const game = savedGames.find(game => game.id === gameId);
    if (game?.moves) {
      setMoves(game.moves);
    }
  }, [gameId]);

  useEffect(() => {
    if (currentMoveIndex < moves.length) {
      const timeoutId = setTimeout(() => {
        setFen(moves[currentMoveIndex]);
        setCurrentMoveIndex(currentMoveIndex + 1);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [currentMoveIndex, moves, setFen]);

  return (
    <div>
      <h2>Replaying game {gameId}</h2>
    </div>
  );
}

export default GameReplayer;