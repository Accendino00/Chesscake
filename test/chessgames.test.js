const Chess = require("chess.js").Chess;
const {
  createNewGameWithSettings,
  getGame,
  movePiece,
  undoMove,
  joinGame,
  handleGameOver,
  getEmptyGames,
} = require("../code/backend/utils/chess/chessgames");

describe('Chess Module Tests', () => {
  let gameSettings;
  let player1;
  let player2;

  beforeEach(() => {
    // Inizializza le variabili necessarie prima di ogni test
    gameSettings = {
      settings:{
        mode: 'playerVsComputer',  // Imposta la modalità desiderata per il test
        rank: 20,
        duration: 15,
      }
    };
    player1 = 'player1';
    player2 = 'player2';
  });

  afterEach(() => {
    // Ripristina le variabili o stato necessario dopo ogni test
  });

  test('Create a new game with settings', async () => {
    const result = await createNewGameWithSettings(player1, player2, gameSettings);
    // Assicurati che il risultato contenga un gameId
    expect(result).toHaveProperty('gameId');
  });

  test('Join a game', async () => {
    const newGame = await createNewGameWithSettings(player1, player2, gameSettings);

    // Simula il join del secondo giocatore
    await joinGame(newGame.gameId, 'player2');

    // Ottieni la partita e assicurati che il giocatore 2 sia stato aggiunto correttamente
    const joinedGame = getGame(newGame.gameId);
    expect(joinedGame.player2.username).toEqual('player2');
  });
  test('Empty games array', () => {
    expect(getEmptyGames()).toEqual([]);
  });

  
  
});