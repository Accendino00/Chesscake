import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChessStart from './../code/frontend/src/pages/chessboard/ChessStart';
import { startServer, handleShutdown} from './../code/backend/server.js';

describe('ChessStart', () => {

  beforeAll(async () => {
    await startServer(); // Start the server before running the tests
    await new Engine().init();
    
  });
  afterAll(async () => {
    await handleShutdown(); // Close the server after running the tests
  });

  test('renders ChessStart component', () => {
    render(<ChessStart />);
    const chessStartElement = screen.getByTestId('chess-start');
    expect(chessStartElement).toBeInTheDocument();
  });

  test('updates mode state on mode change', () => {
    render(<ChessStart />);
    const modeSelect = screen.getByLabelText('Mode');
    fireEvent.change(modeSelect, { target: { value: 'playerVsPlayer' } });
    expect(modeSelect.value).toBe('playerVsPlayer');
  });

  test('updates duration state on duration change', () => {
    render(<ChessStart />);
    const durationSelect = screen.getByLabelText('Duration');
    fireEvent.change(durationSelect, { target: { value: 10 } });
    expect(durationSelect.value).toBe('10');
  });

  test('updates player1 state on player1 input change', () => {
    render(<ChessStart />);
    const player1Input = screen.getByLabelText('Player 1');
    fireEvent.change(player1Input, { target: { value: 'John' } });
    expect(player1Input.value).toBe('John');
  });

  test('updates player2 state on player2 input change', () => {
    render(<ChessStart />);
    const player2Input = screen.getByLabelText('Player 2');
    fireEvent.change(player2Input, { target: { value: 'Jane' } });
    expect(player2Input.value).toBe('Jane');
  });

  test('updates rank state on slider change', () => {
    render(<ChessStart />);
    const rankSlider = screen.getByLabelText('Rank');
    fireEvent.change(rankSlider, { target: { value: 75 } });
    expect(rankSlider.value).toBe('75');
  });

  test('starts game on button click', () => {
    render(<ChessStart />);
    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);
    const chessGameElement = screen.getByTestId('chess-game');
    expect(chessGameElement).toBeInTheDocument();
  });
});
