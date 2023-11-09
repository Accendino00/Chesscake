var express = require('express');
var router = express.Router();
var path = require('path')
var config = require("../config")

let pagePaths = [
    "/",
    "/login",
    "/reallybadchess",
    "/account",
    "/leaderboard",
    "/tournaments"
];

// Imposto il router a reindirizzare le richieste a "/" a "../../frontend/dist"
for (let i = 0; i < pagePaths.length; i++) {
    router.use(pagePaths[i], express.static(config.FRONTEND_DIST_PATH));
}

console.log("Serving static files from " + config.FRONTEND_DIST_PATH);

module.exports = router;