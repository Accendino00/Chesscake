let {Chess} = require('chess.js');
let {
  generateBoard,
  generateBoardWithSeed,
  findChessPiecesWithRank,
  getRandomPieceValue,
  calculateMedian,
  filterPieces,
  getDefaultFilteredPieces,
  handleSpecialCase,
  calculatePieceWeights,
  calculateTotalWeight,
  getRandomValue,
  selectPiece,
  weightFunction,
  calculateRanks,
  getPiecePosition,
  rng
} = require('./../code/backend/utils/chess/boardFunctions');

describe('generateBoard', () => {

  //Genera una nuova Board
  test('should generate a new Chess board', () => {
    const mode = 'dailyChallenge';
    const rank = 1;
    const chessBoard = generateBoard(mode, rank);
    expect(typeof chessBoard.board.fen).toBe('function');
  });

  //Controlla che i pezzi siano nelle prime due righe e nelle ultime due
  test('should have pieces in the first two rows and the last two rows of the chessboard', () => {
    const mode = 'dailyChallenge';
    const rank = 1;
    let chessBoard1 = new Chess();
    chessBoard = generateBoard(mode, rank);
    const fen = chessBoard.board.fen();
    const rows = fen.split(' ')[0].split('/');
    const piecesInFirstTwoRows = rows.slice(0, 2);
    const piecesInLastTwoRows = rows.slice(6, 8);
    const expectedPieces = ['p', 'n', 'b', 'r', 'q', 'k', 'P', 'N', 'B', 'R', 'Q', 'K'];

    expect(piecesInFirstTwoRows).toHaveLength(2);
    expect(piecesInLastTwoRows).toHaveLength(2);

    piecesInFirstTwoRows.forEach(row => {
      expect(row).toHaveLength(8);
      expect(row.split('').every(piece => expectedPieces.includes(piece))).toBeTruthy();
    });

    piecesInLastTwoRows.forEach(row => {
      expect(row).toHaveLength(8);
      expect(row.split('').every(piece => expectedPieces.includes(piece))).toBeTruthy();
    });
  });

  //Controlla che ci siano solo pezzi dello stesso colore su ogni lato
  test('should have pieces only of the same color on each side', () => {
    const mode = 'dailyChallenge';
    const rank = 1;
    const chessBoard = generateBoard(mode, rank);
    const fen = chessBoard.board.fen();
    const whitePieces = fen.match(/[PNBRQK]/g);
    const blackPieces = fen.match(/[pnbrqk]/g);
    expect(whitePieces).toHaveLength(16);
    expect(blackPieces).toHaveLength(16);
  });
});

describe('generateBoardWithSeed', () => {

  //Genera una nuova Board
  test('should generate a new Chess board', () => {
    const mode = 'dailyChallenge';
    const rank = 1;
    const chessBoard = generateBoardWithSeed(mode, 0, rank);
    expect(typeof chessBoard.board.fen).toBe('function');
  });

  //Controlla che la daily ritorni la stessa board
  test('should generate the same board for the same day', () => {
    const mode = 'dailyChallenge';
    const rank = 1;
    let chessBoard1 = new Chess();
    let chessBoard2 = new Chess();
    chessBoard1 = generateBoardWithSeed(mode, 0, rank);
    chessBoard2 = generateBoardWithSeed(mode, 0, rank);
    expect(chessBoard1.board.fen()).toBe(chessBoard2.board.fen());
  });

  //Controlla che i pezzi siano nelle prime due righe e nelle ultime due
  test('should have pieces in the first two rows and the last two rows of the chessboard', () => {
    const mode = 'dailyChallenge';
    const rank = 1;
    let chessBoard1 = new Chess();
    chessBoard = generateBoardWithSeed(mode, 0, rank);
    const fen = chessBoard.board.fen();
    const rows = fen.split(' ')[0].split('/');
    const piecesInFirstTwoRows = rows.slice(0, 2);
    const piecesInLastTwoRows = rows.slice(6, 8);
    const expectedPieces = ['p', 'n', 'b', 'r', 'q', 'k', 'P', 'N', 'B', 'R', 'Q', 'K'];

    expect(piecesInFirstTwoRows).toHaveLength(2);
    expect(piecesInLastTwoRows).toHaveLength(2);

    piecesInFirstTwoRows.forEach(row => {
      expect(row).toHaveLength(8);
      expect(row.split('').every(piece => expectedPieces.includes(piece))).toBeTruthy();
    });

    piecesInLastTwoRows.forEach(row => {
      expect(row).toHaveLength(8);
      expect(row.split('').every(piece => expectedPieces.includes(piece))).toBeTruthy();
    });
  });

  //Controlla che ci siano solo pezzi dello stesso colore su ogni lato
  test('should have pieces only of the same color on each side', () => {
    const mode = 'dailyChallenge';
    const rank = 1;
    const chessBoard = generateBoardWithSeed(mode, 0, rank);
    const fen = chessBoard.board.fen();
    const whitePieces = fen.match(/[PNBRQK]/g);
    const blackPieces = fen.match(/[pnbrqk]/g);
    expect(whitePieces).toHaveLength(16);
    expect(blackPieces).toHaveLength(16);
  });
});


describe('findChessPiecesWithRank', () => {
  //Ritorna un array di pezzi con il rank selezionato
  test('should return an array of selected chess pieces', () => {
    const rank = 15;
    const selectedPieces = findChessPiecesWithRank(rank, 0);
    const expectedValue = (rank)/15;
    const sumOfValues = selectedPieces.reduce((sum, piece) => sum + piece.value, 0);
    const averageValue = sumOfValues / 15;
    
    expect(averageValue).toBeCloseTo(expectedValue,-1);
  });
});

