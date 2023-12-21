import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Grid, Container } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import InsertChartIcon from "@mui/icons-material/InsertChart";

import useTokenChecker from "../../utils/useTokenChecker.jsx";
import CircularProgress from "@mui/material/CircularProgress";

function HomePage() {
  const { loginStatus, isTokenLoading, username } = useTokenChecker();
  const navigate = useNavigate();

  const buttonStyle = {
    mb: 2,
    width: "90%",
    padding: "10px 15px",
    fontSize: "1rem",
  };
  
  if (isTokenLoading || loginStatus === undefined) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        style={{
          borderRadius: "10px",
          padding: "20px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
          width: "600px",
        }}
      >
        <Grid item xs={12} sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/icon@1x.png"
              alt="Chess Cake"
              style={{ maxWidth: "160px", height: "auto", marginRight: "20px" }}
            />
            <Typography variant="h2" sx={{ fontWeight: "bold" }}>
              Chess Cake
            </Typography>
          </Box>
        </Grid>

        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Parte dove descriviamo il nostro progetto */}
          <Typography
            style={{
              textAlign: "left",
              fontSize: "0.75rem",
              width: "45%",
              mb: 5,
            }}
            component={"span"}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {" "}
              Benvenuto su Chess Cake!{" "}
            </Typography>
            <b>Chess Cake</b> è una web application che permette di giocare
            scacchi non eterodossi.
            <br /> <br />
            Il sito è stato sviluppato per il corso di{" "}
            <i>Ingegneria del Software</i> dell'Università degli Studi di
            Bologna dal team T3 nell'AA 2023/2024.
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Button
              startIcon={<PlayCircleIcon />} // Add an icon to the button
              variant="contained"
              sx={buttonStyle}
              onClick={() => navigate("/play/reallybadchess/")}
            >
              Gioca <b style={{ marginLeft: "10px" }}>Really Bad Chess</b>
            </Button>
            { loginStatus && 
              <Button
                startIcon={<PlayCircleIcon />} // Add an icon to the button
                variant="contained"
                sx={buttonStyle}
                onClick={() => navigate("/play/kriegspiel/")}
              >
                Gioca <b style={{ marginLeft: "10px" }}>Kriegspiel</b>
              </Button>
            }
            <Button
              startIcon={<InsertChartIcon />} // Add an icon to the button
              variant="contained"
              sx={buttonStyle}
              onClick={() => navigate("/play/leaderboard/")}
            >
              Leaderboard
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default HomePage;
