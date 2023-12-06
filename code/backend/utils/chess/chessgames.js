var { Chess } = require('chess.js');
var { generateBoard, getPiecePosition, cloneChessBoard } = require('./boardFunctions');  
const { set } = require('../../server');

var chessGames = [];

module.exports = {
    chessGames,
    
    setBoard : function () {
        var newChess = new Chess();
        let seed = 0;
        newChess.clear();
    
        // Caricamento pezzi
        
        const [playerRank, opponentRank] = calculateRanks(50, seed);
        const whitePieces = findChessPiecesWithRank(playerRank, seed);
        const blackPieces = findChessPiecesWithRank(opponentRank, seed);
    
        const whiteSquares = ['a1', 'b1', 'c1', 'd1', 'f1', 'g1', 'h1', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'];
        const blackSquares = ['a8', 'b8', 'c8', 'd8', 'f8', 'g8', 'h8', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'];
    
        // Generazione pezzi nella scacchiera
        while (whiteSquares.length > 0) {
            const randomIndex = Math.floor((seed === 0 ? Math.random() : seededRandom(seed)) * whiteSquares.length);
            newChess.put({ type: whitePieces.pop().name, color: 'w' }, whiteSquares[randomIndex]);
            whiteSquares.splice(randomIndex, 1);
        }
        newChess.put({ type: 'k', color: 'w' }, 'e1');
    
        while (blackSquares.length > 0) {
            const randomIndex = Math.floor((seed === 0 ? Math.random() : seededRandom(seed)) * blackSquares.length);
            newChess.put({ type: blackPieces.pop().name, color: 'b' }, blackSquares[randomIndex]);
            blackSquares.splice(randomIndex, 1);
        }
        newChess.put({ type: 'k', color: 'b' }, 'e8');
    
        // Inizializzazione
        return newChess;
    },
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

        // Generiamo un gameId univoco
        var gameId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        var board = null;
        // Generiamo la board in modo casuale
        if(settings.mode == "playerVsPlayerOnline"){
            var chess = new Chess();
        
        } 
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
                username: player1,
                timer: settings.duration * 60,
                interval: null,
                gameSaved : false,
                side: "w",
            },
            player2 : {
                username: player2,
                timer: settings.duration * 60,
                interval: null,
                gameSaved : false,
                side: "b",
            },

            lastMove : null, // "w" o "b" per indicare chi ha mosso per ultimo

            gameOver: {
                isGameOver : false,
                winner : null, // Username dell'utente che ha visto
                reason : null, // "checkmate", "timeout", "resign", "stalemate", "draw", "insufficient_material", "threefold_repetition", "50_move_rule", "agreement"
                deleteGameInterval : null, // Intervallo che cancella la partita dopo un certo tempo dopo che è finita
            },
            
            gameId : gameId,
            chess: chess,
        });

        // Ritorniamo l'id della partita e le chiavi dei giocatori
        return {
            gameId : gameId,
        };
    }, 
    joinGame : function (gameId, player2) {
        // Cerca la partita di scacchi
        var game = chessGames.find(game => game.gameId == gameId);

        // Aggiungiamo il giocatore 2
        game.player2.username = player2;
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


    getEmptyGames : function () {
        var emptyGames = [];
        chessGames.forEach(game => {
            if (game.player2.username == null && game.gameSettings.mode == "playerVsPlayerOnline") {
                emptyGames.push(game);
            }
        });

        return emptyGames;
    },
    /**
     * Funzione che aggiunge una mossa al gioco con id gameId
     * 
     * @param {string} gameId
     * @param {string} move
     * @returns true se la mossa è stata aggiunta, false altrimenti
     */
    movePiece : function (gameId, move) {
        // Cerca la partita di scacchi
        var game = chessGames.find(game => game.gameId == gameId);

        // Aggiungi la mossa se è una mossa corretta
        if (game.chess.move(move)) {
            // Se la mossa è corretta
            game.lastMove = game.chess.turn(); // Aggiorno di chi è il turno

            // Aggiorno il timer in modo che interrompo l'ultimo intervallo
            // e avvio quello del giocatore che deve muovere
            clearInterval(game.player1.interval);
            game.player1.interval = setInterval(() => {
                game.player1.timer--;
                if (game.player1.timer <= 0) {
                    clearInterval(game.player1.interval);
                    
                    // Gestisco la sconfitta del giocatore 1
                    game.gameOver.isGameOver = true;
                    game.gameOver.winner = game.player2.side;
                    game.gameOver.reason = "timeout";
                    game.gameOver.deleteGameInterval = setTimeout(() => {
                        chessGames.splice(chessGames.indexOf(game), 1);
                    }, 1000 * 60 * 5); // Il game si cancellerà da solo dopo 5 minuti
                }
            }, 1000);

            return true;
        } else {
            return false;
        }
    }
}