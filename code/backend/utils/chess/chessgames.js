var { Chess } = require("chess.js");
var {
  generateBoard,
  getPiecePosition,
  cloneChessBoard,
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
  createNewGameWithSettings: function (player1, player2, settings) {
    // I settings sono fatti nel seguente modo:
    // {
    //     "mode": "playerVsComputer", "dailyChallenge", "playerVsPlayerOnline",
    //     "rank": <numero>
    //     "duration": <numero> // In minuti, indica il tempo della partita. 0.25 corrisponde a 15 secondi per esempio.
    // }

    // Generiamo un gameId univoco
    var gameId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Generiamo la board in modo casuale
    var board = null;

    // Se è la daily challenge, allora impostiamo lo stesso rank per tutti
    if (settings.mode == "dailyChallenge") {
      board = generateBoard(20, "dailyChallenge");
    } else {
      // In caso contrario lo generiamo in modo casuale
      board = generateBoard(settings.rank, null);
    }

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
        gameSaved: false,
        side: "w",
      },
      player2: {
        username: player2,
        timer: settings.duration * 60,
        interval: null,
        gameSaved: false,
        side: "b",
      },
      
      lastMove: null, // "w" o "b" per indicare chi ha mosso per ultimo

      matches: {
        seed: null, // Seed per generare la board
        dataOraInizio: null, // Data e ora di inizio della partita
        dataOraFine: null, // Data e ora di fine della partita
        },

      gameOver: {
        isGameOver: false,
        winner: null, // Username dell'utente che ha visto
        reason: null, // "checkmate", "timeout", "resign", "stalemate", "draw", "insufficient_material", "threefold_repetition", "50_move_rule", "agreement"
        deleteGameInterval: null, // Intervallo che cancella la partita dopo un certo tempo dopo che è finita
      },

      gameId: gameId,
      chess: cloneChessBoard(board),
    });

    // Ritorniamo l'id della partita e le chiavi dei giocatori
    return {
      gameId: gameId,
    };
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

  /** Funzione commentata per riprestinare in caso il nuovo Movepiece non funzioni
   * Funzione che aggiunge una mossa al gioco con id gameId
   *
   * @param {string} gameId
   * @param {string} move
   * @returns true se la mossa è stata aggiunta, false altrimenti
  
  movePiece: function (gameId, move) {
    // Cerca la partita di scacchi
    var game = chessGames.find((game) => game.gameId == gameId);

    // Aggiungi la mossa se è una mossa corretta
    if (game.chess.move(move)) {
      // Se la mossa è corretta
      game.lastMove = game.chess.turn(); // Aggiorno di chi è il turno

      // Aggiorno il timer in modo che interrompo l'ultimo intervallo
      // e avvio quello del giocatore che deve muovere
      clearInterval(game.player1.interval);
      game.player1.interval = setInterval(() => {
        game.player1.timer--;
        if (game.player1.timer <= 0) {
          clearInterval(game.player1.interval);

          // Gestisco la sconfitta del giocatore 1
          game.gameOver.isGameOver = true;
          game.gameOver.winner = game.player2.side;
          game.gameOver.reason = "timeout";
          game.gameOver.deleteGameInterval = setTimeout(() => {
            chessGames.splice(chessGames.indexOf(game), 1);
          }, 1000 * 60 * 5); // Il game si cancellerà da solo dopo 5 minuti
        }
      }, 1000);

      return true;
    } else {
      return false;
    }
  }, */
  /**
   *
   * @param {string} game  game id univoco della partita
   * @param {string} winner giocaore che ha vinto
   * @param {string} reason motivo della vittoria
   */
  // Funzione per gestire gli scenari di fine partita
  handleGameOver: function (game, winner, reason) {
    game.gameOver.isGameOver = true;
    game.gameOver.winner = winner;
    game.gameOver.reason = reason;
    this.changeElo(game.player1, game.player2, winner);
    if(game.gameSettings.mode === "dailyChallenge"){
        this.saveDailyChallengeResults(game.gameId);
    }
    // Chiamare la tua funzione changeElo qui per aggiornare i punteggi dei giocatori
    // Esempio: changeElo(game.player1, game.player2, vincitore);
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
    var game = chessGames.find((game) => game.gameId == gameId);

    // Verifica se la mossa è valida
    var chessMove = game.chess.move(mossa);
    if (chessMove !== null) {
      game.lastMove = game.chess.turn(); // Aggiorna di chi è il turno

      // Controlla se c'è uno scacco matto
      if (game.chess.isCheckmate()) {
        this.handleGameOver(
          game,
          game.chess.turn() === "p1" ? "p2" : "p1",
          "checkmate"
        );
      } else if (
        game.chess.isStalemate() ||
        game.chess.isThreefoldRepetition() ||
        game.chess.isInsufficientMaterial()
      ) {
        // Controlla se c'è stallo, pareggio o materiale insufficiente
        this.handleGameOver(game, game.chess.turn() === "p1" ? "p2" : "p1", "stall");
      } else {
        // Aggiorna il timer per interrompere l'ultimo intervallo
        // e avviare l'intervallo per il giocatore che deve muovere
        clearInterval(game.player1.interval);
        clearInterval(game.player2.interval);

        if (game.chess.turn() === "p1") {
          game.player1.interval = setInterval(() => {
            game.player1.timer--;

            // Controlla se il tempo del giocatore 1 è scaduto
            if (game.player1.timer <= 0) {
              clearInterval(game.player1.interval);

              // Gestisci il timeout del giocatore 1 (sconfitta)
              this.handleGameOver(game, "p2", "timeout");
            }
          }, 1000);
        } else {
          game.player2.interval = setInterval(() => {
            game.player2.timer--;

            // Controlla se il tempo del giocatore 2 è scaduto
            if (game.player2.timer <= 0) {
              clearInterval(game.player2.interval);

              // Gestisci il timeout del giocatore 2 (sconfitta)
              this.handleGameOver(game, "p1", "timeout");
            }
          }, 1000);
        }
        return true; // Mossa riuscita
      }
    } else {
      return false; // Mossa non valida
    }
  },

  /**
   * Funzione che prende i risultati di una partita DailyChallenge e li salva nel database
   *
   * @param {string} gameId
   * @param {string} move
   * @returns true se la mossa è stata aggiunta, false altrimenti
   */
  saveDailyChallengeResults: function (gameId) {
    // Cerca la partita di scacchi
    var game = chessGames.find((game) => game.gameId == gameId);

    // Salva i risultati
    const db = clientMDB.db("ChessCake");
    const collection = db.collection("GamesRBC");

    collection.insertOne({
        Player1: game.player1,
        Player2: game.player2,
        matches: {
            mode: "DailyChallenge",
            seed: game.matches.seed,
            dataOraInizio: game.matches.dataOraInizio,
            dataOraFine: game.matches.dataOraFine,
            moves: game.chess.history(),
            //board: game.chess.fen();
            gameData: {
                turniBianco: game.chess
                    .history()
                    .filter((move, index) => index % 2 === 0).length,
                turniNero: game.chess
                    .history()
                    .filter((move, index) => index % 2 === 1).length,
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

  calculateEloChange: function (eloPlayer1, eloPlayer2, outcome, kFactor = 32) {
    // calcolo del punteggio previsto per il giocatore 1
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
  changeElo: function (Player1, player2, outcome) {
    if (outcome === "p1") {
      this.calculateEloChange(Player1.elo, player2.elo, "p2");
      this.calculateEloChange(player2.elo, Player1.elo, "p1");
    } else {
      this.calculateEloChange(Player1.elo, player2.elo, "p1");
      this.calculateEloChange(player2.elo, Player1.elo, "p2");
    }
  },
};
