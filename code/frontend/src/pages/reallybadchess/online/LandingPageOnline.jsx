import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Button, Box, Modal, Typography, Stack } from '@mui/material';
import ChessGameStyles from '../ChessGameStyles';
import Timer from '../timer/Timer';
import { Chess } from 'chess.js';

function LandingPageOnline({openLobby}) {
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const navigate = useNavigate();

    const handleCloseModal = () => {
        setModalIsOpen(false);
        navigate('../')
    }
    const handleOpenModal = () => setModalIsOpen(true);


    return (
        <Box sx={ChessGameStyles.everythingContainer}>
            <Modal open={modalIsOpen} onClose={handleCloseModal}>
                <Box sx={ChessGameStyles.modal}>
                    {/* Buttons to join or create a game */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/reallybadchess/lobby/joinGame')}
                    >
                        Join Game
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/reallybadchess/lobby/createGame')}
                    >
                        Create Game
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}


export default LandingPageOnline;