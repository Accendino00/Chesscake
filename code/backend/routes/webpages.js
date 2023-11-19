var express = require('express');
var router = express.Router();
var path = require('path')
var config = require("../config")

// Serve i file statici dalla directory dist di React
router.use(express.static(config.FRONTEND_DIST_PATH));

// Serve l'index.html per tutte le altre richieste
router.get("*", function (req, res) {
    res.sendFile(path.join(config.FRONTEND_DIST_PATH, "index.html"));
});

console.log("Restituendo le pagine web da: " + config.FRONTEND_DIST_PATH);

module.exports = router;