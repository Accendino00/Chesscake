const Stockfish = require("./stockfish.js");
// Assuming Stockfish.js is loaded in the global scope
const stockfish = new Stockfish();

function findBestMove(fen, timeLimitInSeconds, depth) {
  return new Promise((resolve, reject) => {
    let bestMove = null;
    let isMoveFound = false;

    // Event listener for messages from Stockfish
    stockfish.onmessage = function(event) {
      if (typeof event === "string") {
        // Parsing the best move from Stockfish output
        if (event.startsWith("bestmove")) {
          bestMove = event.split(" ")[1];
          isMoveFound = true;
          resolve(bestMove);
        }
      }
    };

    // Send commands to Stockfish
    stockfish.postMessage("uci");
    stockfish.postMessage(`position fen ${fen}`);
    if (depth) {
        stockfish.postMessage(`go depth ${depth}`);
    } else {
        stockfish.postMessage(`go movetime ${timeLimitInSeconds * 1000}`);
    }

    // Handling time limit
    setTimeout(() => {
      if (!isMoveFound) {
        reject(new Error("Time limit exceeded"));
      }
    }, timeLimitInSeconds * 1000 + 100); // Adding a small buffer to ensure enough processing time
  });
}

module.exports.findBestMove = findBestMove;
