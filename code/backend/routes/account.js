let express = require("express");
let config = require("../config");
let router = express.Router();

let { clientMDB } = require("../utils/dbmanagement");
let {
  authenticateJWT,
  nonBlockingAutheticateJWT,
} = require("../middleware/authorization");

/**
 * Gestione della richiesta "/api/account/getAccountData"
 * 
 * La richista sarà del tipo:
    GET /api/login HTTP/1.1
    User-Agent: Mozilla/4.0 (compatible; MSIE5.01; Windows NT)  // Questo potrebbe essere diverso
    Host: www.chesscake.com                                     // Per ora localhost:8000
    Content-Type: json
    Content-Length: <lenght calcolata>
    Authentication: Bearer <token>                              // Da qui possiamo determinare il suo username
 * 
 */
router.get("/getAccountData", authenticateJWT, function (req, res) {
  // req.user dovrebbe essere impostato con il nome utente che dobbiamo cercare nel DB
  const username = req.user.username;

  // Se username non è definito allo ritorniamo 403 e un messaggio di errore
  if (!username) {
    res.status(403).send({
      success: false,
      message: "Non sei autorizzato",
    });
  }

  getAccountData(username, res);
});

// Questa è la versione che va a ricercare gli account dal db dato l'username
router.get("/getAccountData/:username", function (req, res) {
  let username = req.params.username;

  // Se username non è definito allo ritorniamo 403 e un messaggio di errore
  if (!username) {
    res.status(403).send({
      success: false,
      message:
        "Non sei autorizzato a richiedere questo URL senza essere loggato",
    });
  }

  getAccountData(username, res);
});

function getAccountData(username, res) {
  // Prendiamo il profilo utente dal database
  const usersCollection = clientMDB.db("ChessCake").collection("Users");
  usersCollection
    .findOne({ username: username })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          success: false,
          message: "Utente non trovato",
        });
      } else {
        // Prendo il numero di partite giocate per il calcolo del winrate in playerVsPlayerOnline
        const gamesCollection = clientMDB
          .db("ChessCake")
          .collection("Games");
        gamesCollection
          .find({
            $or: [
              { "Player1.username": username },
              { "Player2.username": username },
            ],
          })
          .toArray()
          .then((games) => {
            let winrate = 0;
            let gamesPlayed = 0;
            let gamesWon = 0;

            let kriWinrate = 0;
            let k_gamesPlayed = 0;
            let k_gamesWon = 0;
            games.forEach((game) => {
              if (game.matches.mode == "playerVsPlayerOnline") {
                if (
                  (game.Player1.username == username &&
                    game.matches.gameData.vincitore == "p1") ||
                  (game.Player2.username == username &&
                    game.matches.gameData.vincitore == "p2")
                ) {
                  gamesWon++;
                }
                gamesPlayed++;
              } else if (game.matches.mode == "kriegspiel") {
                if (
                  (game.Player1.username == username &&
                    game.matches.gameData.vincitore == "p1") ||
                  (game.Player2.username == username &&
                    game.matches.gameData.vincitore == "p2")
                ) {
                  k_gamesWon++;
                }
                k_gamesPlayed++;
              }
            });
            winrate = gamesWon / gamesPlayed;
            kriWinrate = k_gamesWon / k_gamesPlayed;

            // Prendo l'elenco di partite delle daily (vinte)
            // La migliore partita di oggi è quella con il numero minimo di turni
            // E prendo la partita con il minor numero di turni in generale
            let today = new Date();
            let minTurns = null;
            let turniDaily = "";

            games.forEach((game) => {
              if (game.matches.mode == "dailyChallenge") {
                // Vedo se ho vinto la partita
                // potrei essere sia il player 1 che il player 2, quindi devo controllare (username del palyer "Player1.username")
                // quale player sono e poi controllare se ho vinto in matches.gameData.vincitore
                if (
                  (game.Player1.username == username &&
                    game.matches.gameData.vincitore == "p1") ||
                  (game.Player2.username == username &&
                    game.matches.gameData.vincitore == "p2")
                ) {
                  // prendo i turni usati
                  let side =
                    game.Player1.username == username
                      ? game.Player1.side
                      : game.Player2.side;
                  let turni =
                    side == "w"
                      ? game.matches.gameData.turniBianco
                      : game.matches.gameData.turniNero;

                  if (minTurns) {
                    if (turni < minTurns) {
                      minTurns = turni;
                    }
                  } else {
                    minTurns = turni;
                  }

                  // Se la partita è di oggi, prendo i turni usati
                  let dataOraInizio = new Date(game.matches.dataOraInizio);
                  if (
                    dataOraInizio.getDate() == today.getDate() &&
                    dataOraInizio.getMonth() == today.getMonth() &&
                    dataOraInizio.getFullYear() == today.getFullYear()
                  ) {
                    turniDaily = turni;
                  }
                }
              }
            });

            res.status(200).send({
              success: true,
              message: "Informazioni prese con successo",
              accountData: {
                username: user.username,
                elo: user.rbcELO,
                kriELO: user.kriELO,
                winrate: winrate,
                kriWinrate: kriWinrate,
                currentRank: user.rbcCurrentRank,
                maxRank: user.rbcMaxRank,
                currentDailyRecord: turniDaily,
                maxDailyRecord: minTurns ? minTurns : "",
              },
              playerRequesting: username,
            });
          });
      }
    })
    .catch((error) => {
      res.status(500).send({
        success: false,
        message: "Errore interno",
      });
    });
}

router.get("/getLastGames/:username", async function (req, res) {
  const users = clientMDB.db("ChessCake").collection("Users");
  const games = clientMDB.db("ChessCake").collection("Games");
  // Get the username from the URL
  const username = req.params.username;

  // Controlliamo se l'utente esiste nel db facendo una query
  let user = await users.findOne({ username: username });

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }
  const userGames = await games
    .find({
      $or: [{ "Player1.username": username }, { "Player2.username": username }],
    })
    .toArray();

  // If username is not defined then return 403 and an error message
  if (!username) {
    return res.status(403).send({
      success: false,
      message:
        "Non sei autorizzato a richiedere questo URL senza essere loggato",
    });
  } else {
    return res.status(200).send({
      success: true,
      message: "Informazioni prese con successo",
      lastGames: userGames,
      playerRequesting: username,
    });
  }
});

module.exports = router;
