import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import SavedGames from './SavedGames';
import GameReplayer from './GameReplayer';
import { Button, Box, Modal, Typography, TextField, Card, Stack } from '@mui/material';
import ChessGameStyles from './ChessGameStyles';

import { generateBoard, getPiecePosition } from './boardFunctions';
import { findBestMove } from './movesFunctions';
import Timer from './timer/Timer';

import { useNavigate } from 'react-router-dom';

const ChessGame = ({ mode, duration, rank, player1, player2 }) => {
  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [pieceSelected, setPieceSelected] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [moves, setMoves] = useState([]);
  const [winner, setWinner] = useState(null);

  const [chess, setChess] = useState(generateBoard(mode, rank));

  const [timeBianco, setTimeBianco] = useState(duration * 60);
  const [timeNero, setTimeNero] = useState(duration * 60);
  const [shouldRunWhite, setShouldRunWhite] = useState(true);
  const [shouldRunBlack, setShouldRunBlack] = useState(false);
  const [timerHasEnded, setTimerHasEnded] = useState(false);

  const [undoEnabled, setUndoEnabled] = useState(false);
  const [endGameButtonEnabled, setEndGameButtonEnabled] = useState(true);

  // Gestire il cambiamento di hasEnded in true con un useEffect
  React.useEffect(() => {
    if (timerHasEnded) {
      handleGameOver(shouldRunWhite ? 'Nero' : 'Bianco');
    }
  }, [timerHasEnded]);

  const [history, setHistory] = useState([]);
  const [fen, setFen] = useState(chess.fen());

  const handleOpenModal = () => {
    setUndoEnabled(false);
    setEndGameButtonEnabled(false);
    setShouldRunBlack(false);
    setShouldRunWhite(false);


    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  function handleUndo() {
    setUndoEnabled(false);

    chess.undo();
    chess.undo();
    setFen(chess.fen());
    checkCheck();
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
    setFen(chess.fen());
    handleCloseModal();

    // Ricomincia il timer
    setTimeBianco(duration * 60);
    setTimeNero(duration * 60);
    setShouldRunWhite(true);
    setShouldRunBlack(false);
    setTimerHasEnded(false);

    // Riabilito i pulsanti
    setUndoEnabled(false);
    setEndGameButtonEnabled(false);
  };

  const handleShare = () =>{
    
  }

  // Gestore delle mosse possibili
  const handleMouseOverSquare = (square) => {
    const moves = chess.moves({ square, verbose: true });
    setPossibleMoves(moves.map(move => move.to));
  };

  const handleMouseOutSquare = () => {
    setPossibleMoves([]);
  };

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

      // Cambio di chi deve andare avanti il timer
      if (chess.turn() === 'w') {
        setShouldRunWhite(true);
        setShouldRunBlack(false);
      } else {
        setShouldRunWhite(false);
        setShouldRunBlack(true);
      }

      // Riabilito l'undo solo se e' la seconda mossa
      // Inoltre, se sto giocando player contro player locale lo abilito sempre se e' dopo la seconda
      // se gioco qualsiasi altra modalita' lo abilito solo se e' il bianco
      if ((mode === 'playerVsPlayer' && chess.history().length >= 2) || (mode !== 'playerVsPlayer' && chess.turn() === 'w' && chess.history().length >= 2)) {
        setUndoEnabled(true);
      }


      chess.fen();


      handleCheckmateAndDraw(chess);
    } catch (error) {
      console.log(error);
    }
    handleMouseOutSquare();
  };

  const computerMoveBlack = async () => {
    setUndoEnabled(false);

    // Mossa dell'avversario di risposta
    if (mode !== 'playerVsPlayer') {
      chess.fen();
      let chosenMove = chess.moves[Math.floor(Math.random() * chess.moves.length)];
      if (chess.moves().length > 0) {
        const bestMove = await findBestMove(chess.fen(), 2, 4);
        if (bestMove) {
          chosenMove = bestMove;
        }
        chess.move(chosenMove);
        setFen(chess.fen());
        checkCheck();
        setUndoEnabled(true);
      }
    }
  }

  const handleWhiteTurn = async (sourceSquare, targetSquare) => {
    if (chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })) {
      setFen(chess.fen());
      checkCheck();
      await computerMoveBlack();
    }
  };

  const handleBlackTurn = (sourceSquare, targetSquare) => {
    if (chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })) {
      setFen(chess.fen());
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
      handleGameOver(winner)
    } else if (chess.isDraw()) {
      handleGameOver('Patta');
    }
  }

  /**
   * Funzione che gestisce la fine della partita, in base al vincitore
   * 
   * @param {string} winner Nero, Bianco, Nessuno o altro (tradotto a Nessuno)
   */
  const handleGameOver = (winner) => {
    // Gestione del salvataggio della partita
    const savedGames = JSON.parse(localStorage.getItem('games')) || [];
    const newGame = { id: savedGames.length + 1, moves };
    savedGames.push(newGame);
    localStorage.setItem('games', JSON.stringify(savedGames));

    // Se diverso da undefined, nero o bianco allora lo imposto a nessuno
    if (winner !== undefined && winner !== 'Nero' && winner !== 'Bianco' && winner !== 'Patta') {
      winner = 'Nessuno';
    }
    setWinner(winner);
    handleOpenModal(true);
  };

  return (
    mode === 'playerVsPlayerOnline' ?
      <Box sx={ChessGameStyles.boxWIP}>
        <p>Ancora in fase di implementazione!</p>
        <Button variant="contained" color="primary" onClick={() => navigate('/play/')}>Esci</Button>
      </Box>
      :
      <div>
        {/* Timer del nero e del bianco */}
        {mode === 'playerVsPlayer' ?
          <Box sx={ChessGameStyles.boxTimer}>
            <Timer
              time={timeBianco}
              setTime={setTimeBianco}
              shouldRun={shouldRunWhite}
              setHasEnded={setTimerHasEnded}
              playerColor='white'
            />

            <Timer
              time={timeNero}
              setTime={setTimeNero}
              shouldRun={shouldRunBlack}
              setHasEnded={setTimerHasEnded}
              playerColor='black'
            />
          </Box> : null
        }
        {/* Popup che mostra la schermata di gameover */}
        <Modal open={modalIsOpen} onClose={handleCloseModal}>
          <Box sx={ChessGameStyles.boxGameOver}>
            <Stack spacing={2}>
              <Typography variant="h5" component="h2" style={{ margin: "auto" }}>
                {winner ? `${winner} ha vinto!` : 'Partita finita.'}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => navigate('/play/')}>
                Esci
              </Button>
              <Button variant="outlined" onClick={handleRestart} disabled="true">
                Ricomincia
              </Button>
              <Button variant="text" onClick={handleShare} disabled>
                Condividi su Facebook
              </Button>
            </Stack>
          </Box>
        </Modal>

        <div style={ChessGameStyles.divChessBoard}>
          <Chessboard
            position={fen}
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
          <Box sx={ChessGameStyles.boxTurns}>
            {/* Interfaccia che mostra di chi è il turno */}
            <div>
              <Typography variant="h6"><b>{chess.turn() === 'w' ? player1 : player2}'s</b> turn</Typography>
            </div>
            {mode === 'playerVsComputer' ?
              <Typography variant="h6">Player Vs Computer</Typography>
              :
              <Typography variant="h6">Player Vs Player</Typography>
            }
          </Box>

        </div>
        <Box sx={ChessGameStyles.boxControlButtons}>
          <Button onClick={() => navigate('/play/')}>Esci</Button>
          <Button variant="contained" color="primary" onClick={handleGameOver} disabled={!endGameButtonEnabled}>
            End Game
          </Button>
          <Button variant="contained" color="primary" onClick={handleUndo} disabled={!undoEnabled}>Undo</Button>
        </Box>


        {/* Interfaccia per la riproduzione di una partita salvata */}
        {/* Per ora disabilitata in quanto non implementata completamente */}
        {false &&
          <div>
            {selectedGameId ? (
              <GameReplayer gameId={selectedGameId} />
            ) : (
              <SavedGames onSelectGame={handleSelectGame} />
            )}
          </div>
        }
      </div>
  );
};

export default ChessGame;
