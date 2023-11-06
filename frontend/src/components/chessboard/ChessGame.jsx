import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess, SQUARES } from 'chess.js';

const ChessGame = ({ mode, duration, rank }) => {
  const [fen, setFen] = useState();
  const [possibleMoves, setPossibleMoves] = useState([]);

  //Gestore delle mosse possibili
  const handleMouseOverSquare = (square) => {
    const moves = chess.moves({ square, verbose: true });
    setPossibleMoves(moves.map(move => move.to));
  };

const handleMouseOutSquare = () => setPossibleMoves([]);
const [chess] = useState(() => {

  //Inizializzazione della scacchiera
  const newChess = new Chess();
  newChess.clear();
  //Caricamento pezzi
  const whitePieces = findChessPiecesWithRank(rank+5);
  const blackPieces = findChessPiecesWithRank(rank-5);
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

  const handleMove = (move) => {
    try {
      if (chess.move(move)) {
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



function findChessPiecesWithRank(rank) {
  //Valori di calcolo della board
  let median = rank / 15;
  let overallValue = 0;
  let pieces = [
    { name: "p", value: 1 },
    { name: "n", value: 3 },
    { name: "b", value: 3 },
    { name: "r", value: 5 },
    { name: "q", value: 9 }
  ];

  let selectedPieces = [];

  //Selezioniamo un pezzo iniziale
  overallValue = pieces[Math.floor(Math.random() * 5)].value;
  for (let i = 0; i < 15; i++) {
    let filteredPieces;
    let selected = pieces[0];
    //Decidiamo se selezionare un pezzo con valore maggiore o minore della mediana
    if ((overallValue / (i + 1)) < median) {
      filteredPieces = pieces.filter(piece => piece.value > median);
    } 
    else {
      filteredPieces = pieces.filter(piece => piece.value <= median);
    }
    //Calcoliamo il peso di ogni pezzo
    const pieceWeights = filteredPieces.map(piece => weightFunction(piece.value, overallValue/(i+1), median));
    const totalWeight = pieceWeights.reduce((acc, weight) => acc + weight, 0);
    const randomValue = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    //Selezioniamo un pezzo in base al peso
    for (let j = 0; j < filteredPieces.length; j++) {
      cumulativeWeight += pieceWeights[j];
      //Se il peso è maggiore del valore random, selezioniamo il pezzo
      if (randomValue <= cumulativeWeight) {
        selected = filteredPieces[j];
        break;
      }
    }
    if ((overallValue / (i + 1)) < median) {
      overallValue += selected.value;
    } 
    else {
      overallValue -= selected.value;
    }
    //Aggiungiamo il pezzo selezionato alla lista
    selectedPieces.push(selected.name);
  }
  return selectedPieces;
}

//Calcolo del peso
function weightFunction(value, overallValue, median) {
  const diffToMedian = Math.abs(value - median);
  const diffToOverall = Math.abs(value - overallValue);
  const weight = 1 - (diffToMedian / (diffToOverall + 1));
  return weight;
}