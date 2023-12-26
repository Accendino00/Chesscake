import React, { useState } from "react";
import {
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    Paper,
    CircularProgress,
    Accordion,
    AccordionDetails,
    AccordionSummary,
  } from "@mui/material";
  import { useNavigate, useLocation, Outlet } from "react-router-dom";
  import ArrowForwardIosSharpIcon from "@mui/icons-material/ExpandMore";
  import useTokenChecker from "../../utils/useTokenChecker";
  import "./kriegspielAccordion.css";
  import CreateGameComponent from "../components/CreateGameComponent";

function KriegspielSelection() {
      // Cose utili
  const navigate = useNavigate();

  const location = useLocation();
  const [duration, setDuration] = useState(5);
  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };
  const isChildRoute = /^\/play\/kriegspiel\/.+/.test(location.pathname);

  const { loginStatus, isTokenLoading} = useTokenChecker();
  
  React.useEffect(() => {
    if (!isTokenLoading) {
        if (!loginStatus) {
            navigate("/login");
        }
    }
}, [loginStatus, isTokenLoading]);

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
  return (<>
  {isChildRoute ? ( <Outlet /> ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
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
        <Typography variant="h4" align="center">
          Kriegspiel
        </Typography>
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
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          maxWidth="500px"
          padding="20px"
        >
          <Typography variant="h6" align="center">
            Crea una partita
          </Typography>
          <CreateGameComponent duration = {duration} mode = {"kriegspiel"}  />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          maxWidth="500px"
          padding="20px"
        >
          <Typography variant="h6" align="center">
            Unisciti ad una partita
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate("/play/kriegspiel/lobby");
            }}
          >
            Unisciti
          </Button>
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
                    Kriegspiel
                  </b>{" "}
                  è una variante del gioco degli scacchi, in cui i pezzi del nemico sono invisibili,
                  
                  <br />
                  Il resto del gioco funziona quasi nello stesso modo degli
                  scacchi normali, l'unica eccezione è che oltre ai 2 giocatori,
                  c'è un terzo giocate o computer che lavora come "umpire", o arbitro.
                  L'arbitro ha il compito di controllare che le mosse siano valide e di
                  comunicare ai giocatori vari eventi.
                  Gli eventi che l'arbitro comunica sono:
                  <ul style={{ margin: "0px", paddingLeft: "20px" }}>
                    <li>
                      White [or Black] to move.
                    </li>
                    <li>
                      Pawn gone on *square*
                    </li>
                    <li>
                    Piece gone on *square*
                    </li>
                    <li>
                      No/Hell no - quando la mossa è illegale
                    </li>
                    <li>
                      Check on the vertical/horizontal/long diagonal/short diagonal/by a Knight
                    </li>
                    <li>
                      Checkmate
                    </li>
                  </ul>
                  <br />
                  Il giocatore può inoltre chiedere all'arbitro, premendo il tasto "Any?"
                  se è possibile una cattura col Pedone. L'arbitro rispondera con:
                  <ul>
                    <li>
                      "Try!" - se la cattura è possibile, in questo caso il giocatore
                      è obbligato a tentare la cattura. Se fallisce, è libero di muovere 
                      un altro pezzo.
                    </li>
                    <li>
                      "No!" - se la cattura non è possibile.
                    </li>
                    <li>
                      "Hell no!" - se non ci sono più pedoni del giocatore sulla scacchiera.
                    </li>
                  </ul>
                  Il gioco è stato ideato da Henry Michael Temple nel 1899, basandosi sull'originale
                  Kriegsspiel del 1812. Su Internet Chess Club, è chiamato Wild 16.
                </Typography>
              </AccordionDetails>
            </Accordion>
            </div>
    </Box>
  )}
  </>)
     
}

export default KriegspielSelection;