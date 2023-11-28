var chessGames = require('../utils/chess/chessgames');

var express = require("express");
var config = require("../config");
var { clientMDB }  = require('../utils/dbmanagement');
var {authenticateJWT, nonBlockingAutheticateJWT} = require('../middleware/authorization');
const path = require('path');
const { randomBytes } = require('crypto');


var router = express.Router();

// Serve the stockfish.js file
router.get('/stockfish.js', (req, res) => {
    const stockfishPath = path.join(__dirname, '../../frontend/src/pages/chessboard/stockfish.js');
    res.sendFile(stockfishPath);
});

router.post('/newGame', nonBlockingAutheticateJWT, async (req, res) => {
    // Creiamo un nuovo game all'interno del database
    const { settings } = req.body;

    // Vediamo se è stato impostato un username da nonBlockingAutheticateJWT
    let username1 = req.user ? req.user.username : null;

    let username2 = null;
    // Se i settings hanno modalità diversa da "playerVsPlayerOnline", allora imposto il secondo giocatore come "Computer"
    if (settings.mode !== "playerVsPlayerOnline") {
        username2 = "Computer";
    }

    let {gameId, keyPlayer1, keyPlayer2} = chessGames.createNewGameWithSettings(username1, username2, settings);

    res.send({
        success: true,
        gameId: gameId
    });
});

router.get('/getGame/:gameId', nonBlockingAutheticateJWT, async (req, res) => {
    // Prendiamo il gameId
    const { gameId } = req.params;

    // Prendiamo il game dal database
    const game = chessGames.getGame(gameId);

    // Se il game non esiste, allora ritorniamo un errore
    if (!game) {
        return res.status(404).send({
            success: false,
            message: "Game not found"
        });
    }

    // Se il game esiste, allora ritorniamo il game
    res.send({
        success: true,
        game: game
    });
});

router.post('/movePiece/:gameId', nonBlockingAutheticateJWT, async (req, res) => {
    // Prendiamo il gameId
    const { gameId } = req.params;

    // Prendiamo il game dal database
    const game = chessGames.getGame(gameId);

    // Se il game non esiste, allora ritorniamo un errore
    if (!game) {
        return res.status(404).send({
            success: false,
            message: "Game not found"
        });
    }

    // Controlliamo che l'utenza sia corretta
    if (req.user && (req.user.username !== game.player1.name && req.user.username !== game.player2.name)) {
        return res.status(403).send({
            success: false,
            message: "Unauthorized"
        });
    }

    // Prendiamo la mossa
    const { move } = req.body;

    // Facciamo la mossa
    const result = chessGames.movePiece(gameId, move);

    // Se la mossa non è valida, allora ritorniamo un errore
    if (!result) {
        return res.status(400).send({
            success: false,
            message: "Invalid move"
        });
    }

    // Se la mossa è valida, allora ritorniamo il game
    res.status(200).send({
        success: true,
        game: game // Da capire se mandare
    });
});

module.exports = router;