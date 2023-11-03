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

    const pieces = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'];
    const whiteSquares = SQUARES.slice(0, 16);
    const blackSquares = SQUARES.slice(48, 64);

    for (const element of pieces) {
      const randomIndex = Math.floor(Math.random() * whiteSquares.length);
      newChess.put({ type: element, color: 'b' }, whiteSquares[randomIndex]);
      whiteSquares.splice(randomIndex, 1);
    }

    for (const element of pieces) {
      const randomIndex = Math.floor(Math.random() * blackSquares.length);
      newChess.put({ type: element, color: 'w' }, blackSquares[randomIndex]);
      blackSquares.splice(randomIndex, 1);
    }

    setFen(newChess.fen());
    return newChess;
  });

  const handleMove = (move) => {
    try {
      if (selectedSquare) {
        const moves = chess.moves({ square: selectedSquare });
        moves.forEach(move => {
          chessboardRef.current.highlightSquare(move.to);
        });
      }

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

  const handleSquareClick = (square) => {
    if (selectedSquare) {
      const moves = chess.moves({ square: selectedSquare });
      moves.forEach(move => {
        chessboardRef.current.unhighlightSquare(move.to);
      });
    }

    setSelectedSquare(square);

    const moves = chess.moves({ square });
    moves.forEach(move => {
      chessboardRef.current.highlightSquare(move.to);
    });
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
      onSquareClick={handleSquareClick}
        orientation="white"
        width={400}
      ref={chessboardRef}
      />
      </div>
    }
    </div>
  );
};

export default ChessGame;
