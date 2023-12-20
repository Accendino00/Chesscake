var { Chess } = require("chess.js");
var {
  generateBoard,
  findChessPiecesWithRank,
  calculateRanks,
  getPiecePosition,
  cloneChessBoard,
  generateBoardWithSeed,
} = require("./boardFunctions");
var { clientMDB } = require("../dbmanagement");

var chessGames = [];

module.exports = {
  chessGames,

  /**
   * Genera una partita di scacchi con le impostazioni passate
   *
   * @param {string} gameId L'id della partita
   * @param {string} player1 L'username dell'utente 1
   * @param {string} player2 L'username dell'utente 2
   * @param {object} settings Contiene i settings del gioco
   */
  createNewGameWithSettings: async function (player1, player2, settings) {
    // I settings sono fatti nel seguente modo:
    // {
    //     "mode": "playerVsComputer", "dailyChallenge", "playerVsPlayerOnline",
    //     "rank": <numero>
    //     "duration": <numero> // In minuti, indica il tempo della partita. 0.25 corrisponde a 15 secondi per esempio.
    // }

    // Generiamo un gameId univoco
    let gameId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    
    let board = new Chess();
    let seed = 0;
    board.clear();

    let values = {};

    // Se è la daily challenge, allora impostiamo lo stesso rank per tutti
    if (settings.mode == "dailyChallenge") {
      values = generateBoardWithSeed("dailyChallenge", 18747, 50);
    } else if (settings.mode == "playerVsPlayerOnline") {
      values = generateBoardWithSeed("playerVsPlayerOnline", 0, 50);
    } else if (settings.mode == "kriegspiel") {
      values = { board: new Chess(), seed: "nonrandom" };
      values.board.fen();
      values.board._header.FEN = values.board.fen();
    } else{
      // In caso contrario lo generiamo in modo casuale
      values = generateBoardWithSeed(null, 0, settings.rank);
    }


    board = values.board;
    seed = values.seed;

    // Prendi l'elo dei giocatori dal backend
    let eloPlayer1 = 0;
    let eloPlayer2 = 0;
    if (settings.mode === "playerVsPlayerOnline") {
      const db = clientMDB.db("ChessCake");
      const collection = db.collection("Users");

      // Prendiamo l'elo del giocatore 1
      eloPlayer1 = await collection
        .find({ username: player1 })
        .limit(1)
        .toArray();

      eloPlayer1 = eloPlayer1.length == 1 ? eloPlayer1[0].rbcELO : 400;

      // Prendiamo l'elo del giocatore 2
      eloPlayer2 = await collection
        .find({ username: player2 })
        .limit(1)
        .toArray();

      eloPlayer2 = eloPlayer2.length == 1 ? eloPlayer2[0].rbcELO : eloPlayer1;
    }

    let sidePlayer1 = Math.random() < 0.5 ? "w" : "b";
    // Aggiungiamo la partita di scacchi
    chessGames.push({
      gameSettings: {
        mode: settings.mode,
        rank: settings.rank,
        duration: settings.duration,
      },
      player1: {
        username: player1,
        timer: settings.duration * 60,
        interval: null,
        side: "b",
        elo: eloPlayer1,
      },
      player2: {
        username: player2,
        timer: settings.duration * 60,
        interval: null,
        side: "w",
        elo: eloPlayer2,
      },

      lastMove: 'b', // "w" o "b" per indicare chi ha mosso per ultimo
      lastMoveTargetSquare: null, // Casella di arrivo dell'ultima mossa
      lastMoveChessPiece: null, // Pezzo che è stato mosso per ultimo

      matches: {
        seed: seed, // Seed per generare la board
        dataOraInizio: new Date().toISOString(), // Data e ora di inizio della partita
        dataOraFine: null, // Data e ora di fine della partita
      },

      gameSaved: false,

      gameOver: {
        isGameOver: false,
        winner: null, // Username dell'utente che ha visto
        reason: null, // "checkmate", "timeout", "resign", "stalemate", "draw", "insufficient_material", "threefold_repetition", "50_move_rule", "agreement"
        deleteGameInterval: null, // Intervallo che cancella la partita dopo un certo tempo dopo che è finita
      },

      gameId: gameId,
      chess: board,
    });

    // Ritorniamo l'id della partita e le chiavi dei giocatori
    return {
      gameId: gameId,
    };
  },
  joinGame: async function (gameId, player2) {
    // Cerca la partita di scacchi
    var game = chessGames.find((game) => game.gameId == gameId);

    // Aggiungiamo il giocatore 2
    game.player2.username = player2;

    const db = clientMDB.db("ChessCake");
    const collection = db.collection("Users");

    // Impostiamo l'elo del giocatore 2
    // Prendiamo l'elo del giocatore 2
    let eloPlayer2 = await collection
      .find({ username: player2 })
      .limit(1)
      .toArray();

    eloPlayer2 = eloPlayer2.length == 1 ? eloPlayer2[0].rbcELO : 400;

    game.player2.elo = eloPlayer2;
  },

  /**
   * Ricerchiamo la partita e la ritorniamo usando l'id
   *
   * @param {string} gameId Id univoco della partita
   * @returns L'elemento dell'array che corrisponde alla partita
   */
  getGame: function (gameId) {
    // Cerca la partita di scacchi
    var game = chessGames.find((game) => game.gameId == gameId);
    // Ritorna la board
    return game;
  },

  getEmptyGames: function () {
    var emptyGames = [];
    chessGames.forEach((game) => {
      if (
        game.player2.username == null &&
        game.gameSettings.mode == "playerVsPlayerOnline"
      ) {
        emptyGames.push(game);
      }
    });

    return emptyGames;
  },

  getKEmptyGames: function () {
    let emptyGames = [];
    chessGames.forEach((game) => {
      if (
        game.player2.username == null &&
        game.gameSettings.mode == "kriegspiel"
      ) {
        emptyGames.push(game);
      }
    });

    return emptyGames;
  },
  /**
   * Funzione che aggiunge una mossa al gioco con id gameId
   *
   * @param {string} gameId
   * @param {string} move
   * @returns true se la mossa è stata aggiunta, false altrimenti
   */

  /**
   *
   * @param {string} game  game id univoco della partita
   * @param {string} winner giocaore che ha vinto
   * @param {string} reason motivo della vittoria
   */
  // Funzione per gestire gli scenari di fine partita
  handleGameOver: function (game, winner, reason) {
    // Fermiamo per sicurezza tutti gli intervalli
    if (game.player1.interval !== null) clearInterval(game.player1.interval);
    if (game.player2.interval !== null) clearInterval(game.player2.interval);

    // Impostiamo il game over
    game.gameOver.isGameOver = true;
    game.gameOver.winner = winner;
    game.gameOver.reason = reason;

    let returnValue = false;

    if (!game.gameSaved) {
      game.gameSaved = true;
      if (game.gameSettings.mode === "dailyChallenge") {
        returnValue = this.saveGame(game.gameId);
      } else if (game.gameSettings.mode === "playerVsPlayerOnline") {
        returnValue = this.changeElo(game.player1, game.player2, winner);
        returnValue = this.saveGame(game.gameId);
      } else if (game.gameSettings.mode === "playerVsComputer") {
        returnValue = this.changeRank(
          game.player1,
          game.gameSettings.rank,
          winner
        );
        returnValue = this.saveGame(game.gameId);
      }
    }

    // Imposto un timer che cancella questo game dopo 10 minuti
    setTimeout(() => {
      chessGames.splice(chessGames.indexOf(game), 1);
    }, 1000 * 60 * 10);

    return returnValue;
  },

  /**
   *
   * @param {string} gameId  id della partita
   * @param {string} mossa mosssa da effettuare
   * @returns se la mossa è valida
   */
  // Funzione movePiece che gestisce le mosse e controlla che c'è uno stato di game over
  movePiece: function (gameId, mossa) {
    // Trova la partita di scacchi
    let game = chessGames.find((game) => game.gameId == gameId);
    // Catch nel caso la mossa risulti non valida
    let check = null;
    let chessMove = null;
    try {
      chessMove = new Chess(game.chess.fen());

      //Riporto tutti i dati della partita, poiché chess.js non ha nessun metodo di clonazione
      chessMove._kings = game.chess._kings;
      chessMove._turn = game.chess._turn;
      chessMove._castling = game.chess._castling;
      chessMove._en_passant = game.chess._en_passant;
      chessMove._half_moves = game.chess._half_moves;
      chessMove._move_number = game.chess._move_number;
      chessMove._history = game.chess._history;
      
      // Effettua la mossa
      check = chessMove.move(mossa);
      game.chess = new Chess();
      game.chess = chessMove;
      //Riporto indietro tutti i dati della partita, poiché chess.js non ha nessun metodo di clonazione
      game.chess._header.FEN = chessMove.fen();
      game.chess._kings = chessMove._kings;
      game.chess._castling = chessMove._castling;
      game.chess._en_passant = chessMove._en_passant;
      game.chess._half_moves = chessMove._half_moves;
      game.chess._move_number = chessMove._move_number;
      game.chess._history = chessMove._history;
      game.chess._turn = chessMove._turn;
      game.chess._board = chessMove._board;

      game.lastMove = game.chess.turn() === "w" ? "b" : "w"; // Aggiorna di chi è il turno
      game.lastMoveTargetSquare = mossa.to; // Aggiorna la casella di arrivo dell'ultima mossa
      game.lastMoveChessPiece = mossa.piece; // Aggiorna il pezzo che è stato mosso per ultimo
    } catch (error) {
      return false;
    }
    // Se la mossa è valida
    if (check !== null) {
      let currentPlayerTurn =
        game.chess._turn === game.player1.side ? "p2" : "p1";
      // Controlla se c'è uno scacco matto
      if (game.chess.isCheckmate()) {
        this.handleGameOver(game, currentPlayerTurn, "checkmate");
      } else if (
        game.chess.isStalemate() ||
        game.chess.isThreefoldRepetition() ||
        game.chess.isInsufficientMaterial()
      ) {
        // Controlla se c'è stallo, pareggio o materiale insufficiente
        this.handleGameOver(game, currentPlayerTurn, "stall");
      } else {
        // Aggiorna il timer per interrompere l'ultimo intervallo
        // e avviare l'intervallo per il giocatore che deve muovere
        // Se sono definiti
        if (game.player1.interval !== null)
          clearInterval(game.player1.interval);
        if (game.player2.interval !== null)
          clearInterval(game.player2.interval);

        if (currentPlayerTurn === "p1") {
          game.player1.interval = setInterval(() => {
            game.player1.timer--;

            // Controlla se il tempo del giocatore 1 è scaduto
            if (game.player1.timer <= 0) {
              clearInterval(game.player1.interval);

              // Gestisci il timeout del giocatore 1 (sconfitta)
              if (!game.gameOver.isGameOver) {
                this.handleGameOver(game, "p1", "timeout");
              }
            }
          }, 1000);
        } else {
          game.player2.interval = setInterval(() => {
            game.player2.timer--;

            // Controlla se il tempo del giocatore 2 è scaduto
            if (game.player2.timer <= 0) {
              clearInterval(game.player2.interval);

              // Gestisci il timeout del giocatore 2 (sconfitta)
              if (!game.gameOver.isGameOver) {
                this.handleGameOver(game, "p2", "timeout");
              }
            }
          }, 1000);
        }
      }
      chessGames = chessGames.filter((match) => match.gameId !== gameId);
      chessGames.push(game);
      return true; // Mossa riuscita
    } else {
      return false; // Mossa non valida"
    }
  },

  /**
   * Funzione che prende i risultati di una partita DailyChallenge e li salva nel database
   *
   * @param {string} gameId
   * @param {string} move
   * @returns true se la mossa è stata aggiunta, false altrimenti
   */

  saveGame: function (gameId) {
    // Cerca la partita di scacchi
    var game = chessGames.find((game) => game.gameId == gameId);

    // Salva i risultati
    const db = clientMDB.db("ChessCake");
    const collection = db.collection("GamesRBC");
    collection.insertOne({
      Player1: game.player1,
      Player2: game.player2,
      Player1Elo: game.player1.elo,
      Player2Elo: game.player2.elo,
      Player1Gain:
        this.calculateEloChange(
          game.player1.elo,
          game.player2.elo,
          game.gameOver.winner === "p1" ? "p1" : "p2"
        ) - game.player1.elo,
      Player2Gain:
        this.calculateEloChange(
          game.player2.elo,
          game.player1.elo,
          game.gameOver.winner === "p2" ? "p1" : "p2"
        ) - game.player2.elo,
      matches: {
        mode: game.gameSettings.mode,
        seed: game.matches.seed,
        dataOraInizio: game.matches.dataOraInizio,
        moves: game.chess.history(),
        board: generateBoardWithSeed(
          game.gameSettings.mode,
          game.matches.seed,
          mode === "dailyChallenge" ? 50 : game.gameSettings.rank
        ).board._header.FEN,
        gameData: {
          turniBianco: game.chess
            .history()
            .filter((_, index) => index % 2 === 0).length,
          turniNero: game.chess
            .history()
            .filter((_, index) => index % 2 === 1).length,
          rankUsato: game.gameSettings.rank,
          vincitore: game.gameOver.winner,
          tipoVittoria: {
            tempo: game.player1.timer,
            motivo: game.gameOver.reason,
          },
        },
      },
    });
  },

  /**
    Funzione per calcolare l'elo di un giocatore alla fine di una partita
     * @param {int} eloPlayer1  Elo del giocatore 1 da cambiare 
     * @param {int} eloPlayer2 Elo dell'avversario
     * @param {string} outcome "p1" o "p2" per indicare chi ha vinto oppure "draw" per indicare un pareggio
     * @param {const} kFactor Il k factor da utilizzare per il calcolo dell'elo in base alle regole degli scacchi
     * @returns Nuovo elo del giocatore 1
     */
  calculateEloChange: function (eloPlayer1, eloPlayer2, outcome) {
    // calcolo del punteggio previsto per il giocatore 1
    let kFactor = 32;

    const expectedScorePlayer1 =
      1 / (1 + 10 ** ((eloPlayer2 - eloPlayer1) / 400));

    // moltiplicatore in base al risultato della partita
    const actualScorePlayer1 = outcome === "p1" ? 1 : 0;

    // Calcolo Elo in base al K-Factor standard utilizzato in scacchi
    if (eloPlayer1 >= 2100 && eloPlayer1 <= 2400) {
      kFactor = 24;
    }
    if (eloPlayer1 > 2400) {
      kFactor = 16;
    }
    const eloAdjustment = kFactor * (actualScorePlayer1 - expectedScorePlayer1);

    // Calcolo del nuovo Elo del giocatore 1
    const newEloPlayer1 = eloPlayer1 + eloAdjustment;

    return newEloPlayer1;
  },
  /**
   *
   * @param {string} Player1 id del giocatore 1
   * @param {string} player2 id del giocatore 2
   * @param {string} outcome risultato della partita
   */

  // Funzione per incapsulare la chiamata per cambiare l'elo dei giocatori e facilitare le chiamate nelle varie casistiche di game over
  changeElo: function (player1, player2, outcome) {
    let nuovoEloPlayer1 = 0;
    let nuovoEloPlayer2 = 0;
    if (outcome === "p1") {
      nuovoEloPlayer1 = Math.round(this.calculateEloChange(player1.elo, player2.elo, "p1"));
      nuovoEloPlayer2 = Math.round(this.calculateEloChange(player2.elo, player1.elo, "p2"));
    } else {
      nuovoEloPlayer1 = Math.round(this.calculateEloChange(player1.elo, player2.elo, "p2"));
      nuovoEloPlayer2 = Math.round(this.calculateEloChange(player2.elo, player1.elo, "p1"));
    }

    // Aggiorniamo i valori nel database
    const db = clientMDB.db("ChessCake");
    const collection = db.collection("Users");

    // Aggiorniamo il giocatore 1
    collection.updateOne(
      { username: player1.username },
      { $set: { rbcELO: nuovoEloPlayer1 } }
    );

    // Aggiorniamo il giocatore 2
    collection.updateOne(
      { username: player2.username },
      { $set: { rbcELO: nuovoEloPlayer2 } }
    );
  },

  calculateRankDiff(rank, increase) {
    if (increase) {
      return Math.round(Math.exp(-0.01 * rank + 2.31) + 5);
    } else if (rank - Math.exp(-0.01 * rank + 2.31) + 5 > 0) {
      return Math.round(-(Math.exp(-0.01 * rank + 2.31) + 5));
    } else {
      return 0;
    }
  },

  changeRank: function (player1, gameRank, outcome) {
    // Il rank aumenta solo per il player1, il player2 sarà il computer
    // Il rank aumenta solo se il player1 vince, diminuisce se perde
    // L'aumento del rank è gradualmente più basso più il rank è alto
    let nuovoRankPlayer1 = gameRank;

    // Capiamo se ha vinto ho perso
    if (outcome === "p1") {
      // Aumentiamo il rank di un valore compreso tra 15 e 5, in base al rank ()
      nuovoRankPlayer1 = gameRank + this.calculateRankDiff(gameRank, true);
    } else {
      // Diminuiamo il rank
      nuovoRankPlayer1 = gameRank + this.calculateRankDiff(gameRank, false);
    }

    // Aggiorniamo i valori nel database
    const db = clientMDB.db("ChessCake");
    const collection = db.collection("Users");

    // Aggiorniamo il giocatore 1
    collection.updateOne(
      { username: player1.username },
      { $set: { rbcCurrentRank: nuovoRankPlayer1 } }
    );
  },

};
