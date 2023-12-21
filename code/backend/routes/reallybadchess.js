var chessGames = require("../utils/chess/chessgames");

var express = require("express");
var config = require("../config");
var { clientMDB } = require("../utils/dbmanagement");
var {
  authenticateJWT,
  nonBlockingAutheticateJWT,
} = require("../middleware/authorization");
const path = require("path");
const { randomBytes } = require("crypto");

var router = express.Router();

function resizeGame (game) {
  return {
    gameSettings: game.gameSettings,
    player1: {
      username: game.player1.username,
      side: game.player1.side,
      timer: game.player1.timer,
    },
    player2: {
      username: game.player2.username,
      side: game.player2.side,
      timer: game.player2.timer,
    },

    lastMove: game.lastMove,
    matches: game.matches,
    gameOver: game.gameOver,

    gameId: game.gameId,
    chess: game.chess,
  }
}

// Serve the stockfish.js file
router.get("/stockfish.js", (req, res) => {
  const stockfishPath = path.join(
    __dirname,
    "../../frontend/src/pages/chessboard/stockfish.js"
  );
  res.sendFile(stockfishPath);
});

router.post("/newGame", authenticateJWT, async (req, res) => {
  // Creiamo un nuovo game all'interno del database
  const { settings } = req.body;

  // Vediamo se è stato impostato un username da nonBlockingAutheticateJWT
  let username1 = req.user ? req.user.username : null;

  let username2 = null;
  // Se i settings hanno modalità diversa da "playerVsPlayerOnline", allora imposto il secondo giocatore come "Computer"
  if (settings.mode !== "playerVsPlayerOnline") {
    username2 = "Computer";
  }

  // Se la modalità è "playerVsComputer" oppure "dailyChallenge", impostiamo il rank come parametro di settings
  // facendo una query a mongodb per ottenere il rank attuale del giocatore

  let rank = 20 // valore base per daily challenge

  if (settings.mode === "playerVsComputer") {
    // Prendiamo il rank del giocatore
    rank = await clientMDB
      .db("ChessCake")
      .collection("Users")
      .find({ username: username1 })
      .limit(1)
      .toArray();

    rank = rank.length == 0 ? 20 : rank[0].rbcCurrentRank;  
  }

  settings.rank = rank;

  let { gameId } = await chessGames.createNewGameWithSettings(
    username1,
    username2,
    settings
  );

  res.send({
    success: true,
    gameId: gameId,
  });
});

router.post("/joinGame/:gameId", authenticateJWT, (req, res) => {
  // Prendiamo il gameId
  const { gameId } = req.params;

  // Prendiamo il game dal database
  const game = chessGames.getGame(gameId);

  // Se il game non esiste, allora ritorniamo un errore
  if (!game) {
    return res.status(404).send({
      success: false,
      message: "Game not found",
    });
  }

  // Se il game esiste, allora controlliamo che l'utente non sia già il player1
  if (game.player1.username === req.user.username) {
    return res.status(400).send({
      success: false,
      message: "You are already the player1",
    });
  }

  // Se il game esiste, allora impostiamo l'utente come player2
  chessGames.joinGame(gameId, req.user.username);

  res.send({
    success: true,
    gameId: gameId,
  });
});

router.get("/getGame/:gameId", authenticateJWT, async (req, res) => {
  // Prendiamo il gameId
  const { gameId } = req.params;
  // Prendiamo il game dal database
  const game = chessGames.getGame(gameId);

  // Se il game non esiste, allora ritorniamo un errore
  if (!game) {
    return res.status(404).send({
      success: false,
      message: "Game not found",
    });
  }

  resizeGame(game)

  // Se il game esiste, allora ritorniamo il game
  res.send({
    success: true,
    game: resizeGame(game),
  });
});

