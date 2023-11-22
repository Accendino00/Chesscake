import { findBestMove } from './../code/frontend/src/pages/chessboard/movesFunctions';

import { startServer, handleShutdown} from './../code/backend/server.js';

describe('findBestMove', () => {
  beforeAll(async () => {
    await startServer(); // Start the server before running the tests
    
  });
  afterAll(async () => {
    await handleShutdown(); // Close the server after running the tests
  });

  test('returns the best move when a valid move is found', async () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const timeLimitInSeconds = 5;
    const depth = 3;

    const bestMove = await findBestMove(fen, timeLimitInSeconds, depth);

    expect(bestMove).toBeDefined();
    // Add more assertions to validate the best move
  });

  test('rejects with an error message when no valid move is found', async () => {
    const fen = '8/8/8/8/8/8/8/8 w - - 0 1';
    const timeLimitInSeconds = 5;
    const depth = 3;

    await expect(findBestMove(fen, timeLimitInSeconds, depth)).rejects.toMatch('No valid move found');
  });

  test('rejects with an error message when there is an error', async () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const timeLimitInSeconds = 5;
    const depth = 3;

    await expect(findBestMove(fen, timeLimitInSeconds, depth)).rejects.toMatch('Error occurred');
  });

  // Add more test cases to cover different scenarios and edge cases
});