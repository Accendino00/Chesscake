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
    lastMoveTargetSquare: game.lastMoveTargetSquare,
    lastMoveChessPiece: game.lastMoveChessPiece,
    matches: game.matches,
    gameOver: game.gameOver,

    gameId: game.gameId,
    chess: game.chess,
  }
}

router.post("/newGame", authenticateJWT, async (req, res) => {
  // Creiamo un nuovo game all'interno del database
  const { settings } = req.body;

  // Vediamo se è stato impostato un username da nonBlockingAutheticateJWT
  let username1 = req.user ? req.user.username : null;

  let username2 = null;

  settings.rank = null;

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

router.get("/getGame/:gameId/user", authenticateJWT, async (req, res) => {
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
    //kgame: kgame,
  });
});

router.post("/movePiece/:gameId", authenticateJWT, async (req, res) => {
  const { gameId } = req.params;
  const game = chessGames.getGame(gameId);

  if (!game) {
    return res.status(404).send({
      success: false,
      message: "Game not found",
    });
  }

  if (req.user &&
    req.user.username !== game.player1.username &&
    req.user.username !== game.player2.username) {
    return res.status(403).send({
      success: false,
      message: "Unauthorized",
    });
  }

  let side = req.user.username === game.player1.username ? game.player1.side : game.player2.side;

  if ((game.lastMove === "w" && side === "w") ||
    (game.lastMove === "b" && side === "b") ||
    (game.lastMove === null && side === "b")) {
    return res.status(400).send({
      success: false,
      game: resizeGame(game),
      message: "It's not your turn",
    });
  }

  const move = req.body;
  const source = game.chess.get(move.from);

  try {
    const result = chessGames.movePiece(gameId, move);

    if (result) {
      const updatedGame = chessGames.getGame(gameId);
      res.status(200).send({
        success: true,
        game: resizeGame(updatedGame),
      });
    } else {
      let blocked = false;
      if (source && source.type !== 'n') {
        const sourceFile = move.from.charCodeAt(0);
        const sourceRank = parseInt(move.from[1], 10);
        const targetFile = move.to.charCodeAt(0);
        const targetRank = parseInt(move.to[1], 10);
  
        const fileStep = Math.sign(targetFile - sourceFile);
        const rankStep = Math.sign(targetRank - sourceRank);
  
        let currentFile = sourceFile + fileStep;
        let currentRank = sourceRank + rankStep;
  
        while (currentFile !== targetFile || currentRank !== targetRank) {
          if (game.chess.get(String.fromCharCode(currentFile) + currentRank)) {
            console.log("A piece is blocking the way");
            blocked = true;
            break;
          }
          currentFile += fileStep;
          currentRank += rankStep;
        }
      } if(blocked){
        res.status(200).send({
          success: false,
          game: resizeGame(game),
          message: "A piece is blocking the way"
        });
      } else {
        res.status(200).send({
          success: false,
          game: resizeGame(game),
        });
      }
    }
  } catch (error) {
    if (error.message === "Invalid move") {
      res.status(400).send({
        success: false,
        message: "Invalid move",
      });
    } else {
      console.error("Unhandled exception:", error);
      res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
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

  // Imposto il "side" del giocatore che sta cercando di fare la mossa
  let winnerSide = null;
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
    const games = chessGames.getKEmptyGames();
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
