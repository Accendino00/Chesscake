let { Chess } = require("chess.js");
const seedrandom = require('seedrandom');
let rng = null;

//Pezzi standard
let pieces = [
  { name: "p", value: 1 },
  { name: "n", value: 3 },
  { name: "b", value: 3 },
  { name: "r", value: 5 },
  { name: "q", value: 9 },
];
/**
 * Genera una lista di pezzi di scacchi con un valore totale approssimativo
 * @param {int} rank Il rank della partita, influenzando la somma dei valori dei pezzi per ognuno dei lati.
 * @param {int} seed  Il seme per la generazione dei pezzi
 * @returns  {Array} Un array di oggetti pezzo con nome e valore
 */
function findChessPiecesWithRank(rank, seed) {
  const selectedPieces = [];
  rng = seedrandom(seed);

  //Prendo il valore del pezzo in base al seed
  let overallValue = getRandomPieceValue(seed);
  const median = calculateMedian(rank);

  //Ciclo per la fila dietro, senza pedoni
  pieces = [
    { name: "n", value: 3 },
    { name: "b", value: 3 },
    { name: "r", value: 5 },
    { name: "q", value: 9 },
  ];

  for (let i = 0; i < 8; i++) {
    //Filtro i pezzi in base al valore
    let filteredPieces = filterPieces(pieces, overallValue, median, i);

    //Se non ci sono pezzi con quel valore, prendo il pezzo più vicino
    if (filteredPieces.length === 0) {
      filteredPieces = getDefaultFilteredPieces(overallValue, median, i);
    }

    //Gestione pezzi randomici per alternare alfiere e cavallo
    filteredPieces = handleSpecialCase(filteredPieces, seed, i);

    //Calcolo il peso individuale del pezzo
    const pieceWeights = calculatePieceWeights(
      filteredPieces,
      overallValue,
      median,
      i
    );
    //Calcolo il peso totale dei pezzi
    const totalWeight = calculateTotalWeight(pieceWeights);
    const randomValue = seed === 0 ? Math.random() : rng() * totalWeight;

    //Seleziono il pezzo più adatto al peso che abbiamo richiesto
    const selected = selectPiece(filteredPieces, pieceWeights, randomValue);

    overallValue +=
      overallValue / (i + 1) < median
        ? selected.value * 1.3
        : -selected.value * 0.7;
    selectedPieces.push(selected);
  }

  // Ciclo per la fila davanti, senza regine
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

    const pieceWeights = calculatePieceWeights(
      filteredPieces,
      overallValue,
      median,
      i
    );
    const totalWeight = calculateTotalWeight(pieceWeights);
    const randomValue = seed === 0 ? Math.random() : rng() * totalWeight;
    const selected = selectPiece(filteredPieces, pieceWeights, randomValue);

    overallValue +=
      overallValue / (i + 1) < median
        ? selected.value * 0.7
        : -selected.value * 1.3;
    selectedPieces.push(selected);
  }

  return selectedPieces;
}

// Funzione per ottenere il valore del pezzo
function getRandomPieceValue(seed) {
  return pieces[
    Math.floor(
      (seed === 0 ? Math.random() : rng()) * pieces.length
    )
  ].value;
}

function calculateMedian(rank) {
  return rank / 15;
}

//Funzione per filtrare i pezzi in base alla mediana
function filterPieces(pieces, overallValue, median, i) {
  return pieces.filter((piece) =>
    Math.floor(overallValue / (i + 1)) < median
      ? piece.value >= median
      : piece.value <= median
  );
}

function getDefaultFilteredPieces(overallValue, median, i) {
  return overallValue / (i + 1) < median
    ? [pieces[pieces.length - 1]]
    : [pieces[0]];
}
// Funzione per gestire la randomicità di alfiere e cavallo attraverso lo shift decimale del seed
function handleSpecialCase(filteredPieces, seed, i) {
  if (filteredPieces.some((piece) => piece.value === 3)) {
    filteredPieces = filteredPieces.filter((piece) => piece.value !== 3);
    const randomDecimal = seed === 0 ? Math.random() : rng();
    const randomPiece =
      parseInt(randomDecimal.toString().split(".")[1].charAt(i)) < 5
        ? "b"
        : "n";
    filteredPieces.push({ name: randomPiece, value: 3 });
  }
  return filteredPieces;
}

