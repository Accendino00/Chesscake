import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';
import { SQUARES } from 'chess.js';

const ChessGame = () => {
  const [fen, setFen] = useState();

  const [chess] = useState(() => {
    const newChess = new Chess();
    newChess.clear();

    const pieces = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'];
    const whiteSquares = SQUARES.slice(0, 16);
    const blackSquares = SQUARES.slice(48, 64);

    for (let i = 0; i < pieces.length; i++) {
      const randomIndex = Math.floor(Math.random() * whiteSquares.length);
      newChess.put({ type: pieces[i], color: 'b' }, whiteSquares[randomIndex]);
      whiteSquares.splice(randomIndex, 1);
    }

    for (let i = 0; i < pieces.length; i++) {
      const randomIndex = Math.floor(Math.random() * blackSquares.length);
      newChess.put({ type: pieces[i], color: 'w' }, blackSquares[randomIndex]);
      blackSquares.splice(randomIndex, 1);
    }

    setFen(newChess.fen());
    return newChess;
  });

  const handleMove = (move) => {
    try {
      if (chess.move(move)) {

        if (chess.isCheck()) {
          console.log('P1 - Gcacco!');
        }
        
        /*setTimeout(() => {
          const moves = chess.moves();
          if (moves.length > 0) {
            const randomIndex = Math.floor(Math.random() * moves.length);
            chess.move(moves[randomIndex]);
            setFen(chess.fen());

            if (chess.isCheckmate()) {
              console.log('P2 - Scacco Gatto!');
            } else if (chess.isCheck()) {
              console.log('P2 - Gcacco!');
            }
          }
          else {
            console.log('P1 - Scacco Matto!');
          }
        }, 1000);*/

        setFen(chess.fen());

        
      }
    } catch (err) {
      setFen(chess.fen());
    }
  };

  return (
    <Chessboard
      position={fen}
      onDrop={(move) => handleMove({ from: move.sourceSquare, to: move.targetSquare })}
      orientation="white"
      width={400}
    />
  );
};

export default ChessGame;