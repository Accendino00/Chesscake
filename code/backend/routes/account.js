var express = require("express");
var config = require("../config");
var router = express.Router();

var { clientMDB } = require("../utils/dbmanagement");
var {
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
            message: "Non sei autorizzato a richiedere questo URL senza essere loggato",
        });
    }
    
    getAccountData(username, res);
});

function getAccountData (username, res) {
    // Prendiamo il profilo utente dal database
    const usersCollection = clientMDB.db("ChessCake").collection("Users");
    usersCollection.findOne({ username: username })
    .then((user) => {
        if (!user) {
            res.status(404).send({
                success: false,
                message: "Utente non trovato",
            });
        } else {
            res.status(200).send({
                success: true,
                message: "Informazioni prese con successo",
                accountData: {
                    username: user.username,
                    elo: user.rbcELO,
                    winrate: 0.5,                       // Da fare usando una query
                    currentRank: user.rbcCurrentRank,
                    maxRank: user.rbcMaxRank,
                    currentDailyRecord: "",             // Da fare usando una query
                    maxDailyRecord: 3,                  // Da fare usando una query
                }
            });
        }
    }).catch((error) => {
        res.status(500).send({
            success: false,
            message: "Errore interno",
        });
    });
}

router.get("/getLastGames/:username", async function (req, res) {
    const { ObjectId } = require('mongodb');
    const users = clientMDB.db("ChessCake").collection('Users');
    const games = clientMDB.db("ChessCake").collection('GamesRBC');
    // Get the username from the URL
    const username = req.params.username;
    // Find the user by username
    const user = await users.findOne({ username: username });
    const userId = new ObjectId(user._id);
    
    if (!user) {
        return res.status(404).send({
            success: false,
            message: "User not found",
        });
    }
    const userGames = await games.find({
        $or: [
            { Player1: userId },
            { Player2: userId }
        ]
    }).toArray();

    // If username is not defined then return 403 and an error message
    if (!username) {
        return res.status(403).send({
            success: false,
            message: "Non sei autorizzato a richiedere questo URL senza essere loggato",
        });
    } else {
        return res.status(200).send({
            success: true,
            message: "Informazioni prese con successo",
            lastGames: userGames,
        });
    }
});

router.get("/getLastGames/", function (req, res) {
    res.status(200).send({
        success: true,
        message: "Informazioni prese con successo",
        lastGames: allGames,
    });
});

module.exports = router;
