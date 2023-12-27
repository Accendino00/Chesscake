const Chess = require("chess.js").Chess;
const {
  createNewGameWithSettings,
  getGame,
  movePiece,
  undoMove,
  joinGame,
  handleGameOver,
  getEmptyGames,
  checkThreefoldRepetition,
  checkFiftyMoveRule,
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
  });

  //Crea un game con le impostazioni desiderate
  test('Create a new game with settings', async () => {
    const result = await createNewGameWithSettings(player1, player2, gameSettings);
    expect(result).toHaveProperty('gameId');
  });

  //Entra in un game e lo riestrae
  test('Join a game', async () => {
    const newGame = await createNewGameWithSettings(player1, player2, gameSettings);

    // Simula il join del secondo giocatore
    await joinGame(newGame.gameId, 'player2');

    // Ottieni la partita e assicurati che il giocatore 2 sia stato aggiunto correttamente
    const joinedGame = getGame(newGame.gameId);
    expect(joinedGame.player2.username).toEqual('player2');
  });

  //Controlla la funzione EmptyGames
  test('Empty games array', () => {
    expect(getEmptyGames()).toEqual([]);
  });

  test('Create a kriespiel game, and check for the Threefold repetition rule', async () => {
    gameSettingsKriespiel = {
      settings:{
        mode: 'kriegspiel',  // Imposta la modalità desiderata per il test
        rank: 20,
        duration: 15,
      }
    };
    const newGame = await createNewGameWithSettings(player1, player2, gameSettingsKriespiel);
    const chess = new Chess();
    chess.move('e2e4');
    checkThreefoldRepetition(newGame.gameId, chess);
  });

  test('Create a kriespiel game, and check for the FiftyMoveRule', async () => {
    gameSettingsKriespiel = {
      settings:{
        mode: 'kriegspiel',  // Imposta la modalità desiderata per il test
        rank: 20,
        duration: 15,
      }
    };
    const newGame = await createNewGameWithSettings(player1, player2, gameSettingsKriespiel);
    const chess = new Chess();
    chess.move('e2e4');
    checkFiftyMoveRule(newGame.gameId, chess);
  });
  
  test('Calculate expected score for player 1', () => {
    const eloPlayer1 = 1500;
    const eloPlayer2 = 1600;
    const expectedScorePlayer1 = 1 / (1 + 10 ** ((eloPlayer2 - eloPlayer1) / 400));
    expect(expectedScorePlayer1).toBeCloseTo(0.359935, 6);
  });

  test('Calculate expected score for player 1 with different Elo ratings', () => {
    const eloPlayer1 = 1800;
    const eloPlayer2 = 2000;
    const expectedScorePlayer1 = 1 / (1 + 10 ** ((eloPlayer2 - eloPlayer1) / 400));
    expect(expectedScorePlayer1).toBeCloseTo(0.240253, 6);
  });
  
});