import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Button, Box, Modal, Typography, Stack } from '@mui/material';
import ChessGameStyles from '../ChessGameStyles';

import { generateBoard, getPiecePosition, cloneChessBoard } from './boardFunctions';
import Timer from '../timer/Timer';


function ReallyBadChessOnline() {
    const [searchParams] = useSearchParams();
    const gameData = JSON.parse(searchParams.get('data'));

    const [startingBoard, setStartingBoard] = useState(generateBoard(gameData.mode, gameData.rank));

    const navigate = useNavigate();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [pieceSelected, setPieceSelected] = useState([]);
    const [moves, setMoves] = useState([]);
    const [winner, setWinner] = useState(null);

    const [chess, setChess] = useState(cloneChessBoard(startingBoard));

    const [timeBianco, setTimeBianco] = useState(gameData.duration * 60);
    const [timeNero, setTimeNero] = useState(gameData.duration * 60);
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

    useEffect(() => {
        setFen(chess.fen());
    }, [chess]);

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

        // Ricomincia il timer
        setTimeBianco(gameData.duration * 60);
        setTimeNero(gameData.duration * 60);
        setShouldRunWhite(true);
        setShouldRunBlack(false);
        setTimerHasEnded(false);

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
            let token = Cookies.get('token')

            let headers = {};

            if (token) {
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Cookies.get('token') || ''
                }
            } else {
                headers = {
                    'Content-Type': 'application/json',
                }
            }

            const moveData = {
                sourceSquare: sourceSquare,
                targetSquare: targetSquare,
            }
            fetch('api/reallybadchess/movePiece', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(moveData),
            }).then(response => response.json()).then(data => {
                if (data.success) {
                    // Mostra visivamente che ho mosso il pezzo
                    // E cambi la modalità di funzionamento in "in attesa dell'avversario"
                    if (chess.turn() === 'w') {
                        handleWhiteTurn(sourceSquare, targetSquare);
                    } else if (chess.turn() === 'b') {
                        handleBlackTurn(sourceSquare, targetSquare);
                    }
                } else {
                    console.log(data)
                }
            })




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
            if (chess.history().length >= 2) {
                setUndoEnabled(true);
            }

            handleCheckmateAndDraw(chess);
        } catch (error) {
            console.log(error);
        }
        handleMouseOutSquare();
    };

    const handleWhiteTurn = async (sourceSquare, targetSquare) => {
        if (chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })) {
            setFen(chess.fen());
            checkCheck();
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
            {/* Timer del nero e del bianco */}
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
            </Box>
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
                    {gameData.mode === 'playerVsComputer' ?
                        <Typography variant="h6">Player Vs Computer</Typography>
                        :
                        <Typography variant="h6">Player Vs Player</Typography>
                    }
                </Box>

            </div>
            <Box sx={ChessGameStyles.boxControlButtons}>
                <Button onClick={() => navigate('/play/')}>Esci</Button>
                <Button variant="contained" color="primary" onClick={handleGameOver} disabled={!endGameButtonEnabled}>
                    Arrenditi
                </Button>
                <Button variant="contained" color="primary" onClick={handleUndo} disabled={!undoEnabled}>Undo</Button>
            </Box>
        </Box>
    );
}

export default ReallyBadChessOnline;