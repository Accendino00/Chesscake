var express = require("express");
var config = require("../config");
var router = express.Router();

var { clientMDB } = require("../utils/dbmanagement");
var {
  authenticateJWT,
  nonBlockingAutheticateJWT,
} = require("../middleware/authorization");

router.get("/elo", nonBlockingAutheticateJWT, async function (req, res) {
    try {
        const db = clientMDB.db("ChessCake"); // Replace with your database name
        const collection = db.collection("Users"); // Replace with your collection name

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

router.get("/rank", nonBlockingAutheticateJWT, async function (req, res) {
    try {
        const db = clientMDB.db("ChessCake"); // Replace with your database name
        const collection = db.collection("Users"); // Replace with your collection name

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


router.get("/daily/", nonBlockingAutheticateJWT, function (req, res) {
});

module.exports = router;
