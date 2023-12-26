import React, { useState } from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Slider,
  TextField,
  Paper,
  CircularProgress,
  Grid,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ExpandMore";
import InfoIconButton from "../../utils/infoIconButton";
import useTokenChecker from "../../utils/useTokenChecker";
import "./customAccordionInformation.css";
import CreateGameComponent from "../components/CreateGameComponent";

import Cookies from "js-cookie";

/**
 * Questo componente permette di selezionare la modalità di gioco di
 * really bad chess, quindi giocare in locale, contro il computer, contro
 * un altro giocatore online o contro il computer in una sfida giornaliera.
 *
 * Inoltre, permette di selezionare la durata della partita e il livello
 *
 * @returns Interfaccia per la selezione della modalità di gioco
 */
const ModeSelection = () => {
  // Cose utili
  const navigate = useNavigate();

  const location = useLocation();
  const isChildRoute = /^\/play\/reallybadchess\/.+/.test(location.pathname);

  const { loginStatus, isTokenLoading} = useTokenChecker();
  const [loading, setLoading] = useState(false);

  /**
   * Le modalità di gioco possono essere:
   * - practiceVsComputer:    giocare contro il computer in modalità practice (si può selezionare il rank)
   * - playerVsComputer:      giocatore contro computer
   * - playerVsPlayer:        giocatore contro giocatore
   * - playerVsPlayerOnline:  giocatore contro giocatore online
   * - dailyChallenge:        sfida giornaliera contro il computer
   */
  const [mode, setMode] = useState("practiceVsComputer");

  // Dati della partita
  const [duration, setDuration] = useState(5); // durata in minuti
  const [rank, setRank] = useState(50);
  const [difficulty, setDifficulty] = useState(1);

  // Per le partite in locale, è possibile scegliere il nome dei giocatori
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  // Handler del form
  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleSliderChangeRank = (event, newValue) => {
    setRank(newValue); // Update rank state when slider changes
  };

  const handleSliderChangeDifficulty = (event, newValue) => {
    setDifficulty(newValue); // Update rank state when slider changes
  };

  // Handler del bottone "Start Game"
  const handleStartGame = () => {
    // Imposto il loading a true fino a quando non finisco la richiesta
    setLoading(true);

    // Dovrei navigare al tipo di gioco selezionato

    // se giochiamo playerVsPlayer, allora devo passare i dati al componente "ChessGameLocal"
    // e navigare a "/play/reallybadchess/local"
    switch (mode) {
      case "playerVsPlayer":
        // Se player 1 e player 2 non sono stati impostati, allora imposto i loro nomi di default
        const player1Name = player1 === "" ? "Player 1" : player1;
        const player2Name = player2 === "" ? "Player 2" : player2;
        const playerVsPlayerData = JSON.stringify({
          player1: player1Name,
          player2: player2Name,
          rank: rank,
          duration: duration,
          mode: mode,
        });
        navigate(`/play/reallybadchess/local?data=${encodeURIComponent(playerVsPlayerData)}`);
        break;
    
      case "practiceVsComputer":
        const practiceVsComputerData = JSON.stringify({
          player1: player1 === "" ? "Player 1" : player1,
          player2: player2 === "" ? "Computer" : player2,
          rank: rank,
          mode: mode,
          difficulty: difficulty,
        });
        navigate(`/play/reallybadchess/freeplay?data=${encodeURIComponent(practiceVsComputerData)}`);
        break;
    
      case "playerVsPlayerOnline":
        navigate(`/play/reallybadchess/lobby`);
        break;
        // Se giochiamo in tutte le altre modalità, si tratta di una partita online
        // e quindi devo navigare a "/play/reallybadchess/:gameId"
      default:
        // Il GameID mi viene ritornato dalla richiesta di fetch che faccio al server
        // per creare una nuova partita. La richiesta la faccio ad /api/reallybadchess/newGame
        // e il server mi ritorna il GameID e una chiave nel caso io non abbia un token con il
        // quale ho eseguito la richiesta messa in Authorization Bearer
        const onlineGameData = {
          settings: {
            mode: mode,
            duration: duration,
          },
        };
        console.log("SN QUI");
        if (mode === "practiceVsComputer") {
          onlineGameData.settings.rank = rank;
        }
    
        const token = Cookies.get("token");
        const onlineGameHeaders = token
          ? { "Content-Type": "application/json", Authorization: "Bearer " + token }
          : { "Content-Type": "application/json" };
    
        fetch("/api/reallybadchess/newGame", {
          method: "POST",
          headers: onlineGameHeaders,
          body: JSON.stringify(onlineGameData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            navigate(`/play/reallybadchess/${data.gameId}`);
          })
          .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
          });
        break;
    }
    setLoading(false);
  };

  if (isTokenLoading) {
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

  return (
    <>
      {isChildRoute ? (
        // Se siamo in una sottopagina, mostriamo il contenuto della sottopagina, ovvero la partita
        <Outlet />
      ) : (
        // Interfaccia per la selezione della modalità di gioco
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              borderRadius: "20px",
              p: 3,
              m: 2,
              maxWidth: "600px",
              width: "100%",
              backdropFilter: "blur(10px)",
            }}
          >
            <Typography
              variant="h2"
              component="div"
              gutterBottom
              align="center"
              style={{
                color: "black",
                fontFamily: "Arial",
                margin: "20px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="/iconQueen@1x.png"
                alt="Chess Cake"
                style={{
                  maxWidth: "100px",
                  height: "auto",
                  marginTop: "-15px",
                  marginLeft: "-20px",
                }}
              />
              REALLY{" "}
              <span style={{ fontSize: "20px", padding: "10px" }}>bad</span>{" "}
              CHESS
            </Typography>

            <Box
              m={2}
              width={2 / 3}
              style={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="mode-label" style={{ color: "darkblack" }}>
                  Mode
                </InputLabel>
                {loginStatus === true ? (
                  <Select
                    labelId="mode-label"
                    value={mode}
                    onChange={handleModeChange}
                    label="Mode"
                  >
                    <MenuItem value={"practiceVsComputer"}>Freeplay</MenuItem>
                    <MenuItem value={"playerVsPlayer"}>
                      Player vs Player (locale)
                    </MenuItem>
                    <MenuItem value={"playerVsPlayerOnline"}>
                      Player vs Player (online)
                    </MenuItem>
                    <MenuItem value={"playerVsComputer"}>
                      Player vs Computer (ranked)
                    </MenuItem>
                    <MenuItem value={"dailyChallenge"}>
                      Daily Challenge
                    </MenuItem>
                  </Select>
                ) : (
                  <Select
                    labelId="mode-label"
                    value={mode}
                    onChange={handleModeChange}
                    label="Mode"
                  >
                    <MenuItem value={"practiceVsComputer"}>Freeplay</MenuItem>
                    <MenuItem value={"playerVsPlayer"}>
                      Player vs Player (locale)
                    </MenuItem>
                  </Select>
                )}
              </FormControl>
              <InfoIconButton
                infoText='
                                        <b>Modalità per tutti:</b>
                                        <br/>
                                        <br/>
                                        <ul style="margin: 0; padding-left: 20px;">
                                        <li><b>Freeplay</b> : Gioca contro il computer scegliendo il rank</li>
                                        <li><b>Player vs Player (locale)</b> : Sfida un tuo amico sullo stesso dispositivo o gioca contro te stesso e affina le tue abilità</li>
                                        </ul>
                                        <br/>
                                        <b>Modalità solo per utenti registrati:</b>
                                        <br/>
                                        <br/>
                                        <ul style="margin: 0; padding-left: 20px;">
                                        <li><b>Player vs Player (online)</b> : Crea una lobby e gioca contro altri giocatori online! Le vittorie e le sconfitte influenzeranno il tuo <i>elo</i></li>
                                        <li><b>Player vs Computer (ranked)</b> : Gioca contro il computer e scala la classifica, aumentando il rank</li>
                                        <li><b>Daily Challenge</b> : Gioca contro il computer la sfida giornaliera e scala la classifica facendo il minor numero di mosse per vincere</li>
                                        </ul>
                                        '
                placement="right-start"
              />
            </Box>

            {mode === "playerVsPlayer" && (
              <>
                <Box m={2} width={1 / 2}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel
                      id="duration-label"
                      style={{ color: "darkblack" }}
                    >
                      Duration
                    </InputLabel>
                    <Select
                      labelId="duration-label"
                      label="Duration"
                      value={duration}
                      onChange={handleDurationChange}
                    >
                      <MenuItem value={0.25}>15 seconds</MenuItem>
                      <MenuItem value={1}>1 minute</MenuItem>
                      <MenuItem value={5}>5 minutes</MenuItem>
                      <MenuItem value={10}>10 minutes</MenuItem>
                      <MenuItem value={15}>15 minutes</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <form>
                  <Typography
                    variant="h8"
                    component="div"
                    gutterBottom
                    align="center"
                    style={{
                      color: "black",
                      fontFamily: "Arial",
                      margin: "20px 0",
                    }}
                  >
                    Player names
                    <InfoIconButton
                      infoText="In questa modalità puoi specificare tu i nomi dei due giocatori, scrivli qua sotto! 
                                        <br/><br/> Se non scrivi nulla, verrano usati i nomi presenti nel form, <i>Player 1</i> e <i>Player 2</i>"
                    />
                  </Typography>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <TextField
                      label="Player 1"
                      labelId="player1"
                      value={player1}
                      onChange={(e) => setPlayer1(e.target.value)}
                      sx={{
                        width: "45%",
                      }}
                    />
                    <TextField
                      label="Player 2"
                      labelId="player2"
                      value={player2}
                      onChange={(e) => setPlayer2(e.target.value)}
                      sx={{
                        width: "45%",
                      }}
                    />
                  </div>
                </form>
              </>
            )}

            {/* Slider per il rank */}
            {(mode === "practiceVsComputer" || mode === "playerVsPlayer") && (
              <>
                <Typography
                  variant="h8"
                  component="div"
                  gutterBottom
                  align="center"
                  style={{
                    color: "black",
                    fontFamily: "Arial",
                    margin: "20px 0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Rank slider
                  <InfoIconButton
                    infoText="Con rank tra 0 e 50, avrai un vantaggio sul computer in termini di pezzi, 
                                        mentre con rank tra 50 e 100, il computer avrà un vantaggio su di te."
                  />
                </Typography>

                <Slider
                  defaultValue={50}
                  getAriaValueText={(value) => `Rank ${value}`}
                  aria-labelledby="rank-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  min={0}
                  max={100}
                  onChange={handleSliderChangeRank}
                  sx={{
                    width: "75%",
                    "& .MuiSlider-markLabel": {
                      whiteSpace: "normal", // This allows the text to wrap
                      maxWidth: "5em", // Set a max-width to control when the text should wrap
                    },
                  }}
                  track={false}
                  marks={[
                    {
                      value: 0,
                      label: "Vantaggio del bianco",
                    },
                    {
                      value: 50,
                      label: "Bilanciato",
                    },
                    {
                      value: 100,
                      label: "Vantaggio del nero",
                    },
                  ]}
                />
              </>
            )}

            {mode === "playerVsPlayerOnline" && (
              <>
                <Box m={2} width={1 / 2}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel
                      id="duration-label"
                      style={{ color: "darkblack" }}
                    >
                      Duration
                    </InputLabel>
                    <Select
                      labelId="duration-label"
                      label="Duration"
                      value={duration}
                      onChange={handleDurationChange}
                    >
                      <MenuItem value={0.25}>15 seconds</MenuItem>
                      <MenuItem value={1}>1 minute</MenuItem>
                      <MenuItem value={5}>5 minutes</MenuItem>
                      <MenuItem value={10}>10 minutes</MenuItem>
                      <MenuItem value={15}>15 minutes</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </>
            )}

            {mode === "practiceVsComputer" && (
              <>
                <Typography
                  variant="h8"
                  component="div"
                  gutterBottom
                  align="center"
                  style={{
                    color: "black",
                    fontFamily: "Arial",
                    margin: "20px 0",
                  }}
                >
                  Difficulty slider
                  <InfoIconButton
                    infoText='
                                        <ul style="margin: 0; padding-left: 20px;">
                                        <li><b>0</b> : Facile</li>
                                        <li><b>1</b> : Medio</li>
                                        <li><b>2</b> : Difficile</li>
                                        </ul>
                                        '
                  />
                </Typography>

                {/* Sottotitolo dove spiego le difficoltà */}
                <Slider
                  defaultValue={1}
                  getAriaValueText={(value) => `Rank ${value}`}
                  aria-labelledby="difficulty-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  min={0}
                  max={2}
                  onChange={handleSliderChangeDifficulty}
                  sx={{
                    width: "50%",
                  }}
                  marks={[
                    {
                      value: 0,
                      label: "Easy",
                    },
                    {
                      value: 1,
                      label: "Medium",
                    },
                    {
                      value: 2,
                      label: "Hard",
                    },
                  ]}
                />
              </>
            )}
            <Box m={2}>
              {loading ? (
                <Grid item>
                  <CircularProgress />
                </Grid>
              ) : mode === "playerVsPlayerOnline" ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="row"
                  width="100%"
                  padding="10px"
                >
                  <Button
                    sx={{ mt: 2, mr: 2 }}
                    onClick={() => navigate(`/play/reallybadchess/lobby`)}
                    variant="contained"
                    color="primary"
                    style={{ color: "darkblack" }}
                  >
                    Lobbies
                  </Button>
                  <CreateGameComponent duration={duration} mode = {mode}  />
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStartGame}
                  style={{ color: "darkblack" }}
                >
                  Start Game
                </Button>
              )}
            </Box>
          </Paper>
          <div className="wrapperOfAccordion">
            <Accordion
              disableGutters
              className="custom-accordion"
              defaultExpanded={true}
            >
              <AccordionSummary
                expandIcon={
                  <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />
                }
                style={{
                  flexDirection: "row",
                  "& .MuiAccordionSummaryExpandIconWrapper.MuiExpanded": {
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <Typography
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    margin: "0px !important",
                  }}
                >
                  <span>Informazioni</span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  borderTop: "1px solid rgba(0, 0, 0, .125)",
                }}
              >
                <Typography
                  style={{
                    fontSize: "0.8em",
                  }}
                  component={"span"}
                >
                  <b>
                    Really <i>bad</i> Chess
                  </b>{" "}
                  è una variante del gioco degli scacchi, in cui i pezzi sono
                  assegnati in modo casuale ai giocatori, in base al <b>rank</b>{" "}
                  che si ha.
                  <br />
                  Il resto del gioco funziona quasi nello stesso modo degli
                  scacchi normali, le uniche eccezzioni sono le seguenti:
                  <ul style={{ margin: "0px", paddingLeft: "20px" }}>
                    <li>
                      Se è un giocatore non ha più mosse che può fare, non è
                      pareggio ma è sconfitta
                    </li>
                    <li>Non esiste pareggio per mosse ripetute</li>
                    <li>
                      Non esiste pareggio per troppi pochi pezzi (re contro re)
                    </li>
                  </ul>
                  <br />
                  Il gioco è stato ideato da Zech Gage, uscito nel 2016 per iOS
                  e nel 2017 per Android.
                  <br /> <br />
                  Potete visitare la pagina del gioco orginale al seguente{" "}
                  <a
                    href="https://www.reallybadchess.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    link
                  </a>
                  .
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </Box>
      )}
    </>
  );
};

export default ModeSelection;
