import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess, SQUARES } from 'chess.js';
import SavedGames from './SavedGames';
import GameReplayer from './GameReplayer';

const ChessGame = ({ mode, duration, rank }) => {
  const [fen, setFen] = useState();
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [moves, setMoves] = useState([]);
  
  //Gestore delle mosse possibili
  const handleMouseOverSquare = (square) => {
    const moves = chess.moves({ square, verbose: true });
    setPossibleMoves(moves.map(move => move.to));
    
  };

  const handleMouseOutSquare = () => {
    setPossibleMoves([]);
  };
  const [chess] = useState(() => {
  //Inizializzazione della scacchiera
  const newChess = new Chess();
  newChess.clear();
  //Caricamento pezzi
  const [playerRank, opponentRank] = calculateRanks(rank);
  console.log(playerRank, opponentRank);
  const whitePieces = findChessPiecesWithRank(playerRank);
  const blackPieces = findChessPiecesWithRank(opponentRank);
  //const pieces = ['r', 'b', 'q', 'n', 'p'];  Da implementare per custom partite
  const whiteSquares = ['a1', 'b1', 'c1', 'd1', 'f1', 'g1', 'h1', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'];
  const blackSquares = ['a8', 'b8', 'c8', 'd8', 'f8', 'g8', 'h8', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'];

  //Generazione pezzi nella scacchiera
  while (whiteSquares.length>0) {
    const randomIndex = Math.floor(Math.random() * whiteSquares.length);
    (newChess.put({ type: whitePieces.pop(), color: 'w' }, whiteSquares[randomIndex]))
    whiteSquares.splice(randomIndex, 1);
  }
  newChess.put({ type: 'k', color: 'w' }, 'e1');

  while (blackSquares.length>0) {
    const randomIndex = Math.floor(Math.random() * blackSquares.length);
    (newChess.put({ type: blackPieces.pop(), color: 'b' }, blackSquares[randomIndex]))
    blackSquares.splice(randomIndex, 1);
  }
  newChess.put({ type: 'k', color: 'b' }, 'e8');

  //Inizializzazione
  setFen(newChess.fen());
  return newChess;
    
  });

  const handleSelectGame = (gameId) => {
    setSelectedGameId(gameId);
  };

  const handleMove = ({ sourceSquare, targetSquare }) => {
    if (chess.turn() === 'b' && mode === 'playerVsComputer') {
      return;
    }
    try {
      if (chess.move({ from: sourceSquare, to: targetSquare })) {
        if (chess.isCheck()) {
          console.log('P1 - Scacco!');
        }
        //Se è in modalità giocatore vs computer, il computer effettua la mossa
        if (mode === 'playerVsComputer'){     
        setTimeout(() => {
          const moves = chess.moves();
          if (moves.length > 0) {
            //Mossa casuale
            const randomIndex = Math.floor(Math.random() * moves.length);
            chess.move(moves[randomIndex]);
            setFen(chess.fen());

            if (chess.isCheckmate()) {
              console.log('P2 - Scacco Matto!');
            } else if (chess.isCheck()) {
              console.log('P2 - Scacco!');
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
    handleMouseOutSquare();
  };

  const handleGameOver = () => {
    const savedGames = JSON.parse(localStorage.getItem('games')) || [];
    const newGame = { id: savedGames.length + 1, moves };
    savedGames.push(newGame);
    localStorage.setItem('games', JSON.stringify(savedGames));
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
        onMouseOverSquare={(mode === 'playerVsComputer' && chess.turn() === 'w') 
        || mode !== 'playerVsComputer' ? handleMouseOverSquare : undefined}
        onMouseOutSquare={handleMouseOutSquare}
        squareStyles={possibleMoves.reduce((a, c) => ({ ...a, [c]: { backgroundColor: 'yellow' } }), {})}
        onDrop={handleMove}
        orientation="white"
        width={400}
      />
      </div>
    }
      <div>
        <button onClick={handleGameOver}>End Game</button>
      </div>
      <div>
        {selectedGameId ? (
          <GameReplayer gameId={selectedGameId} />
        ) : (
          <SavedGames onSelectGame={handleSelectGame} />
        )}
      </div>
    </div>
  );
};

export default ChessGame;



function findChessPiecesWithRank(rank) {

  //Pezzi disponibili da scegliere
  const pieces = [
    { name: "p", value: 1 },
    { name: "n", value: 3 },
    { name: "b", value: 3 },
    { name: "r", value: 5 },
    { name: "q", value: 9 }
  ];
  const selectedPieces = [];
  let overallValue = pieces[Math.floor(Math.random() * pieces.length)].value;
  const median = (rank - 14) / 15;  //Valore per shiftare la scelta dei pezzi
  for (let i = 0; i < 15; i++) {
    let filteredPieces = pieces.filter(piece => (overallValue / (i + 1)) < median ? piece.value >= median : piece.value <= median);
    if (filteredPieces.length === 0) {
      filteredPieces = (overallValue / (i + 1)) < median ? [pieces[pieces.length - 1]] : [pieces[0]];
    }
    //Scelta del peso dei valori disponibili
    const pieceWeights = filteredPieces.map(piece => weightFunction(piece.value, overallValue / (i + 1), median));
    const totalWeight = pieceWeights.reduce((acc, weight) => acc + weight, 0);
    const randomValue = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    let selected;

    //Scelta del pezzo determinante da quanto pesa
    for (let j = 0; j < filteredPieces.length; j++) {
      cumulativeWeight += pieceWeights[j];
      if (randomValue <= cumulativeWeight) {
        selected = filteredPieces[j];
        break;
      }
    }
    overallValue += (overallValue / (i + 1)) < median ? selected.value : -selected.value;
    selectedPieces.push(selected.name);
  }
  return selectedPieces;
}

//Funzione del calcolo del peso
function weightFunction(value, overallValue, median) {
  const diffToMedian = Math.abs(value - median);
  const diffToOverall = Math.abs(value - overallValue);
  let weight = 1 - (diffToMedian / (diffToOverall + 1));
  return weight <= 0 ? 0 : weight;
}

function calculateRanks(rank) {
  if (rank < 0) {
    throw new Error("Invalid value");
  }
  const value = -0.5 * rank + 25;  //Funzione lineare per determinare il valore
  let playerRank = Math.random() * 100;
  let opponentRank = playerRank + value;
  playerRank = Math.min(Math.max(playerRank, 0), 100);
  opponentRank = Math.min(Math.max(opponentRank, 0), 100);
  return [playerRank, opponentRank];
}
