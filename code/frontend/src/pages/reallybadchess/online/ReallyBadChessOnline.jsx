import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Button, Box, Modal, Typography, Stack, CircularProgress } from "@mui/material";
import ChessGameStyles from "../ChessGameStyles";
import Timer from "../timer/Timer";
import { Chess } from "chess.js";
import { getPiecePosition } from "./boardFunctions";
import Cookies from "js-cookie";
import useTokenChecker from "../../../utils/useTokenChecker";
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

  const [currentTurn, setCurrentTurn] = useState("w"); // Per indicare di chi è il turno attuale

  // Cose inerenti al gameOver
  const [winner, setWinner] = useState(null); // Il vincitore della partita
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [gameOver, setGameOver] = useState(false); // Se la partita è finita o no
  const [modalIsOpen, setModalIsOpen] = useState(false); // Se il modal di gameOver è aperto o no
  const [disableSurrender, setDisableSurrender] = useState(false); // Se il bottone di arrendersi è disabilitato o no
  const [undoEnabled, setUndoEnabled] = useState(false); // Se posso fare un undo o no

  // Nomi dei giocatori
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  // Lato del giocatore
  const [playerSide, setPlayerSide] = useState("w"); // Metto che di standard è il bianco, ma poi verrà cambiato

  // Se il secondo giocatore è arrivato - stampiamo qualcosa di diverso se si è ancora in attesa
  const [player2Arrived, setPlayer2Arrived] = useState(false);

  const [gameGottenOnce, setGameGottenOnce] = useState(false);

  //Funzione di random seedato

  /**
   * Funzione che gestisce tutto quello che è interente al game,
   * usando i dati che vengono ritornati da "api/reallybadchess/getGame/:gameid"
   *
   * @param {object} response Il body della risposta
   * @returns
   */
  function handleGetGameResponse(response) {
    // Dobbiamo aggiornare i nuovi dati
    if (!response.success) {
      console.log("Errore nel fetch della partita: ", response.message);
      // Se lo status è 403 o 404 allora la partita non esiste più
      if (response.status === 403 || response.status === 404)
        navigate("/play");
    }
    setGameGottenOnce(true);
    // Se non ci sono entrambi i player, allora non imposto nulla
    if (gameOver)
      return;

    if (
      response.game.player1.username === null ||
      response.game.player2.username === null
    ) {return;}

    setPlayer2Arrived(true);
    
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
    }
    else if (response.game.player2.side !== playerSide) {
      setPlayerSide(response.game.player2.side);
    }
    // Impostazione dei timer
    if (response.game.player1.username === username) {
      if (playerSide === "w") {
        setTimeBianco(response.game.player1.timer);
        setTimeNero(response.game.player2.timer);
      } else {
        setTimeBianco(response.game.player2.timer);
        setTimeNero(response.game.player1.timer);
      }
    } 
    else if (playerSide === "w") {
      setTimeBianco(response.game.player2.timer);
      setTimeNero(response.game.player1.timer);
    } else {
      setTimeBianco(response.game.player1.timer);
      setTimeNero(response.game.player2.timer);
    }

    // Setta il gamedata con response.game
    setGameData(response.game);
    let chessTaken = new Chess();
    chessTaken.load(response.game.chess._header.FEN);

    // Gestione aggiornamento dati temporanei della partita
    setChess(chessTaken);
    if (chess) chess.load(chessTaken.fen());

    // Setta il Fen di setFen con il fen del chess appena creato
    setFen(chessTaken.fen());
    checkCheck();
    setCurrentTurn(response.game.chess._turn);

    // Se l'undo è enabled e il turno e mio, imposto "undoEnabled" a true
    if (response.game.chess._turn === playerSide) 
      setUndoEnabled(response.game.undoEnabled);
    
    // Gestione nel caso di non gameOver
    if (!response.game.gameOver.isGameOver)
    return;

    setGameOver(true);

    // Gestione nel caso di gameOver
    handleVictory().then((gameReturned) => {
      if (
        gameReturned &&
        gameReturned.game &&
        gameReturned.game.gameOver
      ){
        //Imposto il vincitore
        const winner =
        gameReturned.game.gameOver.winner === "p1"
          ? gameData.player1.username
          : gameData.player2.username;
      setWinner(winner);
      setModalIsOpen(true);
      }
    });
  }

  React.useEffect(() => {
    if (!isTokenLoading) {
      if (!loginStatus) {
        navigate("/login");
      } else {
        // Cose da fare se si è loggati, quindi poter giocare alla partita, etc.
        // Fetch iniziale per ottenere la partita
        fetch(`/api/reallybadchess/joinGame/${gameId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("Response Status:", response.status);
            console.log("Response Headers:", response.headers);
            return response.json(); // Parse the response as JSON and return the promise
          })
          .then((data) => {
            console.log("Data from server:", data);
            if (data.success) {
              navigate(`/play/reallybadchess/${gameId}`);
            } else {
              setMessage(data.message);
              console.log(data.message);
            }
          });
      }
    }
  }, [loginStatus, isTokenLoading]);

  /**
   * Fetch per ottenere la partita iniziale, attraverso getGame
   */
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

  /**
   * Gestisce la chiamata API per fare l'undo nella partita
   * 
   */
  const handleUndo = async () => {
    if (undoEnabled) {
      setUndoEnabled(false);

      await fetch(`/api/reallybadchess/undoMove/${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
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
    }
  };


  /**
   * Gestisce il click sulla casella, che farà una mossa se è possibile
   * @param {string} square - La casella cliccata
   */
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

  /**
   * Richiede di fare la mossa al backend
   *
   * @param {string} sourceSquare - Square di partenza della mossa.
   * @param {string} targetSquare - Square di arrivo della mossa.
   */
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
  };

  /**
   * Salva la partita nel database
   */
  const handleVictory = async () => {
    try {
      const response = await fetch(`/api/reallybadchess/saveGame/${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Errore nella richiesta");
      }
      return data;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  /**
   * Gestisce il mouse over della casella
   * @param {string} square - La casella su cui è il mouse
   */
  const handleMouseOverSquare = (square) => {
    const moves = chess.moves({ square, verbose: true });

    // Se il turno non è del giocatore attuale allora non lo mostro
    if (
      gameData.lastMove === playerSide ||
      (gameData.lastMove === null && playerSide === "b")
    ) {
      return;
    }

    // Imposto le mosse disponibile
    setPossibleMoves(moves.map((move) => move.to));
  };

  /**
   * Gestisce il mouse out della casella
  */
  const handleMouseOutSquare = () => {
    setPossibleMoves([]);
  };

  /**
   * Controlla se c'è scacco da parte di un giocatore, e se c'è, allora evidenzia il re
  */
  function checkCheck() {
    if (chess != null) {
      if (chess.isCheck()) {
        setPieceSelected(
          getPiecePosition(chess, {
            type: "k",
            color: chess.turn() === "b" ? "b" : "w",
          })
        );
      } else {
        setPieceSelected([]);
      }
    }
  }

  // Funzione che gestisce la chiusura del modal
  const handleCloseModal = () => setModalIsOpen(false);
  const handleNavigateToPlay = () => navigate("/play/");

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
                window.location.href
              );
            }}
          >
            Copia il link di invito!{" "}
          </Button>
          <ShareButton url={window.location.href} text={
            "Sfidami su Really Bad Chess! Entra dentro la mia lobby per giocare con me!"
          }/>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={ChessGameStyles.everythingContainer}>
      <Box sx={ChessGameStyles.backgroundWrapper}>
        <Box sx={ChessGameStyles.boxTimer}>
          <Timer
            time={playerSide === "w" ? timeBianco : timeNero}
            setTime={playerSide === "w" ? setTimeBianco : setTimeNero}
            shouldRun={currentTurn === playerSide }
            playerColor={playerSide === "w" ? "white" : "black"}
            justForDisplay={true}
          />
          <Timer
            time={playerSide !== "w" ? timeBianco : timeNero}
            setTime={playerSide !== "w" ? setTimeBianco : setTimeNero}
            shouldRun={currentTurn !== playerSide }
            playerColor={playerSide === "w" ? "black" : "white"}
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

              <ShareButton
                text={
                  winner == player1 && player1 == username
                    ? " Ho vinto questa partita in online di Really Bad Chess con " +
                      chess.moveNumber() +
                      " mosse contro " +
                      player2
                    : winner == player2 && player2 == username
                    ? "Ho vinto questa partita in online di Really Bad Chess con " +
                      chess.moveNumber() +
                      " mosse contro " +
                      player1
                    : player1 == username
                    ? "Ho perso questa partita in online di Really Bad Chess con " +
                      chess.moveNumber() +
                      " mosse contro " +
                      player2
                    : "Ho perso questa partita in online di Really Bad Chess con " +
                      chess.moveNumber() +
                      " mosse contro " +
                      player1
                }
                style={{
                  width: "100%",
                  height: "40px",
                }}
              />
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
              if (!gameOver) {
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
              }
            }}
          >
            Arrenditi
          </Button>
          <Button variant="contained" color="primary" onClick={handleUndo} disabled={!undoEnabled}>Undo</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ReallyBadChessOnline;
