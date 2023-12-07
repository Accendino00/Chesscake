import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Button, Box, Modal, Typography, Stack } from '@mui/material';
import ChessGameStyles from '../ChessGameStyles';
import Timer from '../timer/Timer';
import { Chess } from 'chess.js';
import { generateBoard, getPiecePosition, cloneChessBoard } from './boardFunctions';
import Cookies from 'js-cookie';
import useTokenChecker from '../../../utils/useTokenChecker';
import { CircularProgress } from '@mui/material';
import ShareButton from '../../components/ShareButton';

function ReallyBadChessOnline() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [gameData, setGameData] = useState(null);
    const [timeBianco, setTimeBianco] = useState(0);
    const [timeNero, setTimeNero] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [winner, setWinner] = useState(null);
    const [startingBoard, setStartingBoard] = useState();
    const [chess, setChess] = useState();
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [pieceSelected, setPieceSelected] = useState([]);
    const [moves, setMoves] = useState([]);
    const [fen, setFen] = useState();
    const [gameOver, setGameOver] = useState(false);


    // Nomi dei giocatori
    const [player1, setPlayer1] = useState();
    const [player2, setPlayer2] = useState();

    const [whiteTurn, setWhiteTurn] = useState(true);
    const [blackTurn, setBlackTurn] = useState(false); 

    // Se il secondo giocatore è arrivato
    const [player2Arrived, setPlayer2Arrived] = useState(false);

    const { loginStatus, isTokenLoading, username } = useTokenChecker();

    React.useEffect(() => {
        if (!isTokenLoading) {
            if (!loginStatus) {
                navigate("/login");
            } else {
                fetch('/api/reallybadchess/gameOver/' + gameId, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    },
                    //body deve contenere la partita che verrà salvata nell'account
                    body: JSON.stringify({}),
                })
                .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            setGameOver(data.game.gameOver.isGameOver);
                            setWinner(data.game.gameOver.winner);
                            setModalIsOpen(true);
                        }
                    });
            }
        }
    }, [gameOver, isTokenLoading, loginStatus]);

    const handleTimer = (timeColor) => {
        if(timeColor === timeBianco) {
            fetch('/api/reallybadchess/timer/' + gameId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
                body: {
                    'white': timeBianco,
                },
            })
            .then(response => response.json())
                .then(data => {
                    if (data.success) {

                            setTimeBianco(data.game.player1.timer);

                    }
                });
            }
            else {
                fetch('/api/reallybadchess/timer/' + gameId, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    },
                    body: {
                        'black': timeNero,
                    },
                })
                .then(response => response.json())
                    .then(data => {
                        if (data.success) {
    
                                setTimeNero(data.game.player2.timer);
    
                        }
                    });
                }
                




    }
    

    React.useEffect(() => {
        if (!isTokenLoading) {
            if (!loginStatus) {
                navigate("/login");
            }
            else {
                console.log(username)
                // Cose da fare se si è loggati, quindi poter giocare alla partita, etc.
                // Fetch iniziale per ottenere la partita
                fetch(`/api/reallybadchess/getGame/${gameId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json', 'Authorization': `Bearer ${Cookies.get('token')}`
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            setTimeBianco(data.game.player1.timer);
                            setTimeNero(data.game.player2.timer);
                            setGameData(data.game);
                            let newChess = new Chess(data.game.chess._header.FEN);
        
                            setFen(newChess.fen());
                            newChess.load(newChess.fen());
                            setChess(newChess);


                            // Se non ci sono entrambi i player, allora non imposto nulla
                            if (data.game.player1.username === null || data.game.player2.username === null) {
                                return;
                            } else {
                                setPlayer2Arrived(true);
                            }

                            // Imposto l'user 1 e l'user 2 usando il mio username
                            if (username === data.game.player1.username) {
                                setPlayer1(data.game.player1.username);
                                setPlayer2(data.game.player2.username);
                                console.log("colore player1:", data.game.player1.side)
                                console.log("colore player2:", data.game.player2.side)
                            } else {
                                setPlayer1(data.game.player2.username);
                                setPlayer2(data.game.player1.username);
                                console.log("colore player1:", data.game.player1.side)
                                console.log("colore player2:", data.game.player2.side)
                            }
                            
                        }
                    });

            }
        }
    }, [loginStatus, isTokenLoading]);


    useEffect(() => {
        // Guardia per evitare di iniziare il fetch se non abbiamo ancora i dati della partita
        if (!gameData || isTokenLoading || !loginStatus) {
            return;
        }

        const interval = setInterval(() => {
            fetch(`/api/reallybadchess/getGame/${gameId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setGameData(data.game);
                        let newChess = new Chess(data.game.chess._header.FEN);
    
                        setFen(newChess.fen());
                        newChess.load(newChess.fen());
                        setChess(newChess);


                        if (data.game.gameOver.isGameOver) {
                            setWinner(data.game.gameOver.winner);
                            setModalIsOpen(true);
                        }

                        // Se non ci sono entrambi i player, allora non imposto nulla
                        if (data.game.player1.username === null || data.game.player2.username === null) {
                            return;
                        } else {
                            setPlayer2Arrived(true);
                        }

                        // Imposto l'user 1 e l'user 2 usando il mio username
                        if (username === data.game.player1.username) {
                            setPlayer1(data.game.player1.username);
                            setPlayer2(data.game.player2.username);
                        } else {
                            setPlayer1(data.game.player2.username);
                            setPlayer2(data.game.player1.username);
                        }
                    }
                });
        }, 1000);

        return () => clearInterval(interval);
    }, [gameData, isTokenLoading, loginStatus, gameId, username]);

    // Gestore delle mosse possibili
    const handleMouseOverSquare = (square) => {
        const moves = chess.moves({ square, verbose: true });
        setPossibleMoves(moves.map(move => move.to));
    };

    const handleMouseOutSquare = () => {
        setPossibleMoves([]);
    };

    
    
    const handleMove = (sourceSquare, targetSquare) => {
        console.log("handlemove entrance:")
        if(username === gameData.player1.username) {
            if(gameData.lastMove === gameData.player1.side) {
                return;
            }
        }
        if(username === gameData.player2.username) {
            if(gameData.lastMove === gameData.player2.side) {
                return;
            }
        }
    

        fetch(`/api/reallybadchess/movePiece/${gameId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify({ from: sourceSquare, to: targetSquare, promotion: 'q' }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if(chess.turn() === 'w') {
                        handleTimer(timeBianco);
                    } else {
                        handleTimer(timeNero);
                    }
                    setGameData(data.game);
                    let newChess = new Chess(data.game.chess._header.FEN);
                    console.log("Before move:", newChess.fen());
                    setFen(newChess.fen());
                    newChess.load(newChess.fen());
                    setChess(newChess);
                    console.log("Component re-rendered!");
                    console.log("After move:", newChess.fen());
                    // Gestione del timer



                    //let isMyTurn = false;

                    /*  console.log("reallybadchess data:", data);
                    console.log("New FEN:", newChess.fen());
                    // Capiamo se sono il giocatore 1 o il giocatore 2
                    // Check if it's the current player's turn
                    if (username !== data.game.player1.username) {
                        // Capiamo se è il nostro turno
                        if (data.lastMove != data.game.player1.side || (data.lastMove == null && data.game.player1.side == 'white')) {
                            isMyTurn = true;
                        } else {
                            isMyTurn = false;
                        }
                    } else {
                        if (data.lastMove != data.game.player2.side) {
                            isMyTurn = true;
                        } else {
                            isMyTurn = false;
                        }
                    }

                    if (!isMyTurn) {
                        console.log("It's not your turn.");
                        // Handle the case where it's not the current player's turn (show a message, disable moves, etc.)
                    }
                        */
                    if (data.game.gameOver.isGameOver) {
                        setWinner(data.game.gameOver.winner);
                        setModalIsOpen(true);
                    }
                }
            });
    };


    const handleCloseModal = () => setModalIsOpen(false);
    const handleNavigateToPlay = () => navigate('/play/');
    const handleNavigatetoGame = () => navigate(`/play/reallybadchess/${gameId}`);




    if (isTokenLoading || loginStatus === undefined) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!player2Arrived) {
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
                    width: "400px",
                    padding: "30px",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.35)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    height: "300px",
                }}>
                    <Box>
                        <Typography variant="h4" sx={{ color: "black", fontWeight: "bolder" }}>
                            Sei in attesa di un altro giocatore
                        </Typography>
                        <Typography sx={{ color: "black", fontWeight: "thin" }}>
                            Invita i tuoi amici nella lobby se vuoi! Copia il link, oppure digli di cercare la tua partita nell'elenco delle lobby!
                        </Typography>
                    </Box>
                    <Button variant="contained" color="primary" onClick={() => {
                        // Copiare nella clipboard in path
                        navigator.clipboard.writeText(`http://localhost:3000/play/reallybadchess/${gameId}`);
                    }}>
                        Copia il link di invito!         </Button>
                    <ShareButton />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={ChessGameStyles.everythingContainer}>
            <Box sx={ChessGameStyles.boxTimer}>
                <Timer 
                time={timeBianco} 
                setTime={setTimeBianco}
                playerColor='white' />
                <Timer time={timeNero}
                setTime={setTimeNero}
                playerColor='black' />
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
                        
              <ShareButton text={winner==chess.player1 ? " Ho vinto questa partita in locale con " + chess.moveNumber() + ' mosse': "Ho perso questa partita in locale con " + chess.moveNumber() + " mosse"} />
            
                    </Stack>
                </Box>
            </Modal>
            <div style={ChessGameStyles.divChessBoard}>
                <Chessboard
                    position={fen}
                    onPieceDrop={ handleMove }
                    boardOrientation={
                        // L'utente può essere o bianco o nero e potrebbe essere o il player 1 o il player 2(
                        ( username === gameData.player1.username ) ? 
                        "black" : "white"
                    }
                    width={'50vh'}
                    onMouseOverSquare={handleMouseOverSquare}
                    onMouseOutSquare={handleMouseOutSquare}
                    customSquareStyles={{
                        ...possibleMoves.reduce((a, c) => ({ ...a, [c]: { background: "radial-gradient(rgba(0, 0, 0, 0.5) 20%, transparent 25%)" } }), {}),
                        ...pieceSelected.reduce((a, c) => ({ ...a, [c]: { background: "radial-gradient(rgba(255, 255, 0, 0.5) 70%, transparent 75%)" } }), {})
                    }}
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