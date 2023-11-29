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
                    // Placeholder da implementare
                    elo: 800,
                    winrate: 0.5,
                    currentRank: 45,
                    maxRank: 65,
                    currentDailyRecord: "",
                    maxDailyRecord: 3,
                }
            });
        }
    }).catch((error) => {
        res.status(500).send({
            success: false,
            message: "Errore interno",
        });
    });
});

module.exports = router;
