var express = require('express');
var config = require("../config");
var router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function logUser(username, password) {
    return new Promise((resolve, reject) => {
        try {
            // Prima controlliamo che ci sia stato almeno un utente
            if (config.users === undefined || config.users.length == 0) {
                reject({ message: "Non ci sono utenti registrati", status: 403, returnObject: { success: false } });
            }

            let user = config.users.find(u => u.username === username);
            if (!user) {
                reject({ message: "Utente non trovato", status: 403, returnObject: { success: false } });
            } 

            bcrypt.compare(password, user.password).then (
                (result) => {
                    if (!result) {
                        reject({ message: "Password errata", status: 403, returnObject: { success: false } });
                    }
                    const token = jwt.sign({ username: user.username }, config.SECRET_KEY, { expiresIn: '2h' });
                    resolve(token);
                },
                (error) => {
                    reject({ message: "Password errata", status: 403, returnObject: { success: false } });
                }
            );
        } catch (error) {
            reject({ message: "Errore interno", status: 500, returnObject: { success: false }});
        }
    });
}

/**
 * Gestione della richiesta "/api/login"
 * 
 * La richista sarà del tipo:
    POST /api/login HTTP/1.1
    User-Agent: Mozilla/4.0 (compatible; MSIE5.01; Windows NT)  // Questo potrebbe essere diverso
    Host: www.chesscake.com                                     // Per ora localhost:8000
    Content-Type: json
    Content-Length: <lenght calcolata>
    
    {
        username: "admin",
        password: "prova"
    }
 * 
 */
router.post("/login", function (req, res) {
    // Cerchiamo nel req body se vi sono tutti i parametri non nulli, ovvero username e password
    if (req.body.username && req.body.password) {
        // Se sono presenti, li salviamo in due variabili
        var username = req.body.username;
        var password = req.body.password;
        
        // Eseguiamo il login
        logUser(username, password).then((result) => {
            // Se non ci sono stati errori, ritorniamo un 200
            res.status(200);

            // Ritorniamo un json con il token e un flag di successo
            // e impostiamo gli header in modo corretto
            res.body = {
                "success": true,
                "token" : result
            }

            res.header("Content-Type", "application/json");
            res.header("Content-Length", res.body.length);

            res.send(res.body);
        }).catch((error) => {
            // Se si è verificato un errore, lo stampiamo in console
            console.log(error.message);
            // e ritorniamo un errore 500
            res.status(error.status).send(error.returnObject);
        });;

    } else {
        console.log("Non sono presenti tutti i parametri");
        // Se non sono presenti tutti i parametri, ritorniamo un errore 400
        res.status(400).send({ success: false });
    }

});

module.exports = router;