//Ritorna un pezzo casuale
describe('getRandomPieceValue', () => {
  test('should return a random piece value', () => {
    const seed = 12345;
    const randomPieceValue = getRandomPieceValue(seed);
    expect(randomPieceValue).toBeGreaterThanOrEqual(1);
    expect(randomPieceValue).toBeLessThanOrEqual(9);
  });
});

//Ritorna la mediana
describe('calculateMedian', () => {
  test('should calculate the median value', () => {
    const rank = 1;
    const median = calculateMedian(rank);
    expect(median).toBe(0.06666666666666667);
  });
});

describe('filterPieces', () => {
  //Filtra i pezzi in base al valore complessivo e alla mediana
  test('should filter the pieces based on overall value and median', () => {
    const pieces = [
      { name: "p", value: 1 },
      { name: "n", value: 3 },
      { name: "b", value: 3 },
      { name: "r", value: 5 },
      { name: "q", value: 9 }
    ];
    const overallValue = 3;
    const median = 2;
    const filteredPieces = filterPieces(pieces, overallValue, median, 0);
    expect(filteredPieces.every(piece => piece.value <= median)).toBeTruthy();
  });
});

describe('getDefaultFilteredPieces', () => {
  //Filtra i pezzi in base al valore complessivo e alla mediana
  test('should return default filtered pieces based on overall value and median', () => {
    const overallValue = 3;
    const median = 2;
    const defaultFilteredPieces = getDefaultFilteredPieces(overallValue, median, 0);
    expect(defaultFilteredPieces).toEqual([{ name: "p", value: 1 }]);
  });
});

describe('handleSpecialCase', () => {
  //Gestisce il caso speciale e ritorna i pezzi filtrati e controlla se ci sia il pezzo "b"
  test('should handle special case and return filtered pieces', () => {
    const filteredPieces = [
      { name: "p", value: 1 },
      { name: "n", value: 3 },
      { name: "b", value: 3 },
      { name: "r", value: 5 },
      { name: "q", value: 9 }
    ];
    const seed = 12345;
    const i = 0;
    const handledPieces = handleSpecialCase(filteredPieces, seed, i);
    expect(handledPieces).toEqual(expect.arrayContaining([{ name: "b", value: 3 }]));
  });
});

describe('calculatePieceWeights', () => {
  //Calcola i pesi dei pezzi filtrati e controlla che siano in ordine decrescente
  test('should calculate the weights of filtered pieces', () => {
    const filteredPieces = [
      { name: "p", value: 1 },
      { name: "n", value: 3 },
      { name: "b", value: 3 },
      { name: "r", value: 5 },
      { name: "q", value: 9 }
    ];
    const overallValue = 3;
    const median = 2;
    const i = 0;
    const pieceWeights = calculatePieceWeights(filteredPieces, overallValue, median, i);
    for (let j = 1; j <= 4; j++) {
      expect(pieceWeights[0]).toBeGreaterThan(pieceWeights[j]);
    }
  });
});

describe('calculateTotalWeight', () => {
  //Calcola il peso totale dei pezzi sommati
  test('should calculate the total weight of piece weights', () => {
    const pieceWeights = [0.5, 0.5, 0.5, 0.5, 0.5];
    const totalWeight = calculateTotalWeight(pieceWeights);
    expect(totalWeight).toBe(2.5);
  });
});

describe('getRandomValue', () => {
  //Ritorna un valore casuale
  test('should return a random value', () => {
    const seed = 12345;
    const randomValue = getRandomValue(seed);
    expect(randomValue).toBeGreaterThanOrEqual(0);
    expect(randomValue).toBeLessThanOrEqual(1);
  });
});

describe('selectPiece', () => {
  //Seleziona un pezzo in base al valore casuale e ai pesi dei pezzi, facendo ritornare n poiché il valore casuale è 1
  test('should select a piece based on random value and piece weights', () => {
    const filteredPieces = [
      { name: "p", value: 1 },
      { name: "n", value: 3 },
      { name: "b", value: 3 },
      { name: "r", value: 5 },
      { name: "q", value: 9 }
    ];
    const pieceWeights = [0.5, 0.5, 0.5, 0.5, 0.5];
    const randomValue = 1;
    const selectedPiece = selectPiece(filteredPieces, pieceWeights, randomValue);
    expect(selectedPiece).toEqual({ name: "n", value: 3 });
  });
});

describe('weightFunction', () => {
  //Calcola il peso complessivo di un pezzo
  test('should calculate the weight of a piece', () => {
    const value = 3;
    const overallValue = 4;
    const median = 2;
    const weight = weightFunction(value, overallValue, median);
    expect(weight).toBe(0.5);
  });
});

describe('calculateRanks', () => {
  //Calcolo dei rank
  test('should calculate the player and opponent ranks', () => {
    const rank = 0;
    const seed = 12345;
    const [playerRank, opponentRank] = calculateRanks(rank, seed);
    expect(Math.round(playerRank - opponentRank)).toBe(25);
  });

  test('should calculate equal player and opponent ranks', () => {
    const rank = 50;
    const seed = 12345;
    const [playerRank, opponentRank] = calculateRanks(rank, seed);
    expect(playerRank).toBe(opponentRank);
  });

  test('should calculate the player and opponent ranks with reversed difference', () => {
    const rank = 100;
    const seed = 12345;
    const [playerRank, opponentRank] = calculateRanks(rank, seed);
    expect(opponentRank - playerRank).toBe(25);
  });
});

describe('getPiecePosition', () => {
  //Ritorna la posizione di un specifico pezzo con un colore specifico
  test('should return the position of a piece', () => {
    const game = new Chess();
    const piece = { type: 'p', color: 'w' };
    const position = getPiecePosition(game, piece);
    expect(position).toEqual(expect.arrayContaining(['a2']));
  });
});