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
  let { gameId } = chessGames.createNewGameWithSettings(
    username1,
    username2,
    settings,
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

  // Se il game esiste, allora ritorniamo il game
  res.send({
    success: true,
    game: game,
  });
});

router.post(
  "/movePiece/:gameId",
  authenticateJWT,
  async (req, res) => {
    // Prendiamo il gameId
    const { gameId } = req.params;

    // Prendiamo il game dal database
    const game = chessGames.getGame(gameId);
    console.log("game:", game.chess._header.FEN);
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
    console.log("lastMove:", game.lastMove);
    console.log('req.user:', req.user);
    console.log('game.player1.username:', game.player1.username);
    console.log('game.player2.username:', game.player2.username);
    console.log('game.player1.side:', game.player1.side);
    console.log('game.player2.side:', game.player2.side);
    console.log('req.user.username', req.user.username);
    // controllo in modo che il giocatore nero non possa 
    // muovere pedine bianche e nere
    if((game.lastMove == null && req.user.username === game.player1.username && game.player2.side === "b") || (game.lastMove == null && req.user.username === game.player2.username && game.player1.side === "b")){
      console.log('sono entrato fica');
      return res.status(403).send({
        success: false,
        game: game,
        message: "Its not your turn",
      });
    }
    // Prendiamo la mossa
    const move = req.body;
    
    try {
      // Facciamo la mossa
      const result = chessGames.movePiece(gameId, move);
      console.log("result:", result);
      // Dopo la mossa, otteniamo l'aggiornamento dello stato del gioco
      // Includiamo le informazioni aggiuntive come il turno di ciascun giocatore
      if (result) {
        const updatedGame = chessGames.getGame(gameId);
        console.log("game2", game.chess._header.FEN);
        console.log("updatedGame:", updatedGame.chess._header.FEN);
        res.status(200).send({
          success: true,
          game: updatedGame,
        });
      } else {
        res.status(200).send({
          success: false,
          game: game,
        });
      }
    } catch (error) {
      // Handle the invalid move exception
      if (error.message === 'Invalid move') {
        return res.status(400).send({
          success: false,
          message: "Invalid move",
        });
      }

      // Handle other exceptions if needed
      console.error("Unhandled exception:", error);
      return res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

router.post(
  "/saveDailyChallengeResults/:gameId",
  nonBlockingAutheticateJWT,
  async (req, res) => {
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

    // Prendiamo il risultato
    const { result } = req.body;

    // Salviamo i risultati
    chessGames.saveDailyChallengeResults(gameId);

    // Ritorniamo il game
    res.status(200).send({
      success: true,
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
    game: game,
  });
});


//get di tutti i games senza secondo giocatore
router.get("/getEmptyGames",
authenticateJWT, async (req, res) => {
  try {
    const games = chessGames.getEmptyGames();
    if (!games) {
      return res.status(404).json({
        success: false,
        message: 'Games not found',
      });
    }

    // Set Content-Type header to application/json
    res.setHeader('Content-Type', 'application/json');
    res.send({
      success: true,
      games: games,
    });
  } catch (error) {
    console.error('Error while getting empty games:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.post("/gameOver/:gameId", authenticateJWT, (req, res) => {
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
  const { } = req.body;

  // Settiamo la board
  let isGameOver = chessGames.gameOver(gameId);

  // Ritorniamo il game
  if (isGameOver) {
    res.send({
      success: true,
      game: game,
    });
  } else {
    res.send({
      success: false,
      game: game,
    });
  }
}

);

router.post("/timer/:gameId", authenticateJWT, (req, res) => {
  // Prendiamo il gameId
  const { gameId } = req.params;

  const { time } = req.body;

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

  if(chessGames.TimeRuns(time)){
    res.send({
      success: true,
      game: game,
    });
  }
}

);

module.exports = router;
