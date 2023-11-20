import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import SavedGames from './SavedGames';
import GameReplayer from './GameReplayer';
import { Button, Box, Modal, Typography } from '@mui/material';
import { generateBoard, getPiecePosition } from './boardFunctions';
import { findBestMove } from './movesFunctions';

const ChessGame = ({ mode, duration, rank, player1, player2 }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [pieceSelected, setPieceSelected] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [moves, setMoves] = useState([]);
  const [winner, setWinner] = useState(null);

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  function handleUndo() {
    chess.undo();
    setFen(chess.fen());
  }

  const replayGame = (savedMoves) => {
    let replayChess = new Chess();
  
    for (let move of savedMoves) {
      replayChess.move(move);
    }
  
    setFen(replayChess.fen());
  };

  const handleRestart = () => {
    // Ricomincia la partita
    setWinner(null);
    setMoves([]);
    setPieceSelected([]);
    setPossibleMoves([]);
    setChess(generateBoard(mode, rank));
    handleCloseModal();
  };

  // Gestore delle mosse possibili
  const handleMouseOverSquare = (square) => {
    const moves = chess.moves({ square, verbose: true });
    setPossibleMoves(moves.map(move => move.to));
  };

  const handleMouseOutSquare = () => {
    setPossibleMoves([]);
  };

  const [chess, setChess] = useState(generateBoard(mode, rank));

  const handleSelectGame = (gameId) => {
    setSelectedGameId(gameId);
  };

  const handleMove = async (sourceSquare, targetSquare) => {
    try {
      if (chess.turn() === 'w') {
        await handleWhiteTurn(sourceSquare, targetSquare);
      } else if (chess.turn() === 'b' && mode === 'playerVsPlayer') {
        handleBlackTurn(sourceSquare, targetSquare);
      }
      chess.fen();
      handleCheckmateAndDraw(chess);
    } catch (error) {
      console.log(error);
    }
    handleMouseOutSquare();
  };

  const handleWhiteTurn = async (sourceSquare, targetSquare) => {
    if (chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })) {
      checkCheck();
      if (mode !== 'playerVsPlayer') {
        chess.fen();
        let chosenMove = chess.moves[Math.floor(Math.random() * chess.moves.length)];
        if (chess.moves().length > 0) {
          const bestMove = await findBestMove(chess.fen(), 2, 4);
          if (bestMove) {
            chosenMove = bestMove;
          }
          chess.move(chosenMove);
          checkCheck();
        }
      }
    }
  };

  const handleBlackTurn = (sourceSquare, targetSquare) => {
    if (chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })) {
      checkCheck();
    }
  };

  // Funzione per controllare se c'è scacco, ed evidenziare chi
  function checkCheck() {
    if (chess.isCheck()) {
      setPieceSelected(getPiecePosition(chess, { type: 'k', color: chess.turn() === 'b' ? 'b' : 'w' }));
    } else {
      setPieceSelected([]);
    }
  }

  // Funzione per controllare se c'è un vincitore
  function handleCheckmateAndDraw(chess) {
    if (chess.isCheckmate()) {
      const winner = chess.turn() === 'w' ? 'Nero' : 'Bianco';
      setWinner(winner);
      handleOpenModal();
    } else if (chess.isDraw()) {
      setWinner('Patta');
      handleOpenModal();
    }
  }

  const handleGameOver = () => {
    const savedGames = JSON.parse(localStorage.getItem('games')) || [];
    const newGame = { id: savedGames.length + 1, moves };
    savedGames.push(newGame);
    localStorage.setItem('games', JSON.stringify(savedGames));
    setWinner('Nessuno');
    setModalIsOpen(true);
  };

  return (
    <div>
      <div>
        <Typography variant="h4">{chess.turn() === 'w' ? player1 : player2}'s turn</Typography>
      </div>
      <Modal open={modalIsOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20%', height: '30%', bgcolor: 'background.paper', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2>{winner ? `${winner} ha vinto!` : 'Partita finita.'}</h2>
          </Box>
          <Button onClick={() => window.location.href = '/'}>Esci</Button>
          <Button onClick={handleRestart}>Ricomincia</Button>
          <Button>Condividi su Facebook</Button>
        </Box>
      </Modal>

      {mode === 'playerVsPlayerOnline' ?
        <p>Ancora in fase di implementazione!</p>
        :
        <div>
          {mode === 'playerVsComputer' ?
            <h1>PLAYER VS COMPUTER</h1>
            :
            <h1>PLAYER VS PLAYER</h1>
          }

          <Chessboard
            position={chess.fen()}
            onMouseOverSquare={(mode === 'playerVsComputer' && chess.turn() === 'w')
              || mode !== 'playerVsComputer' ? handleMouseOverSquare : undefined}
            onMouseOutSquare={handleMouseOutSquare}
            customSquareStyles={{
              ...possibleMoves.reduce((a, c) => ({ ...a, [c]: { background: "radial-gradient(rgba(0, 0, 0, 0.5) 20%, transparent 25%)" } }), {}),
              ...pieceSelected.reduce((a, c) => ({ ...a, [c]: { background: "radial-gradient(rgba(255, 255, 0, 0.5) 70%, transparent 75%)" } }), {})
            }}
            onPieceDrop={handleMove}
            boardOrientation="white"
            width={'50vh'}
          />
        </div>
      }
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-end"
        height="10vh"
      >
        <Button variant="contained" color="primary" onClick={handleGameOver}>
          End Game
        </Button>
        {mode === 'playerVsPlayer' && 
        <Button variant="contained" color="primary" onClick={handleUndo} style={{ marginLeft: '20px' }}>Undo</Button>
        }
      </Box>
      <div>
        {selectedGameId ? (
          <GameReplayer gameId={selectedGameId} />
        ) : (
          <SavedGames onSelectGame={handleSelectGame} />
        )}
      </div>
    </div>
  );
};

export default ChessGame;
