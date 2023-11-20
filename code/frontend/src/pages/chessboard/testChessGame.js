import { render, fireEvent } from '@testing-library/react';
import ChessGame from './ChessGame';

describe('ChessGame', () => {
  let chessGame;
  beforeEach(() => {
    chessGame = render(<ChessGame mode="playerVsPlayer" duration={5} rank={1} player1="Player 1" player2="Player 2" />);
  });

  test('handleOpenModal sets modalIsOpen to true', () => {
    chessGame.handleOpenModal();
    expect(chessGame.state.modalIsOpen).toBe(true);
  });

  test('handleCloseModal sets modalIsOpen to false', () => {
    chessGame.handleCloseModal();
    expect(chessGame.state.modalIsOpen).toBe(false);
  });

  test('handleRestart resets the game', () => {
    chessGame.handleRestart();
    expect(chessGame.state.winner).toBe(null);
    expect(chessGame.state.moves).toEqual([]);
    expect(chessGame.state.pieceSelected).toEqual([]);
    expect(chessGame.state.possibleMoves).toEqual([]);
  });

  test('handleGameOver ends the game', () => {
    chessGame.handleGameOver();
    expect(chessGame.state.winner).toBe('Nessuno');
    expect(chessGame.state.modalIsOpen).toBe(true);
  });
});