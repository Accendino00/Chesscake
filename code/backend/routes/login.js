let express = require('express');
let config = require("../config");
let router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
let { clientMDB }  = require('../utils/dbmanagement');

function logUser(username, password) {
    return new Promise((resolve, reject) => {
        try {
            const usersCollection = clientMDB.db("ChessCake").collection("Users");

            // Find the user with the given username
            usersCollection.findOne({ username: username })
            .then((user) => {
                if (!user) {
                    //reject(new Error({ message: "Utente non trovato", status: 403, returnBody: { success: false } }));
                    reject({ message: "Utente non trovato", status: 403, returnBody: { success: false } });
                } else {
                    // Compare the provided password with the hashed password
                    bcrypt.compare(password, user.password).then(
                        (result) => {
                            if (!result) {
                                //reject(new Error({ message: "Password errata", status: 403, returnBody: { success: false } }));
                                reject({ message: "Password errata", status: 403, returnBody: { success: false } });
                            } else {
                                const token = jwt.sign({ username: user.username }, config.SECRET_KEY, { expiresIn: '7d' });
                                resolve({ message: "Login completato", status: 200, returnBody: { success: true, token: token } });
                            }
                        },
                        (error) => {
                            //reject(new Error({ message: "Errore nella verifica della password", status: 500, returnBody: { success: false } }));
                            reject({ message: "Errore nella verifica della password", status: 500, returnBody: { success: false } });
                        }
                    );
                }
            }).catch((error) => {
                //reject(new Error({ message: "Errore interno 1", status: 500, returnBody: { success: false } }));
                reject({ message: "Errore interno 1", status: 500, returnBody: { success: false }});
            });
        } catch (error) {
            //reject(new Error({ message: "Errore interno 2", status: 500, returnBody: { success: false } }));
            reject({ message: "Errore interno 2", status: 500, returnBody: { success: false }});
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
        let username = req.body.username;
        let password = req.body.password;
        
        // Eseguiamo il login
        logUser(username, password).then((result) => {
            // Se non ci sono stati errori, ritorniamo un 200
            res.status(result.status);

            // Ritorniamo un json con il token e un flag di successo
            // e impostiamo gli header in modo corretto
            let resBody = result.returnBody;

            res.header("Content-Type", "application/json");
            res.header("Content-Length", resBody.length);

            res.send(resBody);
        }).catch((error) => {
            // Se si è verificato un errore, lo stampiamo in console
            console.log(error.message);
            // e ritorniamo un errore 500
            res.status(error.status).send(error.returnBody);
        });

    } else {
        console.log("Non sono presenti tutti i parametri");
        // Se non sono presenti tutti i parametri, ritorniamo un errore 400
        res.status(400).send({ success: false });
    }

});

module.exports = router;