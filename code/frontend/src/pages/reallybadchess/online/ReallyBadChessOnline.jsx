import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Button, Box, Modal, Typography, Stack } from '@mui/material';
import ChessGameStyles from '../ChessGameStyles';
import Timer from '../timer/Timer';
import { Chess } from 'chess.js';

function ReallyBadChessOnline() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [gameData, setGameData] = useState(null);
    const [chess, setChess] = useState(new Chess());
    const [fen, setFen] = useState('8/8/8/8/8/8/8/8 w - - 0 1'); // Setting default empty board FEN
    const [timeBianco, setTimeBianco] = useState(0);
    const [timeNero, setTimeNero] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        fetch(`/api/reallybadchess/getGame/${gameId}`)
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

    const handleMove = (sourceSquare, targetSquare) => {
        fetch(`/api/reallybadchess/makeMove/${gameId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
                if (data.game.gameOver.isGameOver) {
                    setWinner(data.game.gameOver.winner);
                    setModalIsOpen(true);
                }
            }
        });
    };

    const handleCloseModal = () => setModalIsOpen(false);

    const handleNavigateToPlay = () => navigate('/play/');

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