var { Chess } = require('chess.js');

var chessGames = [];

module.exports = {
    chessGames,
    
    /**
     * Funzione che aggiunge un nuovo gioco, vuoto, all'interno dell'array chessGames
     * 
     * @param {string} gameId 
     * @param {string} player1 
     * @param {string} player2 
     */
    createNewGameSimple : function (gameId, player1, player2) {
        chessGames.push({
            gameId : gameId,
            player1 : player1,
            player2 : player2,
            chess: new Chess(),
        });
    },

    /**
     * Genera una partita di scacchi con le impostazioni passate
     * 
     * @param {string} gameId L'id della partita
     * @param {string} player1 L'username dell'utente 1
     * @param {string} player2 L'username dell'utente 2
     * @param {object} settings Contiene i settings del gioco
     */
    createNewGameSettings : function (gameId, player1, player2, settings) {
        // I settings sono fatti nel seguente modo:
        // {
        //     "time": {
        //         "minutes": 5,
        //         "seconds": 0
        //     },
        //     "increment": {
        //         "seconds": 0
        //     },
        //     "rating": {
        //         "minutes": 5,
        


        chessGames.push({
            gameId : gameId,
            player1 : player1,
            player2 : player2,
            chess: new Chess(),
        });
    },

    /**
     * Funzione che aggiunge una mossa al gioco con id gameId
     * 
     * @param {string} gameId 
     * @param {string} move 
     */
    addMove : function (gameId, move) {
        // Cerca la partita di scacchi
        var game = chessGames.find(game => game.gameId == gameId);
        // Aggiungi la mossa se è una mossa corretta
        if (game.chess.move(move)) {
            return true;
        } else {
            return false;
        }
    }
}