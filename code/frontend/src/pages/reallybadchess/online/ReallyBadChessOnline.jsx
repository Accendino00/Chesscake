import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Button, Box, Modal, Typography, Stack } from "@mui/material";
import ChessGameStyles from "../ChessGameStyles";
import Timer from "../timer/Timer";
import { Chess } from "chess.js";
import {
  generateBoard,
  getPiecePosition,
  cloneChessBoard,
} from "./boardFunctions";
import { findBestMove } from "./movesFunctions";
import Cookies from "js-cookie";
import useTokenChecker from "../../../utils/useTokenChecker";
import { CircularProgress } from "@mui/material";
import ShareButton from "../../components/ShareButton";

function ReallyBadChessOnline() {
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
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [gameOver, setGameOver] = useState(false); // Se la partita è finita o no
  const [modalIsOpen, setModalIsOpen] = useState(false); // Se il modal di gameOver è aperto o no
  const [disableSurrender, setDisableSurrender] = useState(false); // Se il bottone di arrendersi è disabilitato o no

  // Nomi dei giocatori
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  // Lato del giocatore
  const [playerSide, setPlayerSide] = useState("w"); // Metto che di standard è il bianco, ma poi verrà cambiato

  // Se il secondo giocatore è arrivato - stampiamo qualcosa di diverso se si è ancora in attesa
  const [player2Arrived, setPlayer2Arrived] = useState(false);

  /**
   * Funzione che gestisce tutto quello che è interente al game,
   * usando i dati che vengono ritornati da "api/reallybadchess/getGame/:gameid"
   *
   * @param {object} response Il body della risposta
   * @returns
   */
  function handleGetGameResponse(response) {
    // Dobbiamo aggiornare i nuovi dati
    if (response.success) {
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
      
      // Impostazione dei timer
      // if (response.game.player1.username === username) {
      //   if (playerSide === "white") {
      //     setTimeBianco(response.game.player1.timer);
      //     setTimeNero(response.game.player2.timer);
      //   } else {
      //     setTimeBianco(response.game.player2.timer);
      //     setTimeNero(response.game.player1.timer);
      //   }
      // } else {
      //   if (playerSide === "white") {
      //     setTimeBianco(response.game.player2.timer);
      //     setTimeNero(response.game.player1.timer);
      //   } else {
      //     setTimeBianco(response.game.player1.timer);
      //     setTimeNero(response.game.player2.timer);
      //   }
      // }
      setTimeBianco(response.game.player1.timer);
      setTimeNero(response.game.player2.timer);
      
      

      // Setta il gamedata con response.game
      setGameData(response.game);
      let chessTaken = new Chess();
      chessTaken.load(response.game.chess._header.FEN);

      // Gestione aggiornamento dati temporanei della partita
      setChess(chessTaken);
      if(chess)
        chess.load(chessTaken.fen());
      
      // Setta il Fen di setFen con il fen del chess appena creato
      setFen(chessTaken.fen());
      checkCheck();
      setCurrentTurn(response.game.chess._turn);
      


      // Gestione nel caso di gameover
      if (response.game.gameOver.isGameOver) {
        // if(response.game.gameOver.winner == "p1")
        handleVictory();
        setWinner(response.game.gameOver.winner === "p1" ? response.game.player1.username : response.game.player2.username);
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
        // Cose da fare se si è loggati, quindi poter giocare alla partita, etc.
        // Fetch iniziale per ottenere la partita
        fetch(`/api/reallybadchess/getGame/${gameId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            handleGetGameResponse(data);
          })
          .catch((err) => {
            console.log(err);
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
      fetch(`/api/reallybadchess/getGame/${gameId}`, {
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
          handleGetGameResponse(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameData, isTokenLoading, loginStatus, gameId, username]);

  useEffect(() => {
    if (gameData != null) {
      if (gameData.gameSettings.mode === "dailyChallenge") {
        if (gameData.chess._turn === gameData.player2.side) {
          setTimeout(() => {
            let chosenMove = chess.moves({ verbose: true })[Math.floor(Math.random() * chess.moves().length)];
            findBestMove(chess.fen(), 2, 0)
              .then((Move) => {
                makeMove(Move.slice(0, 2), Move.slice(2, 4), player2);
              })
              .catch((err) => {
                console.log(err);
                makeMove(chosenMove.from, chosenMove.to, player2);
              });
          }, 2000);
        }
      }
    }
  }, [currentTurn != playerSide]);

  const handleSquareClick = (square) => {
    if (!selectedSquare) {
      // Seleziona il pezzo sulla casella cliccata
      const piece = square;
      if (piece) {
        setSelectedSquare(square);
      }
    } else {
      handleMove(selectedSquare, square);
      setSelectedSquare(null);
    }
  };

  const handleMove = async (sourceSquare, targetSquare) => {
    await makeMove(sourceSquare, targetSquare, username);
  };

  
  /**
   * Fa una mossa nel da inviare a movePiece
   * 
   * @param {string} sourceSquare - Square di partenza della mossa.
   * @param {string} targetSquare - Square di arrivo della mossa.
   */

  const makeMove = async (sourceSquare, targetSquare, username) => {
    // Gestisco il fatto che non si possa muovere se non è il proprio turno
    // Questo evita richieste inutili
    // if (
    //   gameData.lastMove === playerSide ||
    //   (gameData.lastMove == null && playerSide === "black")
    // ) {
    if (gameData.lastMove === playerSide) {
      return;
    }
    await fetch(`/api/reallybadchess/movePiece/${gameId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({
        username: username,
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          handleGetGameResponse(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  // };
}

  const handleVictory = async () => {
    try {
      const response = await fetch(`/api/reallybadchess/saveDailyChallengeResults/${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        console.log("Salvato con successo");
      }
    } catch (err) {
      console.log(err);
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
    setPossibleMoves(moves.map((move) => move.to));
  };

  const handleMouseOutSquare = () => {
    setPossibleMoves([]);
  };

  function checkCheck() {
    if (chess!=null){
      if (chess.isCheck()) {
        setPieceSelected(getPiecePosition(chess, { type: 'k', color: chess.turn() === 'b' ? 'b' : 'w' }));
      } else {
        setPieceSelected([]);
      }
    }
  }

  

  const handleCloseModal = () => setModalIsOpen(false);
  const handleNavigateToPlay = () => navigate("/play/");
  const handleNavigatetoGame = () => navigate(`/play/reallybadchess/${gameId}`);

  if (isTokenLoading || loginStatus === undefined) {
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
                `http://localhost:3000/play/reallybadchess/${gameId}`
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
    <Box sx={ChessGameStyles.everythingContainer}>
      <Box sx={ChessGameStyles.backgroundWrapper}>
        <Box sx={ChessGameStyles.boxTimer}>
          <Timer
            time={timeBianco}
            setTime={setTimeBianco}
            shouldRun={currentTurn !== playerSide}
            playerColor={"white"}
            justForDisplay={true}
          />
          <Timer
            time={timeNero}
            setTime={setTimeNero}
            shouldRun={currentTurn === playerSide}
            playerColor={"black"}
            justForDisplay={true}
          />
        </Box>

        {/* Modal quando finisce la partita */}
        <Modal open={modalIsOpen} onClose={handleCloseModal}>
          <Box sx={ChessGameStyles.boxGameOver}>
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

        <div style={ChessGameStyles.divChessBoard}>
          <Chessboard
            position={fen}
            onPieceDrop={handleMove}
            onSquareClick={handleSquareClick}
            boardOrientation={
              // L'utente può essere o bianco o nero e potrebbe essere o il player 1 o il player 2(
              playerSide === "w" ? "white" : "black"
            }
            width={"50vh"}
            onMouseOverSquare={handleMouseOverSquare}
            onMouseOutSquare={handleMouseOutSquare}
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
        <Box sx={ChessGameStyles.boxControlButtons}>
          <Button onClick={handleNavigateToPlay}>Esci</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={disableSurrender}
            onClick={() => {
              setDisableSurrender(true);

              // Invio la fetch in POST a "/api/reallybadchess/surrender/:gameid"
              // se ritorna success == true, allora ho arreso con successo

              fetch(`/api/reallybadchess/surrender/${gameId}`, {
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
      </Box>
    </Box>
  );
}

export default ReallyBadChessOnline;