router.post("/movePiece/:gameId", authenticateJWT, async (req, res) => {
  // Prendiamo il gameId
  const { gameId } = req.params;

  // Prendiamo il game dal database
  const game = chessGames.getGame(gameId);

  // Se il game non esiste, allora ritorniamo un errore
  if (!game) {
    return res.status(404).send({
      success: false,
      message: "Game not found",
    });
  }

  // Controlliamo che l'utenza sia corretta
  if (
    req.user &&
    req.user.username !== game.player1.username &&
    req.user.username !== game.player2.username
  ) {
    return res.status(403).send({
      success: false,
      message: "Unauthorized",
    });
  }

  // Imposto il "side" del giocatore che sta cercando di fare la mossa
  let side = null;
  const { username } = req.body;
  if (username === game.player1.username) {
    side = game.player1.side;
  } else {
    side = game.player2.side;
  }

  // controllo in modo che il giocatore nero non possa
  // muovere pedine bianche e nere
  if (
    // Se il giocatore bianco prova a fare una mossa quando l'ultimo turno era suo
    (game.lastMove === "w" && side === "w") ||
    // Se il giocatore nero prova a fare una mossa quando l'ultimo turno era suo
    (game.lastMove === "b" && side === "b") ||
    // Se il giocatore nero prova a fare una mossa quando non c'è ancora stato nessun turno
    (game.lastMove === null && side === "b")
  ) {
    return res.status(400).send({
      success: false,
      game: resizeGame(game),
      message: "Its not your turn",
    });
  }

  // Prendiamo la mossa
  const move = req.body;

  try {
    // Facciamo la mossa
    const result = chessGames.movePiece(gameId, move);

    // Dopo la mossa, otteniamo l'aggiornamento dello stato del gioco
    // Includiamo le informazioni aggiuntive come il turno di ciascun giocatore
    if (result) {
      const updatedGame = chessGames.getGame(gameId);
      res.status(200).send({
        success: true,
        game: resizeGame(updatedGame),
      });
    } else {
      res.status(200).send({
        success: false,
        game: resizeGame(game),
      });
    }
  } catch (error) {
    // Handle the invalid move exception
    if (error.message === "Invalid move") {
      return res.status(400).send({
        success: false,
        message: "Invalid move",
      });
    }

    // Handle other exceptions if needed
    console.error("Unhandled exception:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error"
    });
  }
});

router.post("/surrender/:gameId", authenticateJWT, (req, res) => {
  // Prendiamo il gameId
  const { gameId } = req.params;

  // Prendiamo il game dal database

  // Prendiamo il game dal database
  const game = chessGames.getGame(gameId);

  // Se il game non esiste, allora ritorniamo un errore
  if (!game) {
    return res.status(404).send({
      success: false,
      message: "Game not found",
    });
  }

  // Controlliamo che l'utenza sia corretta
  if (
    req.user &&
    req.user.username !== game.player1.username &&
    req.user.username !== game.player2.username
  ) {
    return res.status(403).send({
      success: false,
      message: "Unauthorized",
    });
  }

  // Imposto il "side" del giocatore opposto a colui che sta cercando di fare la mossa
  let winnerSide = "";
  if (req.user.username === game.player1.username) {
    winnerSide = "p2";
  } else {
    winnerSide = "p1";
  }

  let returnOfGameOver = chessGames.handleGameOver(game, winnerSide, "surrender");

  // Ritorniamo il game
  res.send({
    success: returnOfGameOver,
    game: resizeGame(game)
  });
});  


router.post(
  "/saveGame/:gameId",
  nonBlockingAutheticateJWT,
  async (req, res) => {
    // Prendiamo il gameId
    // Prendiamo il gameId
  const { gameId } = req.params;

  // Prendiamo il game dal database

  // Prendiamo il game dal database
  const game = chessGames.getGame(gameId);

  // Se il game non esiste, allora ritorniamo un errore
  if (!game) {
    return res.status(404).send({
      success: false,
      message: "Game not found",
    });
  }

  // Controlliamo che l'utenza sia corretta
  if (
    req.user &&
    req.user.username !== game.player1.username &&
    req.user.username !== game.player2.username
  ) {
    return res.status(403).send({
      success: false,
      message: "Unauthorized",
    });
  }

  // Imposto il "side" del giocatore che sta cercando di fare la mossa
  let winnerSide = game.gameOver.winner;

  let returnOfGameOver = chessGames.handleGameOver(game, winnerSide, "checkmate");

  // Ritorniamo il game
  res.send({
    success: true,
    game: resizeGame(game)
  });
    
  }
);

router.post("/setBoard/:gameId", authenticateJWT, (req, res) => {
  // Prendiamo il gameId
  const { gameId } = req.params;

  // Prendiamo il game dal database
  const game = chessGames.getGame(gameId);

  // Se il game non esiste, allora ritorniamo un errore
  if (!game) {
    return res.status(404).send({
      success: false,
      message: "Game not found",
    });
  }

  // Controlliamo che l'utenza sia corretta
  if (
    req.user &&
    req.user.username !== game.player1.username &&
    req.user.username !== game.player2.username
  ) {
    return res.status(403).send({
      success: false,
      message: "Unauthorized",
    });
  }

  // Prendiamo la board
  const { board } = req.body;

  // Settiamo la board
  chessGames.setBoard(gameId, board);

  // Ritorniamo il game
  res.send({
    success: true,
    game: resizeGame(game),
  });
});

// Richiesta che ritorna tutte le partite che sono in attesa del secondo giocatore
router.get("/getEmptyGames", authenticateJWT, async (req, res) => {
  try {
    const games = chessGames.getEmptyGames();
    if (!games) {
      return res.status(404).json({
        success: false,
        message: "Games not found",
      });
    }

    // Set Content-Type header to application/json
    res.setHeader("Content-Type", "application/json");
    res.send({
      success: true,
      games: games,
    });
  } catch (error) {
    console.error("Error while getting empty games:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
