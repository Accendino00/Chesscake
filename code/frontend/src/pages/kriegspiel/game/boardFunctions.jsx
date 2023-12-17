import { Chess } from 'chess.js';

let pieces = [
  { name: "p", value: 1 },
  { name: "n", value: 3 },
  { name: "b", value: 3 },
  { name: "r", value: 5 },
  { name: "q", value: 9 }
];

function findChessPiecesWithRank(rank, seed) {
  const selectedPieces = [];
  let overallValue = getRandomPieceValue(seed);
  const median = calculateMedian(rank);

  for (let i = 0; i < 8; i++) {
    let filteredPieces = filterPieces(pieces, overallValue, median, i);

    if (filteredPieces.length === 0) {
      filteredPieces = getDefaultFilteredPieces(overallValue, median, i);
    }

    filteredPieces = handleSpecialCase(filteredPieces, seed, i);

    const pieceWeights = calculatePieceWeights(filteredPieces, overallValue, median, i);
    const totalWeight = calculateTotalWeight(pieceWeights);
    const randomValue = getRandomValue(seed) * totalWeight;
    const selected = selectPiece(filteredPieces, pieceWeights, randomValue);

    overallValue += (overallValue / (i + 1)) < median ? selected.value * 1.3 : -selected.value * 0.7;
    selectedPieces.push(selected);
  }
  pieces = [
    { name: "p", value: 1 },
    { name: "n", value: 3 },
    { name: "b", value: 3 },
    { name: "r", value: 5 },
  ];
  
  for (let i = 8; i < 15; i++) {
    let filteredPieces = filterPieces(pieces, overallValue, median, i);

    if (filteredPieces.length === 0) {
      filteredPieces = getDefaultFilteredPieces(overallValue, median, i);
    }

    filteredPieces = handleSpecialCase(filteredPieces, seed, i);

    const pieceWeights = calculatePieceWeights(filteredPieces, overallValue, median, i);
    const totalWeight = calculateTotalWeight(pieceWeights);
    const randomValue = getRandomValue(seed) * totalWeight;
    const selected = selectPiece(filteredPieces, pieceWeights, randomValue);

    pieces = [
      { name: "p", value: 1 },
      { name: "n", value: 3 },
      { name: "b", value: 3 },
      { name: "r", value: 5 },
      { name: "q", value: 9 }
    ];

    overallValue += (overallValue / (i + 1)) < median ? selected.value * 0.7 : -selected.value * 1.3;
    selectedPieces.push(selected);
  }

  return selectedPieces;
}

function getRandomPieceValue(seed) {
  return pieces[Math.floor((seed === 0 ? Math.random() : seededRandom(seed)) * pieces.length)].value;
}

function calculateMedian(rank) {
  return (rank) / 15;
}

function filterPieces(pieces, overallValue, median, i) {
  return pieces.filter(piece => Math.floor((overallValue / (i + 1))) < median ? piece.value >= median : piece.value <= median);
}

function getDefaultFilteredPieces(overallValue, median,i) {
  return (overallValue / (i + 1)) < median ? [pieces[pieces.length - 1]] : [pieces[0]];
}

function handleSpecialCase(filteredPieces, seed, i) {
  if (filteredPieces.some(piece => piece.value === 3)) {
    filteredPieces = filteredPieces.filter(piece => piece.value !== 3);
    const randomDecimal = seed === 0 ? Math.random() : seededRandom(seed);
    const randomPiece = parseInt(randomDecimal.toString().split('.')[1].charAt(i)) < 5 ? 'b' : 'n';
    filteredPieces.push({ name: randomPiece, value: 3 });
  }
  return filteredPieces;
}

function calculatePieceWeights(filteredPieces, overallValue, median, i) {
  return filteredPieces.map(piece => weightFunction(piece.value, overallValue / (i + 1), median, 4));
}

function calculateTotalWeight(pieceWeights) {
  return pieceWeights.reduce((acc, weight) => acc + weight, 0);
}

function getRandomValue(seed) {
  return seed === 0 ? Math.random() : seededRandom(seed);
}

function selectPiece(filteredPieces, pieceWeights, randomValue) {
  let cumulativeWeight = 0;
  let selected = filteredPieces[filteredPieces.length-1];  // Initialize with the last piece

  if (selected.name === "q") {
    selected = filteredPieces[filteredPieces.length-2];  // Select the penultimate piece
  }

  for (let j = 0; j < filteredPieces.length; j++) {
    cumulativeWeight += pieceWeights[j];
    if (randomValue <= cumulativeWeight + Number.EPSILON) {
      selected = filteredPieces[j];
      break;
    }
  }
  return selected;
}

// Funzione del calcolo del peso
function weightFunction(value, overallValue, median, scale = 1) {
  const diffToMedian = Math.abs(value - median);
  const diffToOverall = Math.abs(value - overallValue);
  let weight = scale * (1 - diffToMedian / (diffToOverall + 1));
  return weight;
}

