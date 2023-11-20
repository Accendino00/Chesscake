var chessGames = require('../utils/chessgames');

var config = require("../config");
var { clientMDB }  = require('../utils/dbmanagement');
var router = express.Router();

const path = require('path');

// Serve the stockfish.js file
router.get('/stockfish.js', (req, res) => {
    const stockfishPath = path.join(__dirname, '../../frontend/src/pages/chessboard/stockfish.js');
    res.sendFile(stockfishPath);
});

module.exports = router;