import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess, SQUARES } from 'chess.js';

const ChessGame = ({ mode, duration }) => {
  const [fen, setFen] = useState();
  const [possibleMoves, setPossibleMoves] = useState([]);

  const handleMouseOverSquare = (square) => {
    const moves = chess.moves({ square, verbose: true });
    setPossibleMoves(moves.map(move => move.to));
  };

const handleMouseOutSquare = () => setPossibleMoves([]);
  const [chess] = useState(() => {
    const newChess = new Chess();
    newChess.clear();

    const pieces = ['r', 'b', 'q', 'n', 'p'];
    const whiteSquares = ['a1', 'b1', 'c1', 'd1', 'f1', 'g1', 'h1', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'];
    const blackSquares = ['a8', 'b8', 'c8', 'd8', 'f8', 'g8', 'h8', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'];

  while (whiteSquares.length>0) {
    const randomIndex = Math.floor(Math.random() * whiteSquares.length);
    (newChess.put({ type: pieces[Math.floor(Math.random() * pieces.length)], color: 'w' }, whiteSquares[randomIndex]))
    whiteSquares.splice(randomIndex, 1);
  }
  newChess.put({ type: 'k', color: 'w' }, 'e1');

  while (blackSquares.length>0) {
    const randomIndex = Math.floor(Math.random() * blackSquares.length);
    (newChess.put({ type: pieces[Math.floor(Math.random() * pieces.length)], color: 'b' }, blackSquares[randomIndex]))
    blackSquares.splice(randomIndex, 1);
  }
  newChess.put({ type: 'k', color: 'b' }, 'e8');

    setFen(newChess.fen());
    return newChess;
  });

  const handleMove = (move) => {
    try {
      if (chess.move(move)) {

        if (chess.isCheck()) {
          console.log('P1 - Gcacco!');
        }
        if (mode === 'playerVsComputer'){     
        setTimeout(() => {
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
        }, duration * 1000);
      }
        setFen(chess.fen());

        
      }
    } catch (err) {
      setFen(chess.fen());
    }
  };

  return (
    <div>
    {mode === 'dailyChallenge' || mode === 'playerVsPlayerOnline' ? 
      <p>Ancora in fase di implementazione!</p> 
      : 
      <div>
      {mode === 'playerVsComputer' ?
      <h1>PLAYER VS COMPUTER</h1>
      :
      <h1>PLAYER VS PLAYER (LOCAL)</h1>
      }
      <Chessboard
        position={fen}
        onMouseOverSquare={handleMouseOverSquare}
        onMouseOutSquare={handleMouseOutSquare}
        squareStyles={possibleMoves.reduce((a, c) => ({ ...a, [c]: { backgroundColor: 'yellow' } }), {})}
        onDrop={(move) => handleMove({ from: move.sourceSquare, to: move.targetSquare })}
        orientation="white"
        width={400}
      />
      </div>
    }
    </div>
  );
};

export default ChessGame;
