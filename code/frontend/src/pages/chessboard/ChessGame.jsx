import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useNavigate } from 'react-router-dom';
import ChessGameStyles from './ChessGameStyles';
import { getPiecePosition, calculateRanks, findChessPiecesWithRank } from './boardFunctions';
import { findBestMove } from './movesFunctions';
import Timer from './timer/Timer';
import Engine from '../../pages/chessboard/Engine';
import { Button, Box, Modal, Typography, Select, MenuItem, TextField, Card, Stack } from '@mui/material';
import { useMemo } from 'react';

const ChessGame = ({ mode, duration, rank, player1, player2 }) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [hasGeneratedBoard, setHasGeneratedBoard] = useState(false);
  const [modalIsOpen1, setModalIsOpen1] = useState(false);
  const [modalContent1, setModalContent1] = useState(<div/>);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [pieceSelected, setPieceSelected] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isReplay, setIsReplay] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [moves, setMoves] = useState([]);
  const [winner, setWinner] = useState(null);
  const [chess, setChess] = useState(generateBoard(mode, rank));
  const [timeBianco, setTimeBianco] = useState(duration * 60);
  const [timeNero, setTimeNero] = useState(duration * 60);
 
  let allGames = JSON.parse(localStorage.getItem('allGames')) || [];
  let isNextMoveAvailable = false;
  if (allGames[selectedGameId]) {
    isNextMoveAvailable = currentMove + 1 < allGames[selectedGameId].history.length;
  }
  let isPreviousMoveAvailable = currentMove - 1 >= 0;
  const stockfish = new Worker('/stockfish.js');

  const engine = useMemo(() => new Engine(), []);
  
  const [shouldRunWhite, setShouldRunWhite] = useState(true);
  const [shouldRunBlack, setShouldRunBlack] = useState(false);
  const [timerHasEnded, setTimerHasEnded] = useState(false);
  const [fen, setFen] = useState(chess.fen());
  const [undoEnabled, setUndoEnabled] = useState(false);
  const [endGameButtonEnabled, setEndGameButtonEnabled] = useState(true);

  // Gestire il cambiamento di hasEnded in true con un useEffect
  React.useEffect(() => {
    if (timerHasEnded) {
      handleGameOver(shouldRunWhite ? 'Nero' : 'Bianco');
    }
  }, [timerHasEnded]);

  // Funzione per generare la scacchiera
  function generateBoard(mode, rank){
    //Inizializzazione della scacchiera
    const newChess = new Chess();

    newChess.clear();
    
    // Caricamento pezzi
    let seed = 0;
    if (mode === 'dailyChallenge') {
      const today = new Date();
      seed = ((((((today.getFullYear() * 100 + today.getMonth() * 10 + today.getDate()) * 214013 + 2531011) >> 16) & 0x7fff) * 214013 + 2531011) >> 16) & 0x7fff; // Generazione seed giornaliero attraverso funzione di hashing
    }

    const [playerRank, opponentRank] = calculateRanks(rank, seed);
    const whitePieces = findChessPiecesWithRank(playerRank, seed);
    const blackPieces = findChessPiecesWithRank(opponentRank, seed);

    //const pieces = ['r', 'b', 'q', 'n', 'p'];  Da implementare per custom partite
    const whiteSquares = ['a1', 'b1', 'c1', 'd1', 'f1', 'g1', 'h1', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'];
    const blackSquares = ['a8', 'b8', 'c8', 'd8', 'f8', 'g8', 'h8', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'];

    // Generazione pezzi nella scacchiera
    while (whiteSquares.length > 0) {
      const randomIndex = Math.floor((seed === 0 ? Math.random() : seededRandom(seed)) * whiteSquares.length);
      newChess.put({ type: whitePieces.pop().name, color: 'w' }, whiteSquares[randomIndex]);
      whiteSquares.splice(randomIndex, 1);
    }
    newChess.put({ type: 'k', color: 'w' }, 'e1');

    while (blackSquares.length > 0) {
      const randomIndex = Math.floor((seed === 0 ? Math.random() : seededRandom(seed)) * blackSquares.length);
      newChess.put({ type: blackPieces.pop().name, color: 'b' }, blackSquares[randomIndex]);
      blackSquares.splice(randomIndex, 1);
    }
    newChess.put({ type: 'k', color: 'b' }, 'e8');

    if (!hasGeneratedBoard) {
      // Get the initial game state
      let initialState = newChess.fen();

      // Initialize the game history and the mode with the initial state
      setGameHistory(prevGameHistory => [...prevGameHistory, initialState]);

      // Save the game history to localStorage
      let allGames = JSON.parse(localStorage.getItem('allGames')) || [];
      localStorage.setItem('allGames', JSON.stringify(allGames));
    
      // Set hasGeneratedBoard to true
      setHasGeneratedBoard(true);
    }
    
    //Inizializzazione
    return newChess; 
  }

  const replayGame = (gameIndex) => {
    setIsReplay(true);
    // Set the current move to the first move
    setCurrentMove(0);

    let allGames = JSON.parse(localStorage.getItem('allGames')) || []; // Add default value
    console.log(allGames[gameIndex].history);
    if (gameIndex >= 0 && gameIndex < allGames.length) { // Check if gameIndex is a valid index in allGames
      let gameToReplay = allGames[gameIndex]; // Get the game to replay
      if (gameToReplay && gameToReplay.history) { // Check if gameToReplay and gameToReplay.history are defined
        console.log(gameToReplay.history);
        // Load the initial game state
        loadGameState(gameToReplay.history[currentMove]);
      } else {
        console.error(`No saved game found with index ${gameIndex}`);
      }
    } else {
      console.error(`Invalid game index: ${gameIndex}`);
    }
    setModalIsOpen1(false);
  };

  const handleOpenModal = () => {
    setUndoEnabled(false);
    setEndGameButtonEnabled(false);
    setShouldRunBlack(false);
    setShouldRunWhite(false);
    setModalIsOpen(true);
  };

  const handleOpenModal1 = () => {
    let allGames = JSON.parse(localStorage.getItem('allGames')) || [];
    if (allGames.length === 0) {
      setModalContent1(<p>No saved games found.</p>);
    } else {
      setModalContent1(
        <Select labelId="Choose game" value={selectedGameId} onChange={(event) => {
          setSelectedGameId(event.target.value);
          replayGame(event.target.value);
        }}
        sx={{
          width: '100%', // Set the width to 100%
          bgcolor: 'primary.main', // Set the background color to primary.main
          color: 'white', // Set the text color to white
          '& .MuiSelect-icon': { // Style the dropdown icon
            color: 'white', // Set the dropdown icon color to white
          },
        }}>
          {allGames.map((game, index) => (
            <MenuItem key={game.id} value={index} sx={{
              fontSize: '1.5rem', // Set the font size to 1.5rem
            }}>
              {`Game ${index + 1}`}
            </MenuItem>
          ))}
        </Select>
      );
    }
    setModalIsOpen1(true);
  };


  const loadGameState = (fen) => {
    chess.load(fen);
    setFen(chess.fen());
  };

  function handleNextMove() {
    let allGames = JSON.parse(localStorage.getItem('allGames')) || [];
    if (currentMove + 1 < allGames[selectedGameId].history.length) {
      // Load the next state from the game history
      let nextState = allGames[selectedGameId].history[currentMove + 1];
      loadGameState(nextState);
      // Increment the current move index
      setCurrentMove(currentMove => currentMove + 1);
    }
  }

  function handlePreviousMove() {
    let allGames = JSON.parse(localStorage.getItem('allGames')) || [];
    if (currentMove > 0) {
      // Decrement currentMove first
      setCurrentMove(currentMove - 1);
  
      // Then load the game state at the new currentMove
      loadGameState(allGames[selectedGameId].history[currentMove - 1]);
    }
  }


  function handleUndo() {
    // If only one move has been made, do not undo
    if (chess.history().length <= 1) {
      return;
    }

    // Undo the last move for the black piece
    chess.undo();

    // Undo the last move for the white piece
    chess.undo();

    // Update the position on the board
    setFen(chess.fen());
  }
  
  const handleCloseModal = () => {
    setModalIsOpen(false);
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
  
  //Gestore delle mosse possibili
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
    if(isReplay) return;
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
      //Gestione salvataggio mosse
      let newGameState = chess.fen();

      // Add the new game state to the game history
      setGameHistory(prevGameHistory => [...prevGameHistory, newGameState]);

      // Save the new game history to local storage
      let allGames = JSON.parse(localStorage.getItem('allGames')) || [];
      let currentGameIndex = allGames.length - 1;

      if (currentGameIndex < 0) {
        console.log("handleMove");
        allGames.push({ history: gameHistory }); // Initialize currentGame if it's undefined
      } else {
        allGames[currentGameIndex].history.push(newGameState);
      }

      localStorage.setItem('allGames', JSON.stringify(allGames));
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
  // Load the saved games from local storage
  let allGames = JSON.parse(localStorage.getItem('allGames')) || [];

  // Generate a unique ID for the new game
  let uniqueId = `Game ${allGames.length + 1}`;

  // Add the current game to allGames
  allGames.push({ id: uniqueId, history: gameHistory });

  // Save allGames to local storage
  localStorage.setItem('allGames', JSON.stringify(allGames));

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
                <Button variant="text" disabled>
                  Condividi su Facebook
                </Button>
              </Stack>
            </Box>
        </Modal>
    
      <Modal open={modalIsOpen1} onClose={() => setModalIsOpen1(false)}>
        <Box sx={{ display: 'flex', justifyContent:'center', alignItems:'center', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20%', height: '30%', bgcolor: 'background.paper', p: 2 }}> 
          <Typography variant="h6">Select a game to replay</Typography>
            {modalContent1}
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-end"
        height="10vh"
      >
      {isReplay ? (
        <>
          <Button variant="contained" color="primary" onClick={handlePreviousMove} disabled={!isPreviousMoveAvailable}>Previous move</Button>
          <Button variant="contained" color="primary" style={{ marginLeft: '20px' }} onClick={handleNextMove} disabled={!isNextMoveAvailable}>Next move</Button>    
          <Button variant="contained" color="primary" style={{ marginLeft: '20px' }} onClick={() => window.location.href = '/play'}>Stop Replay</Button>
        </>
      ) : (

      <>
        <Button variant="contained" color="primary" onClick={handleGameOver}>
          End Game
        </Button>
        {mode === 'playerVsPlayer' && 
          <Button variant="contained" color="primary" onClick={handleUndo} style={{ marginLeft: '20px' }}>Undo</Button>
        }
        <Button variant="contained" color="primary" onClick={ handleOpenModal1} style={{ marginLeft: '20px' }}> 
          Saved Games 
        </Button>
      </>
      )}
      </Box>
      </div>
    }
    </div>
  );
};

export default ChessGame;
                