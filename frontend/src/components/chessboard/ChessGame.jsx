import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess} from 'chess.js';
import SavedGames from './SavedGames';
import GameReplayer from './GameReplayer';
import { Button, Box } from '@mui/material';

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
  let seed = 0;
  if(mode==='dailyChallenge'){
    const today = new Date();
    seed = ((((((
      (today.getFullYear()*100 + today.getMonth()*10 + today.getDate()) 
      * 214013 + 2531011) >> 16) & 0x7fff)* 214013 + 2531011) >> 16) & 0x7fff); //Generazione seed giornaliero attraverso funzione di hashing
  }
  const [playerRank, opponentRank] = calculateRanks(rank, seed);
  const whitePieces = findChessPiecesWithRank(playerRank, seed);
  const blackPieces = findChessPiecesWithRank(opponentRank, seed);
  //const pieces = ['r', 'b', 'q', 'n', 'p'];  Da implementare per custom partite
  const whiteSquares = ['a1', 'b1', 'c1', 'd1', 'f1', 'g1', 'h1', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'];
  const blackSquares = ['a8', 'b8', 'c8', 'd8', 'f8', 'g8', 'h8', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'];

  //Generazione pezzi nella scacchiera
  while (whiteSquares.length>0) {
    const randomIndex = Math.floor((seed===0 ? Math.random() : seededRandom(seed)) * whiteSquares.length);
    (newChess.put({ type: whitePieces.pop(), color: 'w' }, whiteSquares[randomIndex]))
    whiteSquares.splice(randomIndex, 1);
  }
  newChess.put({ type: 'k', color: 'w' }, 'e1');

  while (blackSquares.length>0) {
    const randomIndex = Math.floor((seed===0 ? Math.random() : seededRandom(seed)) * blackSquares.length);
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
      if (chess.turn() === 'w' && mode === 'playerVsComputer') {
        if (chess.move({ from: sourceSquare, to: targetSquare })) {
          setFen(chess.fen());
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
          }, 1000);
        }
        setFen(chess.fen());
        }
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
    {/*mode === 'dailyChallenge' ||*/ mode === 'playerVsPlayerOnline' ? 
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-end"
        height="10vh"
      >
      <Button variant="contained" color="primary" onClick={handleGameOver}>
        End Game
      </Button>
      </Box>
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



function findChessPiecesWithRank(rank, seed) {
  //Pezzi disponibili da scegliere
  const pieces = [
    { name: "p", value: 1 },
    { name: "n", value: 3 },
    { name: "b", value: 3 },
    { name: "r", value: 5 },
    { name: "q", value: 9 }
  ];
  const selectedPieces = [];
  let overallValue = pieces[Math.floor((seed===0 ? Math.random() : seededRandom(seed)) * pieces.length)].value;
  const median = (rank - 15) / 15;  //Valore per shiftare la scelta dei pezzi
  for (let i = 0; i < 15; i++) {
    let filteredPieces = pieces.filter(piece => (overallValue / (i + 1)) < median ? piece.value >= median : piece.value <= median);
    if (filteredPieces.length === 0) {
      filteredPieces = (overallValue / (i + 1)) < median ? [pieces[pieces.length - 1]] : [pieces[0]];
    }
    //Pseudo randomizzazione dei pezzi di valore 3
    if (filteredPieces.some(piece => piece.value === 3)) {
      filteredPieces = filteredPieces.filter(piece => piece.value !== 3);
      //Randomizzare la scelta tra alfiere e cavallo attraverso la parte decimale del numero random
      filteredPieces.push({ name: parseInt(((seed===0 ? Math.random() : seededRandom(seed)).toString().split('.')[1])[i]) < 5 ? 'b' : 'n', value: 3 });
    }
    //Scelta del peso dei valori disponibili
    const pieceWeights = filteredPieces.map(piece => weightFunction(piece.value, overallValue / (i + 1), median));
    const totalWeight = pieceWeights.reduce((acc, weight) => acc + weight, 0);
    const randomValue = (seed===0 ? Math.random() : seededRandom(seed)) * totalWeight;
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

// Funzione per calcolare il rank
function calculateRanks(rank, seed) {
  const value = -0.5 * rank + 25;  //Funzione lineare per determinare il valore
  let playerRank = (seed===0 ? Math.random() : seededRandom(seed)) * 65 + 25;
  let opponentRank = playerRank - value;
  playerRank = Math.max(playerRank, 0);
  opponentRank = Math.max(opponentRank, 0);
  return [playerRank, opponentRank];
}

//Funzione per generare un numero random con seed
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}