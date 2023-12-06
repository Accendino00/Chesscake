import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Button, Box, Modal, Typography, Stack } from '@mui/material';
import ChessGameStyles from '../ChessGameStyles';
import Timer from '../timer/Timer';
import { Chess } from 'chess.js';
import { generateBoard, getPiecePosition, cloneChessBoard } from './boardFunctions';
import Cookies from 'js-cookie';

function ReallyBadChessOnline() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [fen, setFen] = useState('8/8/8/8/8/8/8/8 w - - 0 1');
  const [timeBianco, setTimeBianco] = useState(0);
  const [timeNero, setTimeNero] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [winner, setWinner] = useState(null);
  const [startingBoard, setStartingBoard] = useState(generateBoard());
  const [chess, setChess] = useState(cloneChessBoard(startingBoard));

  useEffect(() => {
      fetch(`/api/reallybadchess/getGame/${gameId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Cookies.get('token')}`
      },
      })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  setGameData(data.game);
                  const newChess = new Chess();
                  newChess.load(data.game.chess);
                  setChess(newChess);
                  setFen(newChess.fen());
                  setTimeBianco(data.game.player1.timer);
                  setTimeNero(data.game.player2.timer);
              }
          });
  }, [gameId]);

  useEffect(() => {
      // Guard clause to prevent interval from running until gameData is initialized
      if (!gameData) {
          return;
      }

      const interval = setInterval(() => {
          fetch(`/api/reallybadchess/getGame/${gameId}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Cookies.get('token')}`
            },
            })
              .then(response => response.json())
              .then(data => {
                  if (data.success) {
                      setGameData(data.game);
                      const newChess = new Chess();
                      newChess.load(data.game.chess);
                      setChess(newChess);
                      setFen(newChess.fen());
                      setTimeBianco(data.game.player1.timer);
                      setTimeNero(data.game.player2.timer);
                      if (data.game.gameOver.isGameOver) {
                          setWinner(data.game.gameOver.winner);
                          setModalIsOpen(true);
                      }
                  }
              });
      }, 1000);

      return () => clearInterval(interval);
  }, [gameData, gameId]);




  const handleMove = (sourceSquare, targetSquare) => {
    fetch(`/api/reallybadchess/movePiece/${gameId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Cookies.get('token')}`
     },
      body: JSON.stringify({ sourceSquare, destinationSquare: targetSquare }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const newChess = new Chess();
        newChess.load(data.game.chess);
        setChess(newChess);
        setFen(newChess.fen());
        setTimeBianco(data.game.player1.timer);
        setTimeNero(data.game.player2.timer);
  
        // Check if it's the current player's turn
        const isMyTurn = data.game.player1.turn; // Assuming player1 is the current user
        if (!isMyTurn) {
          console.log("It's not your turn.");
          // Handle the case where it's not the current player's turn (show a message, disable moves, etc.)
        }
  
        if (data.game.gameOver.isGameOver) {
          setWinner(data.game.gameOver.winner);
          setModalIsOpen(true);
        }
      }
    });
  };

    const onMouseOverSquare = square => {
        const moves = chess.moves({
            square,
            verbose: true,
        });

        if (moves.length === 0) {
            return;
        }

        const squaresToHighlight = [];
        for (const move of moves) {
            squaresToHighlight.push(move.to);
        }

        highlightSquare(square, squaresToHighlight);    
    };

    const onMouseOutSquare = () => {
        removeHighlightSquare();
    };

    const highlightSquare = (sourceSquare, squaresToHighlight) => {
        const highlightStyles = [getPiecePosition(sourceSquare)];

        for (const square of squaresToHighlight) {
            highlightStyles.push(getPiecePosition(square));
        }

        const highlightPositions = highlightStyles.reduce((a, b) => Object.assign(a, b), {});
        setFen(chess.fen());

        setStartingBoard(prevState => ({
            ...prevState,
            ...highlightPositions,
        }));

    };

    const removeHighlightSquare = () => {
        setFen(chess.fen());
        setStartingBoard(generateBoard());
    };



    const handleCloseModal = () => setModalIsOpen(false);

    const handleNavigateToPlay = () => navigate('/play/');

    const handleNavigatetoGame = () => navigate(`/play/reallybadchess/${gameId}`);

    return (
        <Box sx={ChessGameStyles.everythingContainer}>
            <Box sx={ChessGameStyles.boxTimer}>
                <Timer time={timeBianco} setTime={setTimeBianco} />
                <Timer time={timeNero} setTime={setTimeNero} />
            </Box>
            <Modal open={modalIsOpen} onClose={handleCloseModal}>
                <Box sx={ChessGameStyles.boxGameOver}>
                    <Stack spacing={2}>
                        <Typography variant="h5" component="h2" style={{ margin: "auto" }}>
                            {winner === 'Nessuno' ? 'Partita finita.' : `${winner} ha vinto!`}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleNavigateToPlay}>
                            Esci
                        </Button>
                        <Button variant="outlined" onClick={() => window.location.reload()}>
                            Ricomincia
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            <div style={ChessGameStyles.divChessBoard}>
                <Chessboard
                    position={fen}
                    onMouseOverSquare={onMouseOverSquare}
                    onMouseOutSquare={onMouseOutSquare}
                    onPieceDrop={handleMove}
                    boardOrientation={gameData?.player1?.side || 'white'}
                    width={'50vh'}
                />
            </div>
            <Box sx={ChessGameStyles.boxControlButtons}>
                <Button onClick={handleNavigateToPlay}>Esci</Button>
                <Button variant="contained" color="primary" onClick={() => setModalIsOpen(true)}>
                    Arrenditi
                </Button>
            </Box>
        </Box>
    );
}

export default ReallyBadChessOnline;