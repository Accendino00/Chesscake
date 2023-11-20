import Engine from './Engine.ts';

const engine = new Engine();

// Function to handle the Stockfish.js call through a web worker defined in Engine
async function findBestMove(fen, timeLimitInSeconds, depth) {
  return new Promise((resolve, reject) => {
    engine.onMessage((messageData) => { // Receives the message from Stockfish.js
      if (messageData.bestMove) {  // If there is a best move
        resolve(messageData.bestMove);
      } else if (messageData.info) { // If it didn't find one or has an error
        reject(messageData.info);
      }
    });
    engine.evaluatePosition(fen, depth);  // Call to Stockfish.js
    engine.searchBestMoveWithTimeLimit(fen, timeLimitInSeconds);  // Sets the time limit for the move
  });
}

export { findBestMove };
