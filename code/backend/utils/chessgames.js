var { Chess } = require('chess.js');
var { generateBoard, getPiecePosition, cloneChessBoard } = require('./boardFunctions');  

var chessGames = [];

module.exports = {
    chessGames,

    /**
     * Genera una partita di scacchi con le impostazioni passate
     * 
     * @param {string} gameId L'id della partita
     * @param {string} player1 L'username dell'utente 1
     * @param {string} player2 L'username dell'utente 2
     * @param {object} settings Contiene i settings del gioco
     */
    createNewGameWithSettings : function (player1, player2, settings) {
        // I settings sono fatti nel seguente modo:
        // {
        //     "mode": "playerVsComputer", "dailyChallenge", "playerVsPlayerOnline",
        //     "rank": <numero>
        //     "duration": <numero> // In minuti, indica il tempo della partita. 0.25 corrisponde a 15 secondi per esempio.
        // }

        // Generiamo le key per i due giocatori in modo che sia impossibile che siano uguali
        var keyPlayer1 = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        var keyPlayer2 = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Generiamo un gameId univoco
        var gameId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Generiamo la board in modo casuale
        var board = null;

        // Se è la daily challenge, allora impostiamo lo stesso rank per tutti
        if (settings.mode == "dailyChallenge") {
            board = generateBoard(20, "dailyChallenge");
        } else {
            // In caso contrario lo generiamo in modo casuale
            board = generateBoard(settings.rank, null);
        }

        // Aggiungiamo la partita di scacchi
        chessGames.push({
            gameSettings : {
                mode : settings.mode,
                rank : settings.rank,
                duration : settings.duration,
            },
            player1 : {
                name: player1,
                key: keyPlayer1,
            },
            player2 : {
                name: player2,
                key: keyPlayer2,
            },

            lastMove : null, // "w" o "b" per indicare chi ha mosso per ultimo
            
            gameId : gameId,
            chess: cloneChessBoard(board),
        });

        // Ritorniamo l'id della partita e le chiavi dei giocatori
        return {
            gameId : gameId,
            keyPlayer1 : keyPlayer1,
            keyPlayer2 : keyPlayer2,
        };
    },

    /**
     * Ricerchiamo la partita e la ritorniamo usando l'id
     * 
     * @param {string} gameId Id univoco della partita
     * @returns L'elemento dell'array che corrisponde alla partita
     */
    getGame : function (gameId) {
        // Cerca la partita di scacchi
        var game = chessGames.find(game => game.gameId == gameId);
        // Ritorna la board
        return game;
    },

    /**
     * Funzione che aggiunge una mossa al gioco con id gameId
     * 
     * @param {string} gameId
     * @param {string} move
     */
    movePiece : function (gameId, move) {
        // Cerca la partita di scacchi
        var game = chessGames.find(game => game.gameId == gameId);

        // Aggiungi la mossa se è una mossa corretta
        if (game.chess.move(move)) {
            game.lastMove = game.chess.turn();
            return true;
        } else {
            return false;
        }
    }
}