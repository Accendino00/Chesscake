import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Button, Box, Modal, Typography, Stack } from "@mui/material";
import GameStyles from "./GameStyles";
import Timer from "../../reallybadchess/timer/Timer";
import { Chess } from "chess.js";
import {
  generateBoard,
  getPiecePosition,
  cloneChessBoard,
} from "./boardFunctions";

import Cookies from "js-cookie";
import useTokenChecker from "../../../utils/useTokenChecker";
import { CircularProgress } from "@mui/material";
import ShareButton from "../../components/ShareButton";
import { RemoveShoppingCartRounded } from "@mui/icons-material";
import { TextField } from "@mui/material";

function Kriegspiel() {
  // Hook generali e utili
  const navigate = useNavigate();
  const { loginStatus, isTokenLoading, username } = useTokenChecker();

  // Game id della partita, serve a fare le richieste
  const { gameId } = useParams();

  // Stato della partita
  const [gameData, setGameData] = useState(null); // campo "chess" che viene ritornato da "get"
  const [timeBianco, setTimeBianco] = useState(0); // La quantità di tempo che è rimasta al giocatore bianco
  const [timeNero, setTimeNero] = useState(0); // La quantità di tempo che è rimasta al giocatore nero
  const [chess, setChess] = useState(new Chess().clear()); // La partita di scacchi vera e propria
  const [possibleMoves, setPossibleMoves] = useState([]); // Le mosse possibili
  const [pieceSelected, setPieceSelected] = useState([]); // La pedina selezionata
  const [fen, setFen] = useState(); // Il "fen" della partita

  const [currentTurn, setCurrentTurn] = useState("white"); // Per indicare di chi è il turno attuale

  // Cose inerenti al gameOver
  const [winner, setWinner] = useState(null); // Il vincitore della partita
  const [gameOver, setGameOver] = useState(false); // Se la partita è finita o no
  const [modalIsOpen, setModalIsOpen] = useState(false); // Se il modal di gameOver è aperto o no
  const [disableSurrender, setDisableSurrender] = useState(false); // Se il bottone di arrendersi è disabilitato o no
  // Nomi dei giocatori
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");


  // Lato del giocatore
  const [playerSide, setPlayerSide] = useState("white"); // Metto che di standard è il bianco, ma poi verrà cambiato

  // Se il secondo giocatore è arrivato - stampiamo qualcosa di diverso se si è ancora in attesa
  const [player2Arrived, setPlayer2Arrived] = useState(false);

  const [gameGottenOnce, setGameGottenOnce] = useState(false); // Se abbiamo già fatto il fetch della partita

  const [umpire, setUmpire] = useState("White to move"); // L'arbitro della partita
  const [umpireAnswer, setUmpireAnswer] = useState("You didnt ask anything yet!"); // La risposta dell'arbitro della partita
  const [umpireFlag, setUmpireFlag] = useState(false); // Se l'arbitro ha risposto Try! Devi provare una cattura col pedone
  const [umpireMove, setUmpireMove] = useState(""); // Se la tua mossa è valida o no
  const [lastMoveForCheck, setLastMoveTargetSquare] = useState(null); // L'ultima mossa per il check
  const [lastMoveChessPiece, setLastMoveChessPiece] = useState(null); // L'ultima mossa per il check
  /**
   * Funzione che gestisce tutto quello che è interente al game,
   * usando i dati che vengono ritornati da "api/kriegspiel/getGame/:gameid"
   *
   * @param {object} response Il body della risposta
   * @returns
   */
  async function handleGetGameResponse(response) {
    // Dobbiamo aggiornare i nuovi dati
    if (response.success) {
      setGameGottenOnce(true);
      // Se non ci sono entrambi i player, allora non imposto nulla
      if (
        response.game.player1.username === null ||
        response.game.player2.username === null
      ) {
        return;
      } else {
        setPlayer2Arrived(true);
      }

      // Gestione aggiornamento dati permanenti della partita

      // Imposto i dati sugli utenti se sono diversi da quelli attuali
      if (response.game.player1.username !== player1) {
        setPlayer1(response.game.player1.username);
      }
      if (response.game.player2.username !== player2) {
        setPlayer2(response.game.player2.username);
      }
      // Imposto il player side se è diverso da quello attuale
      if (response.game.player1.username === username) {
        if (response.game.player1.side !== playerSide) {
          setPlayerSide(response.game.player1.side);
        }
      } else {
        if (response.game.player2.side !== playerSide) {
          setPlayerSide(response.game.player2.side);
        }
      }

      // Gestione aggiornamento dati temporanei della partita

      setGameData(response.game);
      let newChess = new Chess();
      newChess.load(response.game.chess._header.FEN);
      
      setFen(response.game.chess._header.FEN);
      
      newChess.load(newChess.fen());
      setChess(newChess);
      // informazioni utili soprattutto per checkCheck()
      setLastMoveTargetSquare(response.game.lastMoveTargetSquare);
      setLastMoveChessPiece(response.game.lastMoveChessPiece);
      
      if (checkCheck()) {
        console.log('checkcheck' + checkCheck())
        setUmpire(checkCheck());
      };

      if (response.game.lastMove !== null) {
        console.log('lastmove' + response.game.lastMove)
        if (response.game.lastMove === 'w' && !checkCheck()) {
          setUmpire("Black to move");
        } else if (response.game.lastMove === 'b' && !checkCheck()) {
          setUmpire("White to move");
        }
      }

      // Impostazione dei timer
      if (response.game.player1.username === username) {
        if (playerSide === "white") {
          setTimeBianco(response.game.player1.timer);
          setTimeNero(response.game.player2.timer);

        } else {
          setTimeBianco(response.game.player2.timer);
          setTimeNero(response.game.player1.timer);


        }
      } else {
        if (playerSide === "white") {
          setTimeBianco(response.game.player2.timer);
          setTimeNero(response.game.player1.timer);


        } else {
          setTimeBianco(response.game.player1.timer);
          setTimeNero(response.game.player2.timer);


        }
      }
      
      let length = response.game.chess._history.length;
      if (length > 0) {
        let history = response.game.chess._history;
        let lastMove = history[length - 1];
        
        if (lastMove.move.captured !== undefined) {
          let piecePosition = response.game.lastMoveTargetSquare;
          
          // if there is no check then the umpire says "Piece gone on " + piecePosition
          if (lastMove.move.captured === 'p' && !checkCheck()) {
            setUmpire("Pawn gone on " + piecePosition);
          } else if (lastMove.move.captured !== 'p' && !checkCheck()){
            setUmpire("Piece gone on " + piecePosition);
          }
          // if there is check then the umpire says "Piece gone on " + piecePosition + " and " + checkCheck()
          // since its important to know where the piece was captured and what kind of check it is
          else if (lastMove.move.captured === 'p' && checkCheck()) {
            setUmpire("Pawn gone on " + piecePosition + " and " + checkCheck());
          } else if (lastMove.move.captured !== 'p' && checkCheck()){
            setUmpire("Piece gone on " + piecePosition + " and " + checkCheck());
          }
        }
      }
      // Gestione nel caso di gameover
      if (response.game.gameOver.isGameOver) {
        setWinner(response.game.gameOver.winner == "p1" ? player1 : player2);
        setUmpire("Checkmate");
        setModalIsOpen(true);
      }
    } else {
      // Non dobbiamo aggiornare dati, dobbiamo ritornare un messaggio di errore
      console.log("Errore nel fetch della partita: ", response.message);
      // Se lo status è 403 o 404 allora la partita non esiste più
      if (response.status === 403 || response.status === 404) {
        navigate("/play");
      }
    }
  }

  React.useEffect(() => {
    if (!isTokenLoading) {
      if (!loginStatus) {
        navigate("/login");
      } else {
        fetch(`/api/kriegspiel/joinGame/${gameId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers);
            return response.json();  // Parse the response as JSON and return the promise
          })
          .then(data => {
            console.log('Data from server:', data)
            if (data.success) {
              navigate(`/play/kriegspiel/${gameId}`);
            } else {
              setMessage(data.message);
              console.log(data.message);
            }
          });
      }
    }
  }, [loginStatus, isTokenLoading]);

  useEffect(() => {
    // Guardia per evitare di iniziare il fetch se non abbiamo ancora i dati della partita
    if (isTokenLoading || !loginStatus) {
      return;
    }

    const interval = setInterval(() => {
      fetch(`/api/kriegspiel/getGame/${gameId}/user?player=${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
        .then((response) => {
          if (response.status == 403 || response.status == 404) {
            navigate("/play");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          handleGetGameResponse(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameData, isTokenLoading, loginStatus, gameId, username]);

  const handleMove = (sourceSquare, targetSquare) => {
    // Gestisco il fatto che non si possa muovere se non è il proprio turno
    // Questo evita richieste inutili
    if (
      (gameData.lastMove === playerSide ||
        (gameData.lastMove == null && playerSide === "black"))
    ) {
      return;
    }
    // se l'umpire ha risposto Try! e il giocatore non ha provato una mossa col pedone
    // allora non si può muovere
    else if ((chess.get(sourceSquare).type != 'p' && umpireFlag)) {
      return;
    }
    // se il giocatore sta muovendo il pedone in avanti senza tentare la cattura
    // e l'umpire ha risposto Try! allora non si può muovere
    else if (chess.get(sourceSquare).type == 'p' && umpireFlag && sourceSquare.split("")[0] == targetSquare.split("")[0]) {
      return;
    }
    // se l'umpire ha risposto Try! e il giocatore ha provato una mossa col pedone
    // allora si può muovere
    else if (chess.get(sourceSquare).type == 'p' && umpireFlag) {
      setUmpireFlag(false);

      fetch(`/api/kriegspiel/movePiece/${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            handleGetGameResponse(data);
            setUmpireMove("");
          } else if(data.message == "A piece is blocking the way") {
            setUmpireMove("No")
          }
          else {
            setUmpireMove("Hell no")
          }
        })
        .catch(() => {
          setUmpireMove("Hell no")
        });
    } else {
      fetch(`/api/kriegspiel/movePiece/${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            handleGetGameResponse(data);
            setUmpireMove("")
          } else if(data.message === "A piece is blocking the way" || data.message === "Invalid move") {
            console.log('provano')
            setUmpireMove("No")
          } else {
            setUmpireMove("Hell no")
          }
        })
        .catch(() => {
          setUmpireMove("Hell no")
        });
    }
  };

  // Gestore delle mosse possibili
  const handleMouseOverSquare = (square) => {
    const moves = chess.moves({ square, verbose: true });

    // Se il turno non è del giocatore attuale allora non lo mostro
    if (
      gameData.lastMove === playerSide ||
      (gameData.lastMove === null && playerSide === "black")
    ) {
      return;
    }

    // Imposto le mosse disponibile
    if (!umpireFlag) {
      setPossibleMoves(moves.map((move) => move.to));
    }
  };

  const handleMouseOutSquare = () => {
    setPossibleMoves([]);
  };

  function checkCheck() {
    if (chess.isCheck()) {
      // Imposto l'alone giallo del check sul Re solo se è il turno del giocatore,
      // in modo da non dare informazioni al nemico
      if(playerSide === 'w' && chess.turn() === 'w'){
        setPieceSelected(getPiecePosition(chess, { type: 'k', color: 'w' }));
      } else if(playerSide === 'b' && chess.turn() === 'b'){
        setPieceSelected(getPiecePosition(chess, { type: 'k', color: 'b' }));
      }
      // Imposto le informazioni per l'umpire tra cui la posizione del Re in scacco e la posizione
      // della pedina che ha mosso per metterlo in scacco
      let kingArray = getPiecePosition(chess, { type: 'k', color: chess.turn() === 'b' ? 'b' : 'w' });
      let pos2 = kingArray[0];
      let pos1 = lastMoveForCheck;
      const fileToNumber = (fileChar, playerSide) => {
        const fileNumber = fileChar.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
        return playerSide === 'w' ? fileNumber : 9 - fileNumber;
      };
      const rankToNumber = (rankChar) => {
        return parseInt(rankChar, 10);
      };
      // Ottieni file e rank per entrambe le posizioni
      const file1 = fileToNumber(pos1[0]);
      const rank1 = rankToNumber(pos1[1]);
      const file2 = fileToNumber(pos2[0]);
      const rank2 = rankToNumber(pos2[1]);
      // Check se la mossa è su una diagonale lunga
      const isOnLongDiagonal = (file, rank) => {
        // La diagonale lunga comprende le caselle in cui la somma degli indici di file e di rango è 9
        // Questo è vero indipendentemente dal lato in cui si trova il giocatore
        return file + rank === 9;
      };
      // Controlla se la mossa è su una diagonale
      if (Math.abs(file1 - file2) === Math.abs(rank1 - rank2)) {
        // Controlla se è una diagonale lunga
        const isLongDiagonal = isOnLongDiagonal(file1, rank1) || isOnLongDiagonal(file2, rank2);

        if (playerSide === 'w' && chess.turn !== 'w') {
          return isLongDiagonal ? "Check on the short diagonal" : "Check on the long diagonal";
        } else if (playerSide === 'b' && chess.turn !== 'b') { // playerSide === 'b'
          // Per nero la board è flippata quindi dobbiamo invertire le file
          const fileInverted = 9 - file1;
          const isLongDiagonalBlack = isOnLongDiagonal(fileInverted, rank1) || isOnLongDiagonal(9 - file2, rank2);
          return isLongDiagonalBlack ? "Check on the short diagonal" : "Check on the long diagonal";
        }
      }

      // Check per un check sulla stessa riga o colonna
      if (file1 === file2) {
        console.log('alo')
        return "Check on the vertical";
      }
      if (rank1 === rank2) {
        return "Check on the horizontal";
      }

      // Check per un check da cavallo
      if ((Math.abs(file1 - file2) === 2 && Math.abs(rank1 - rank2) === 1) ||
        (Math.abs(file1 - file2) === 1 && Math.abs(rank1 - rank2) === 2)) {
        return "Check by a knight";
      }
      return "No check";
    } else {
      setPieceSelected([]);
    }
  }

  const handleCloseModal = () => setModalIsOpen(false);
  const handleNavigateToPlay = () => navigate("/play/");
  const handleNavigatetoGame = () => navigate(`/play/kriegspiel/${gameId}`);



  // rende i pezzi invisibili a seconda del lato del giocatore
  const renderCustomPiece = () => {
    if (playerSide == "b") {
      return {
        "wK": "({visibility: hidden})",
        "wQ": "({visibility: hidden})",
        "wR": "({visibility: hidden})",
        "wB": "({visibility: hidden})",
        "wN": "({visibility: hidden})",
        "wP": "({visibility: hidden})",
      };
    } else {
      return {
        "bK": "({visibility: hidden})",
        "bQ": "({visibility: hidden})",
        "bR": "({visibility: hidden})",
        "bB": "({visibility: hidden})",
        "bN": "({visibility: hidden})",
        "bP": "({visibility: hidden})",
      }
    }
  };
      

  // gestisce la domanda Any? e la risposta dell'arbitro, imposto una flag umpireFlag
  // in modo da poter gestire la mossa del pedone
  const handleAnyQuestion = () => {
    const moves = chess.moves({ verbose: true });
    console.log('moves' + moves[0].to)
    const hasPawnCaptures = moves.some(move => move.piece === 'p' && move.flags.includes('c'));
    const hasPawns = chess.fen().split(' ')[0].match(chess.turn() === 'w' ? 'P' : 'p');

    if (!hasPawns) {
      setUmpireAnswer('Hell no');
      setUmpireFlag(false);
    } else if (hasPawnCaptures) {
      setUmpireAnswer('Try!');
      setUmpireFlag(true);

    } else {
      setUmpireAnswer('No.');
      setUmpireFlag(false);
    }

  };

  if (isTokenLoading || loginStatus === undefined || !gameGottenOnce) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!player2Arrived) {
    // Ritorniamo un messaggio di errore
    return (
      <Box
        sx={{
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
        }}
      >
        <Box
          sx={{
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
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ color: "black", fontWeight: "bolder" }}
            >
              Sei in attesa di un altro giocatore
            </Typography>
            <Typography sx={{ color: "black", fontWeight: "thin" }}>
              Invita i tuoi amici nella lobby se vuoi! Copia il link, oppure
              digli di cercare la tua partita nell'elenco delle lobby!
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // Copiare nella clipboard in path
              navigator.clipboard.writeText(
                `http://localhost:3000/play/kriegspiel/${gameId}`
              );
            }}
          >
            Copia il link di invito!{" "}
          </Button>
          <ShareButton />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={GameStyles.everythingContainer}>
      <Box sx={GameStyles.backgroundWrapper}>
        <Box sx={GameStyles.boxTimer}>
          <Timer
            time={timeBianco}
            setTime={setTimeBianco}
            shouldRun={gameData.lastMove !== playerSide}
            playerColor={playerSide === "w" ? "white" : "black"}
            justForDisplay={true}
          />
          <Timer
            time={timeNero}
            setTime={setTimeNero}
            shouldRun={gameData.lastMove === playerSide}
            playerColor={playerSide === "w" ? "black" : "white"}
            justForDisplay={true}
          />
        </Box>

        {/* Modal quando finisce la partita */}
        <Modal open={modalIsOpen} onClose={handleCloseModal}>
          <Box sx={GameStyles.boxGameOver}>
            <Stack spacing={2}>
              <Typography
                variant="h5"
                component="h2"
                style={{ margin: "auto" }}
              >
                {winner === "Nessuno"
                  ? "Partita finita."
                  : `${winner} ha vinto!`}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNavigateToPlay}
              >
                Esci
              </Button>

              <ShareButton />

            </Stack>
          </Box>
        </Modal>

        <div style={GameStyles.divChessBoard}>
          <Chessboard
            customPieces={renderCustomPiece()}
            position={fen}
            onPieceDrop={handleMove}
            boardOrientation={
              // L'utente può essere o bianco o nero e potrebbe essere o il player 1 o il player 2(
              playerSide === "w" ? "white" : "black"
            }
            width={"50vh"}
            //onMouseOverSquare={handleMouseOverSquare}
            //onMouseOutSquare={handleMouseOutSquare}
            customSquareStyles={{
              ...possibleMoves.reduce(
                (a, c) => ({
                  ...a,
                  [c]: {
                    background:
                      "radial-gradient(rgba(0, 0, 0, 0.5) 20%, transparent 25%)",
                  },
                }),
                {}
              ),
              ...pieceSelected.reduce(
                (a, c) => ({
                  ...a,
                  [c]: {
                    background:
                      "radial-gradient(rgba(255, 255, 0, 0.5) 70%, transparent 75%)",
                  },
                }),
                {}
              ),
            }}
          />
        </div>
        <Box sx={GameStyles.boxControlButtons}>
          <Button onClick={handleNavigateToPlay}>Esci</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={disableSurrender}
            onClick={() => {
              setDisableSurrender(true);

              // Invio la fetch in POST a "/api/kriegspiel/surrender/:gameid"
              // se ritorna success == true, allora ho arreso con successo

              fetch(`/api/kriegspiel/surrender/${gameId}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${Cookies.get("token")}`,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.success) {
                    setWinner(data.winner);
                    setModalIsOpen(true);
                  } else {
                    setDisableSurrender(false);
                  }
                })
                .catch((err) => {
                  console.log(err);
                  setDisableSurrender(false);
                });
            }}
          >
            Arrenditi
          </Button>
        </Box>
        <Box sx={GameStyles.boxUmpire}>
          <Button variant="contained" onClick={handleAnyQuestion}>
            Any?
          </Button>
          <Typography variant="h6">
            Umpire Answer: {umpireAnswer}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {umpire}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {umpireMove}
          </Typography>
        </Box>


      </Box>
    </Box>
  );
}

export default Kriegspiel;