function generateBoard(mode, rank) {
  const newChess = new Chess();

  newChess.clear();

  // Caricamento pezzi
  let seed = 0;
  if (mode === 'dailyChallenge') {
    const today = new Date();
    seed = ((((((today.getFullYear() * 100 + today.getMonth() * 10 + today.getDate()) * 214013 + 2531011) >> 16) & 0x7fff) * 214013 + 2531011) >> 16) & 0x7fff; // Generazione seed giornaliero attraverso funzione di hashing
  }

  const [playerRank, opponentRank] = calculateRanks(rank, seed);
  const whitePieces = findChessPiecesWithRank(playerRank, seed).sort((a, b) => a.value - b.value);
  const blackPieces = findChessPiecesWithRank(opponentRank, seed).sort((a, b) => a.value - b.value);
  
  const whiteSquares = ['a1', 'b1', 'c1', 'd1', 'f1', 'g1', 'h1', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'];
  const blackSquares = ['a8', 'b8', 'c8', 'd8', 'f8', 'g8', 'h8', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'];

  // Metti i pezzi disponibili in modo casuale nella fila 2
  whitePieces.filter(piece => piece.name === "q").forEach((piece) => {
    const validSquares = whiteSquares.filter(square => square[1] === "1");
    const randomIndex = Math.floor(Math.random() * validSquares.length);
    const square = validSquares.splice(randomIndex, 1)[0];
    newChess.put({ type: piece.name, color: 'w' }, square);
    whitePieces.splice(whitePieces.findIndex(p => p === piece), 1);
    whiteSquares.splice(whiteSquares.indexOf(square), 1);
  });

  whitePieces.filter(piece => piece.name === "p").forEach((piece) => {
    const validSquares = whiteSquares.filter(square => square[1] === "2");
    if(validSquares.length > 0) {
    const randomIndex = Math.floor(Math.random() * validSquares.length);
    const square = validSquares.splice(randomIndex, 1)[0];
    newChess.put({ type: piece.name, color: 'w' }, square);
    whitePieces.splice(whitePieces.findIndex(p => p === piece), 1);
    whiteSquares.splice(whiteSquares.indexOf(square), 1);
    }
  });

  //Aggiungi il resto nelle due file
  while (whiteSquares.length > 0) {
    const randomIndex = Math.floor((seed === 0 ? Math.random() : seededRandom(seed)) * whiteSquares.length);
    newChess.put({ type: whitePieces.pop().name, color: 'w' }, whiteSquares[randomIndex]);
    whiteSquares.splice(randomIndex, 1);
  }
  newChess.put({ type: 'k', color: 'w' }, 'e1');
  
  blackPieces.filter(piece => piece.name === "q").forEach((piece) => {
    const validSquares = blackSquares.filter(square => square[1] === "8");
    const randomIndex = Math.floor(Math.random() * validSquares.length);
    const square = validSquares.splice(randomIndex, 1)[0];
    newChess.put({ type: piece.name, color: 'b' }, square);
    blackPieces.splice(blackPieces.findIndex(p => p === piece), 1);
    blackSquares.splice(blackSquares.indexOf(square), 1);
  });

  blackPieces.filter(piece => piece.name === "p").forEach((piece) => {
    const validSquares = blackSquares.filter(square => square[1] === "7");
    if(validSquares.length > 0) {
      const randomIndex = Math.floor(Math.random() * validSquares.length);
      const square = validSquares.splice(randomIndex, 1)[0];
      newChess.put({ type: piece.name, color: 'b' }, square);
      blackPieces.splice(blackPieces.findIndex(p => p === piece), 1);
      blackSquares.splice(blackSquares.indexOf(square), 1);
    }
  });

  //Aggiungi il resto nelle due file
  while (blackSquares.length > 0) {
    const randomIndex = Math.floor((seed === 0 ? Math.random() : seededRandom(seed)) * blackSquares.length);
    newChess.put({ type: blackPieces.pop().name, color: 'b' }, blackSquares[randomIndex]);
    blackSquares.splice(randomIndex, 1);
  }
  newChess.put({ type: 'k', color: 'b' }, 'e8');

  // Inizializzazione
  return newChess;
}



// Funzione per calcolare il rank
function calculateRanks(rank, seed) {
  const value = -0.5 * rank + 25;  // Funzione lineare per determinare il valore
  const baseRank = ((seed === 0 ? Math.random() : seededRandom(seed)) * 10) + 25;
  let playerRank = baseRank + value/2;
  let opponentRank = baseRank - value/2;
  playerRank = Math.max(playerRank, 0);
  opponentRank = Math.max(opponentRank, 0);
  return [playerRank, opponentRank];
}

// Funzione per generare un numero random con seed
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Funzione per determinare la posizione del pezzo
const getPiecePosition = (game, piece) => {
  // Ritorna la posizione del pezzo se esiste
  return [].concat(...game.board()).map((p, index) => {
    if (p !== null && p.type === piece.type && p.color === piece.color) {
      return index;
    }
    // Filtra per pezzi esistenti
  }).filter(Number.isInteger).map((piece_index) => {
    const row = 'abcdefgh'[piece_index % 8];
    const column = Math.ceil((64 - piece_index) / 8);
    return row + column;
  });
};

const ChessPiece = ({ piece, isVisible }) => {
  const className = isVisible ? '' : 'hidden';
  const pieceClass = piece ? `${piece.color}${piece.type}`.toLowerCase() : '';
  return <div className={`chess-piece ${pieceClass} ${className}`}></div>;
};


const cloneChessBoard = (board) => {
  return new Chess(board.fen());
}

export {
  generateBoard,
  getPiecePosition,
  calculateRanks,
  seededRandom,
  weightFunction,
  selectPiece,
  getRandomValue,
  calculateTotalWeight,
  calculatePieceWeights,
  handleSpecialCase,
  getDefaultFilteredPieces,
  filterPieces,
  calculateMedian,
  getRandomPieceValue,
  findChessPiecesWithRank,
  ChessPiece,
  cloneChessBoard,
};
