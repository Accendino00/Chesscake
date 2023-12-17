import React from "react";
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
  import "./kriegspielAccordion.css";
  import CreateGameComponent from "../components/CreateGameComponent";
  import { useState } from "react";
  import Cookies from "js-cookie";

function KriegspielSelection() {
      // Cose utili
  const navigate = useNavigate();

  const location = useLocation();
  const [duration, setDuration] = useState(5);
  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };
  const isChildRoute = /^\/play\/kriegspiel\/.+/.test(location.pathname);

  const { loginStatus, isTokenLoading, username } = useTokenChecker();
  const [loading, setLoading] = useState(false);

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
    </Box>
  )}
  </>)
     
}

export default KriegspielSelection;