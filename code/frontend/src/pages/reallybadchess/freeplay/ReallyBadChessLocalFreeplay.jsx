import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Button, Box, Modal, Typography, Stack } from '@mui/material';
import ChessGameStyles from '../ChessGameStyles';

import { generateBoard, getPiecePosition, cloneChessBoard } from './boardFunctions';
import { findBestMove } from './movesFunctions';

function ReallyBadChessLocalFreeplay() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const gameData = JSON.parse(searchParams.get('data'));

  // Nel caso si arriva qua senza essere passati per la pagina di selezione della modalita'
  if (gameData === null) {
    // Ritorniamo un messaggio di errore
    return (
      <Box sx={{
        display: "flex",
        height: "100vh",
        width: "50vh",
        marginTop: "0px",
        margin: "auto",
        flexDirection: "column",
        alignContent: "space-between",
        flexWrap: "nowrap",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Box sx={{
          backgroundColor: "white",
          width: "50vh",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "20vh",
        }}>
          <Box>
            <Typography variant="h4" sx={{ color: "red", fontWeight: "bolder" }}>
              Errore
            </Typography>
            <Typography sx={{ color: "red", fontWeight: "thin" }}>
              Non sei passato per la selezione della modalità di gioco!
            </Typography>
          </Box>
          <Button variant="contained" color="primary" onClick={() => navigate('/play/reallybadchess')}>
            Torna alla selezione della modalità         </Button>
        </Box>
      </Box>
    );
  }

  const [startingBoard, setStartingBoard] = useState(generateBoard(gameData.mode, gameData.rank));


  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [pieceSelected, setPieceSelected] = useState([]);
  const [moves, setMoves] = useState([]);
  const [winner, setWinner] = useState(null);

  const [chess, setChess] = useState(cloneChessBoard(startingBoard));

  const [undoEnabled, setUndoEnabled] = useState(false);
  const [endGameButtonEnabled, setEndGameButtonEnabled] = useState(true);

  useEffect(() => {
    setFen(chess.fen());
  }, [chess]);

  const [fen, setFen] = useState(chess.fen());

  const handleOpenModal = () => {
    setUndoEnabled(false);
    setEndGameButtonEnabled(false);

    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  function handleUndo() {
    setUndoEnabled(false);

    chess.undo();
    chess.undo();
    checkCheck();
    setFen(chess.fen());
  }

  const handleRestart = () => {
    // Ricomincia la partita
    setWinner(null);
    setMoves([]);
    setPieceSelected([]);
    setPossibleMoves([]);
    setChess(cloneChessBoard(startingBoard));
    handleCloseModal();

    // Riabilito i pulsanti
    setUndoEnabled(false);
    setEndGameButtonEnabled(true);
  };

  // Gestore delle mosse possibili
  const handleMouseOverSquare = (square) => {
    const moves = chess.moves({ square, verbose: true });
    setPossibleMoves(moves.map(move => move.to));
  };

  const handleMouseOutSquare = () => {
    setPossibleMoves([]);
  };

  const handleMove = async (sourceSquare, targetSquare) => {
    try {
      if (chess.turn() === 'w') {
        await handleWhiteTurn(sourceSquare, targetSquare);
      } else if (chess.turn() === 'b') {
        handleBlackTurn(sourceSquare, targetSquare);
      }

      // Riabilito l'undo solo se e' la seconda mossa
      // Inoltre, se sto giocando player contro player locale lo abilito sempre se e' dopo la seconda
      // se gioco qualsiasi altra modalita' lo abilito solo se e' il bianco
      if (chess.history().length >= 2) {
        setUndoEnabled(true);
      }

      handleCheckmateAndDraw(chess);
    } catch (error) {
      console.log(error);
    }
    handleMouseOutSquare();
  };

  const computerMoveBlack = async () => {
    setUndoEnabled(false);

    // Mossa dell'avversario di risposta
    if (gameData.mode !== 'playerVsPlayer') {
      chess.fen();
      let chosenMove = chess.moves()[Math.floor(Math.random() * chess.moves().length)];
      if (chess.moves().length > 0) {
        let bestMove = chess.moves()[Math.floor(Math.random() * chess.moves().length)];
        switch (gameData.difficulty) {
          case 0:
            bestMove = chess.moves()[Math.floor(Math.random() * chess.moves().length)];
            break;
          case 1:
            bestMove = await findBestMove(chess.fen(), 2, 0);
            break;
          case 2:
            bestMove = await findBestMove(chess.fen(), 2, 3);
            break;
        }
        if (bestMove) {
          chosenMove = bestMove;
        }
        // Wait 1 second before move
        setTimeout(() => {
          chess.move(chosenMove);
          setFen(chess.fen());
          checkCheck();
          setUndoEnabled(true);
        }, 1000);
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
    <Box sx={ChessGameStyles.everythingContainer}>
      <Box sx={ChessGameStyles.backgroundWrapper}>
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
              <Button variant="outlined" onClick={handleRestart}>
                Ricomincia
              </Button>
              <Button variant="text" disabled>
                Condividi su Facebook
              </Button>
            </Stack>
          </Box>
        </Modal>

        <div style={ChessGameStyles.divChessBoard}>
          <Chessboard
            position={fen}
            onMouseOverSquare={(gameData.mode === 'playerVsComputer' && chess.turn() === 'w')
              || gameData.mode !== 'playerVsComputer' ? handleMouseOverSquare : undefined}
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
              <Typography variant="h6"><b>{chess.turn() === 'w' ? gameData.player1 : gameData.player2}'s</b> turn</Typography>
            </div>
            <Typography variant="h6">Freeplay vs Computer</Typography>
          </Box>

        </div>
        <Box sx={ChessGameStyles.boxControlButtons}>
          <Button onClick={() => navigate('/play/')}>Esci</Button>
          <Button variant="contained" color="primary" onClick={() => handleGameOver('Nero')} disabled={!endGameButtonEnabled}>
            Arrenditi
          </Button>
          <Button variant="contained" color="primary" onClick={handleUndo} disabled={!undoEnabled}>Undo</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ReallyBadChessLocalFreeplay;
