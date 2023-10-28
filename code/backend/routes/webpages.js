var express = require('express');
var router = express.Router();
var path = require('path')
var config = require("../config")

// Imposto il router a reindirizzare le richieste a "/" a "../../frontend/dist"
router.use("/", express.static(config.FRONTEND_DIST_PATH));
console.log("Serving static files from " + config.FRONTEND_DIST_PATH);

module.exports = router;