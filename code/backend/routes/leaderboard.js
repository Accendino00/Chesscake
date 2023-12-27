let express = require("express");
let config = require("../config");
let router = express.Router();

let { clientMDB } = require("../utils/dbmanagement");
let {
  authenticateJWT,
  nonBlockingAutheticateJWT,
} = require("../middleware/authorization");

router.get("/elo", nonBlockingAutheticateJWT, async function (req, res) {
    try {
        const db = clientMDB.db("ChessCake");
        const collection = db.collection("Users");

        // Retrieve the top 10 players by ELO
        const leaderboard = await collection.find({ username: { $ne: "Computer" } })
            .sort({ rbcELO: -1 })
            .limit(10)
            .toArray()

        let userPlace = null;
        if (req.user) {
            // Find the user's ELO and place
            const userRanking = await collection.find({ username: { $ne: "Computer" } })
                .sort({ rbcELO: -1 })
                .toArray();
            const userIndex = userRanking.findIndex(user => user.username === req.user.username);
            userPlace = userRanking[userIndex];
            if (userPlace) {
                userPlace.place = userIndex + 1; // Adding 1 because array indices start at 0
            }

            // Mantenere solo i valori di ELO, username e posto
            userPlace = {
                username: userPlace.username,
                elo: userPlace.rbcELO,
                place: userPlace.place,
            }
        }

        res.json({
            success: true,
            leaderboard: leaderboard.map(user => ({ username: user.username, elo: user.rbcELO })),
            userPlace
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.get("/eloKriegspiel", nonBlockingAutheticateJWT, async function (req, res) {
    try {
        const db = clientMDB.db("ChessCake");
        const collection = db.collection("Users");

        // Retrieve the top 10 players by ELO
        const leaderboard = await collection.find({ username: { $ne: "Computer" } })
            .sort({ kriELO: -1 })
            .limit(10)
            .toArray()

        let userPlace = null;
        if (req.user) {
            // Find the user's ELO and place
            const userRanking = await collection.find({ username: { $ne: "Computer" } })
                .sort({ kriELO: -1 })
                .toArray();
            const userIndex = userRanking.findIndex(user => user.username === req.user.username);
            userPlace = userRanking[userIndex];
            if (userPlace) {
                userPlace.place = userIndex + 1; // Adding 1 because array indices start at 0
            }

            // Mantenere solo i valori di ELO, username e posto
            userPlace = {
                username: userPlace.username,
                elo: userPlace.kriELO,
                place: userPlace.place,
            }
        }

        res.json({
            success: true,
            leaderboard: leaderboard.map(user => ({ username: user.username, elo: user.kriELO })),
            userPlace
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});


router.get("/rank", nonBlockingAutheticateJWT, async function (req, res) {
    try {
        const db = clientMDB.db("ChessCake");
        const collection = db.collection("Users");

        // Retrieve the top 10 players by Rank
        const leaderboard = await collection.find({ username: { $ne: "Computer" } })
            .sort({ rbcCurrentRank: -1 }) // Assuming lower rank number is better
            .limit(10)
            .toArray();

        let userPlace = null;
        if (req.user) {
            // Find the user's Rank and place
            const userRanking = await collection.find({ username: { $ne: "Computer" } })
                .sort({ rbcCurrentRank: -1 })
                .toArray();
            const userIndex = userRanking.findIndex(user => user.username === req.user.username);
            userPlace = userRanking[userIndex];
            if (userPlace) {
                userPlace.place = userIndex + 1; // Adding 1 because array indices start at 0
            }
            
            // Mantenere solo i valori di ELO, username e posto
            userPlace = {
                username: userPlace.username,
                rank: userPlace.rbcCurrentRank,
                place: userPlace.place,
            }
        }

        res.json({
            success: true,
            leaderboard: leaderboard.map(user => ({ username: user.username, rank: user.rbcCurrentRank })),
            userPlace
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});


router.get("/daily", nonBlockingAutheticateJWT, async function (req, res) {
    try {
        const db = clientMDB.db("ChessCake"); 
        const collection = db.collection("Games");
        
        const startOfDay = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 0, 0, 0)).toISOString();
        const endOfDay = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 23, 59, 59, 999)).toISOString();
        // Prende i top 10 giocatori per numero minimo di turni
        const leaderboard = await collection.aggregate([
            {
                $match: {
                  "matches.mode": "dailyChallenge",
                  "matches.dataOraInizio": { $gte: startOfDay, $lte: endOfDay },
                  "matches.gameData.vincitore": "p1",
                },
              },
              {
                $sort: { "matches.gameData.turniBianco": 1 }, // Ordina per numero minimo di turni del bianco
              },
              {
                $group: {
                  _id: "$Player1.username",
                  username: { $first: "$Player1.username" },
                  moves: { $first: "$matches.gameData.turniBianco" }, // Seleziona il numero minimo di turni
                },
              },
              {
                $sort: { moves: 1 }, // Ordina per numero minimo di turni
              },
              {
                $limit: 10,
              },
          ]).toArray();


        let userPlace = null
        //Se c'è un utente con una daily valida
        if (req.user) {
            const userRanking = leaderboard;
            const userIndex = userRanking.findIndex(user => user.username === req.user.username);
            userPlace = userRanking[userIndex];
            if (userPlace) {
                userPlace.place = userIndex + 1; // Aggiungiamo 1 perché gli indici dell'array partono da 0
                // Manteniamo soltanto i valori essenziali
                userPlace = {
                    username: userPlace.username,
                    moves: userPlace.moves,
                    place: userPlace.place,
                }
            }
            else  //Caso utente non presente nella leaderboard
            {
                userPlace = {
                    username: req.user.username,
                    moves: "N/A",
                    place: 0,
                }
            }
        }
        //Se la leaderboard è vuota
        if (leaderboard.length === 0) {
            res.status(201).json({
                success: true,
                leaderboard: [],
                message: "Daily challenge still empty",
                statusCode: 201,
                userPlace
            });
        } else {
            res.json({
                success: true,
                leaderboard: leaderboard.map(user => ({ username: user.username, moves: user.moves })),
                userPlace
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

module.exports = router;