// Funzione per calcolare il peso del pezzo
function calculatePieceWeights(filteredPieces, overallValue, median, i) {
  return filteredPieces.map((piece) =>
    weightFunction(piece.value, overallValue / (i + 1), median, 4)
  );
}

// Funzione per calcolare il peso totale
function calculateTotalWeight(pieceWeights) {
  return pieceWeights.reduce((acc, weight) => acc + weight, 0);
}

// Funzione per generare un numero casuale
function getRandomValue(seed) {
  const rng = seedrandom(seed);
  return seed === 0 ? Math.random() : rng();
}

// Funzione per selezionare il pezzo in base al suo peso
function selectPiece(filteredPieces, pieceWeights, randomValue) {
  let cumulativeWeight = 0;
  let selected = filteredPieces[filteredPieces.length - 1]; // Initialize with the last piece

  if (selected.name === "q" && filteredPieces.length > 1) {
    selected = filteredPieces[filteredPieces.length - 2]; // Select the penultimate piece
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

/**
 * Genera una scacchiera personalizzata basata sulla modalità e il rango forniti.
 * In modalità 'dailyChallenge', la configurazione è determinata da un seme giornaliero.
 * Negli altri modi, la configurazione è randomizzata. Imposta i pezzi sulla scacchiera in base
 * ai ranghi calcolati e alle posizioni specifiche, con i re sempre in 'e1' ed 'e8'.
 *
 * @param {string} mode La modalità di gioco, influenzando la generazione del seme.
 * @param {string} rank Il rank della partita, influenzando la somma dei valori dei pezzi per ognuno dei lati.
 *                      Rank < 50 corrisponde a vantaggio per bianco, rank > 50 corrisponde a vantaggio per nero.
 * @returns {Object} Un'istanza della classe Chess rappresentante la scacchiera inizializzata.
 */
function generateBoard(mode, rank) {
  const newChess = new Chess();

  newChess.clear();

  // Caricamento pezzi
  let seed = 0;

  const [playerRank, opponentRank] = calculateRanks(rank, seed);
  const whitePieces = findChessPiecesWithRank(playerRank, seed);
  const blackPieces = findChessPiecesWithRank(opponentRank, seed);

  const whiteSquares = [
    "a1",
    "b1",
    "c1",
    "d1",
    "f1",
    "g1",
    "h1",
    "a2",
    "b2",
    "c2",
    "d2",
    "e2",
    "f2",
    "g2",
    "h2",
  ];
  const blackSquares = [
    "a8",
    "b8",
    "c8",
    "d8",
    "f8",
    "g8",
    "h8",
    "a7",
    "b7",
    "c7",
    "d7",
    "e7",
    "f7",
    "g7",
    "h7",
  ];

  // Metti i pezzi disponibili in modo casuale nella fila 2
  whitePieces
    .filter((piece) => piece.name === "q")
    .forEach((piece) => {
      const validSquares = whiteSquares.filter((square) => square[1] === "1");
      const randomIndex = Math.floor(Math.random() * validSquares.length);
      const square = validSquares.splice(randomIndex, 1)[0];
      newChess.put({ type: piece.name, color: "w" }, square);
      whitePieces.splice(
        whitePieces.findIndex((p) => p === piece),
        1
      );
      whiteSquares.splice(whiteSquares.indexOf(square), 1);
    });

  whitePieces
    .filter((piece) => piece.name === "p")
    .forEach((piece) => {
      const validSquares = whiteSquares.filter((square) => square[1] === "2");
      if (validSquares.length > 0) {
        const randomIndex = Math.floor(Math.random() * validSquares.length);
        const square = validSquares.splice(randomIndex, 1)[0];
        newChess.put({ type: piece.name, color: "w" }, square);
        whitePieces.splice(
          whitePieces.findIndex((p) => p === piece),
          1
        );
        whiteSquares.splice(whiteSquares.indexOf(square), 1);
      }
    });

  //Aggiungi il resto nelle due file
  while (whiteSquares.length > 0) {
    const randomIndex = Math.floor(
      Math.random() * whiteSquares.length
    );
    newChess.put(
      { type: whitePieces.pop().name, color: "w" },
      whiteSquares[randomIndex]
    );
    whiteSquares.splice(randomIndex, 1);
  }
  newChess.put({ type: "k", color: "w" }, "e1");

  blackPieces
    .filter((piece) => piece.name === "q")
    .forEach((piece) => {
      const validSquares = blackSquares.filter((square) => square[1] === "8");
      const randomIndex = Math.floor(Math.random() * validSquares.length);
      const square = validSquares.splice(randomIndex, 1)[0];
      newChess.put({ type: piece.name, color: "b" }, square);
      blackPieces.splice(
        blackPieces.findIndex((p) => p === piece),
        1
      );
      blackSquares.splice(blackSquares.indexOf(square), 1);
    });

  blackPieces
    .filter((piece) => piece.name === "p")
    .forEach((piece) => {
      const validSquares = blackSquares.filter((square) => square[1] === "7");
      if (validSquares.length > 0) {
        const randomIndex = Math.floor(Math.random() * validSquares.length);
        const square = validSquares.splice(randomIndex, 1)[0];
        newChess.put({ type: piece.name, color: "b" }, square);
        blackPieces.splice(
          blackPieces.findIndex((p) => p === piece),
          1
        );
        blackSquares.splice(blackSquares.indexOf(square), 1);
      }
    });

  //Aggiungi il resto nelle due file
  while (blackSquares.length > 0) {
    const randomIndex = Math.floor(
      Math.random() * blackSquares.length
    );
    newChess.put(
      { type: blackPieces.pop().name, color: "b" },
      blackSquares[randomIndex]
    );
    blackSquares.splice(randomIndex, 1);
  }
  newChess.put({ type: "k", color: "b" }, "e8");

  // Inizializzazione
  return { board : newChess, seed: seed };
}

/**
 * Genera una scacchiera personalizzata basata sulla modalità e il seme forniti.
 * @param {string} mode La modalità di gioco, influenzando la generazione del seme.
 * @param {int} seedPassed Il seme per la generazione dei pezzi, se è 0 viene generato un seme casuale.
 * @param {int} rank Il rank della partita, influenzando la somma dei valori dei pezzi per ognuno dei lati.
 * @returns 
 */
function generateBoardWithSeed(mode, seedPassed, rank) {
  const newChess = new Chess();
  newChess.clear();
  let seed = 0;
  if(seedPassed!==0)
    seed = seedPassed;
  else 
    seed = generateSeed(mode);
  
  rng = seedrandom(seed);
  const [playerRank, opponentRank] = calculateRanks(rank, seed);
  const whitePieces = findChessPiecesWithRank(playerRank, seed-2);
  const blackPieces = findChessPiecesWithRank(opponentRank, seed+2);

  const whiteSquares = [
    "a1",
    "b1",
    "c1",
    "d1",
    "f1",
    "g1",
    "h1",
    "a2",
    "b2",
    "c2",
    "d2",
    "e2",
    "f2",
    "g2",
    "h2",
  ];
  const blackSquares = [
    "a8",
    "b8",
    "c8",
    "d8",
    "f8",
    "g8",
    "h8",
    "a7",
    "b7",
    "c7",
    "d7",
    "e7",
    "f7",
    "g7",
    "h7",
  ];

  // Metti i pezzi disponibili in modo casuale nella fila 2
  whitePieces
    .filter((piece) => piece.name === "q")
    .forEach((piece) => {
      const validSquares = whiteSquares.filter((square) => square[1] === "1");
      const randomIndex = Math.floor(seed === 0 ? Math.random() : rng() * validSquares.length);
      const square = validSquares.splice(randomIndex, 1)[0];
      newChess.put({ type: piece.name, color: "w" }, square);
      whitePieces.splice(
        whitePieces.findIndex((p) => p === piece),
        1
      );
      whiteSquares.splice(whiteSquares.indexOf(square), 1);
    });

  whitePieces
    .filter((piece) => piece.name === "p")
    .forEach((piece) => {
      const validSquares = whiteSquares.filter((square) => square[1] === "2");
      if (validSquares.length > 0) {
        const randomIndex = Math.floor(seed === 0 ? Math.random() : rng() * validSquares.length);
        const square = validSquares.splice(randomIndex, 1)[0];
        newChess.put({ type: piece.name, color: "w" }, square);
        whitePieces.splice(
          whitePieces.findIndex((p) => p === piece),
          1
        );
        whiteSquares.splice(whiteSquares.indexOf(square), 1);
      }
    });

  //Aggiungi il resto nelle due file
  while (whiteSquares.length > 0) {
    const randomIndex = Math.floor(
      (seed === 0 ? Math.random() : rng()) * whiteSquares.length
    );
    newChess.put(
      { type: whitePieces.pop().name, color: "w" },
      whiteSquares[randomIndex]
    );
    whiteSquares.splice(randomIndex, 1);
  }
  newChess.put({ type: "k", color: "w" }, "e1");

  blackPieces
  .filter((piece) => piece.name === "q")
  .forEach((piece) => {
    const validSquares = blackSquares.filter((square) => square[1] === "8");
    const randomIndex = Math.floor(seed === 0 ? Math.random() : rng() * validSquares.length);
    const square = validSquares.splice(randomIndex, 1)[0];
    newChess.put({ type: piece.name, color: "b" }, square);
    blackPieces.splice(
      blackPieces.findIndex((p) => p === piece),
      1
    );
    blackSquares.splice(blackSquares.indexOf(square), 1);
  });

blackPieces
  .filter((piece) => piece.name === "p")
  .forEach((piece) => {
    const validSquares = blackSquares.filter((square) => square[1] === "7");
    if (validSquares.length > 0) {
      const randomIndex = Math.floor(seed === 0 ? Math.random() : rng() * validSquares.length);
      const square = validSquares.splice(randomIndex, 1)[0];
      newChess.put({ type: piece.name, color: "b" }, square);
      blackPieces.splice(
        blackPieces.findIndex((p) => p === piece),
        1
      );
      blackSquares.splice(blackSquares.indexOf(square), 1);
    }
  });
  //Aggiungi il resto nelle due file
  while (blackSquares.length > 0) {
    const randomIndex = Math.floor(
      (seed === 0 ? Math.random() : rng()) * blackSquares.length
    );
    newChess.put(
      { type: blackPieces.pop().name, color: "b" },
      blackSquares[randomIndex]
    );
    blackSquares.splice(randomIndex, 1);
  }
  newChess.put({ type: "k", color: "b" }, "e8");
  rng=null;
  return { board : newChess, seed: seed };
}

//Funzione per generare il seed
function generateSeed(mode)
{
  if (mode === "dailyChallenge") {
    const today = new Date();
    return (((((today.getFullYear() * 100 +
      today.getMonth() * 10 +
      today.getDate()) *
      214013 +
      2531011) >>
      16) &
      0x7fff) *
      214013 +
      2531011) >>
      16 &
      0x7fff;
    }
  return Math.floor(Math.random() * 1000000);
}

// Funzione per calcolare il rank
function calculateRanks(rank, seed) {
  const value = -0.5 * rank + 25; // Funzione lineare per determinare il valore
  const baseRank = (seed === 0 ? Math.random() : seed === 0 ? Math.random() : rng()) * 10 + 25;
  let playerRank = baseRank + value / 2;
  let opponentRank = baseRank - value / 2;
  playerRank = Math.max(playerRank, 0);
  opponentRank = Math.max(opponentRank, 0);
  return [playerRank, opponentRank];
}

// Funzione per determinare la posizione del pezzo
const getPiecePosition = (game, piece) => {
  // Ritorna la posizione del pezzo se esiste
  return []
    .concat(...game.board())
    .map((p, index) => {
      if (p !== null && p.type === piece.type && p.color === piece.color) {
        return index;
      }
      // Filtra per pezzi esistenti
    })
    .filter(Number.isInteger)
    .map((piece_index) => {
      const row = "abcdefgh"[piece_index % 8];
      const column = Math.ceil((64 - piece_index) / 8);
      return row + column;
    });
};


const cloneChessBoard = (board) => {
  return new Chess(board.fen());
};

module.exports = {
  generateBoard,
  getPiecePosition,
  calculateRanks,
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
  cloneChessBoard,
  generateBoardWithSeed,
};
