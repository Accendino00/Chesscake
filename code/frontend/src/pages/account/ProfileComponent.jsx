import React from "react";
import {
  Box,
  Skeleton,
  Avatar,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import styles from "./AccountPageStyles";

import { VisibilityOff } from "@mui/icons-material/";
import {
  PlayerVsPlayerIcon,
  PlayerVsComputerIcon,
  DailyChallengeIcon,
} from "../../utils/ModeIcons.jsx";
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

function ProfileComponent({ username }) {
  const navigate = useNavigate();

  // Andiamo a fare una fetch dei dati dell'account dell'utente
  // per poterli mostrare nella pagina.
  // Fino a quando la fetch non ritorna i dati, mostriamo uno skeleton.

  const [accountData, setAccountData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [accountFound, setAccountFound] = React.useState(false);

  let token = Cookies.get("token");

  React.useEffect(() => {
    // Se c'è un username specificato, allora lo inserisco nel header della richiesta
    if (username) {
      fetch("/api/account/getAccountData/" + username, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            data.accountData.color = uniqueColorUsername(
              data.accountData.username
            );
            setAccountData(data.accountData);
            setAccountFound(true);
          }
          setIsLoading(false);
        });
      return;
    }
      fetch("/api/account/getAccountData", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            data.accountData.color = uniqueColorUsername(
              data.accountData.username
            );
            setAccountData(data.accountData);
            setAccountFound(true);
          } else {
            navigate("/play/");
          }
          setIsLoading(false);
        });
  }, []);

  if (isLoading) {
    // Placeholder
    return (
      <Box sx={styles.BoxGeneral}>
        <Skeleton variant="circular" width={200} height={200} />
        <Box sx={styles.SkeletonStyle}>
          <Skeleton variant="text" width={200} height={50} />
          <Skeleton variant="text" width={200} height={50} />
          <Skeleton variant="text" width={70} height={50} />
          <Skeleton variant="text" width={70} height={50} />
          <Skeleton variant="text" width={200} height={50} />
        </Box>
      </Box>
    );
  }

  if (!accountFound) {
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
            width: "50vh",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.35)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            height: "20vh",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ color: "black", fontWeight: "bolder" }}
            >
              Account non trovato
            </Typography>
            <Typography sx={{ color: "black", fontWeight: "thin" }}>
              L'account che stavi cercando non è stato trovato!
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/play/")}
          >
            Torna all'home page{" "}
          </Button>
        </Box>
      </Box>
    );
  }

  function uniqueColorUsername(username) {
    // Convert the string to a hash
    function hashString(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    }

    // Convert hash to a color
    function hashToColor(hash) {
      const hue = Math.abs(hash % 360); // Use modulo to get value in [0, 360)
      const saturation = 50; // Set saturation to 50%
      const lightness = 70; // Set lightness to 70% for a light color
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    return hashToColor(hashString(username));
  }

  // Real profile info:
  return (
    <Box sx={styles.BoxGeneral}>
      <Avatar
        sx={{
          bgcolor: accountData.color,
          width: "200px",
          height: "200px",
          fontSize: "4.5em",
        }}
      >
        {accountData.username[0] +
          accountData.username[1] +
          accountData.username[2]}
      </Avatar>
      <Box sx={styles.ProfileStyle}>
        {/* Parte dedicata all'username: in alto (e a sinistra) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "nowrap",
            width: "100%",
            paddingLeft: "60px",
            paddingBottom: "10px",
          }}
        >
          <Typography
            sx={{
              fontWeight: "thin",
              fontSize: "0.7em",
              marginBottom: "-7px",
              marginLeft: "5px",
            }}
          >
            Pagina del profilo di
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", fontSize: "2.5em" }}
          >
            {accountData.username}
          </Typography>
        </Box>
        {/* Parte dedicata ai traguardi nelle partite: in basso */}
        <Box
          component="fieldset"
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            top: "20px",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            padding: "0px",
            borderRadius: "10px",
          }}
        >
          <legend
            style={{
              fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
              fontSize: "0.8em",
            }}
          >
            Statistiche del giocatore
          </legend>
          {/* Porzione dedicata al PvP */}
          <Box
            sx={{
              padding: "10px",
              width: "33%",
            }}
          >
            {/* Parte del titolo */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              <PlayerVsPlayerIcon />
              {/* Ci scrivo il nome della categoria */}
              <Typography sx={{ fontSize: "0.8em", fontWeight: "bold" }}>
                Player vs Player
              </Typography>
            </Box>
            <Divider />
            {/* Viene scritto l'ELO */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "2px",
              }}
            >
              <Typography sx={{ fontSize: "0.8em" }}>
                <b>ELO</b>
              </Typography>
              <Typography sx={{ fontSize: "0.8em" }}>
                {accountData.elo}
              </Typography>
            </Box>
            <Divider />
            {/* Viene scritto il winrate in percentuale */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "2px",
              }}
            >
              <Typography sx={{ fontSize: "0.8em" }}>
                <b>Winrate</b>
              </Typography>
              <Typography sx={{ fontSize: "0.8em" }}>
                {Math.round(accountData.winrate * 100)}%
              </Typography>
            </Box>
          </Box>
          <Divider orientation="vertical" flexItem />
          {/* Porzione dedicata al Ranked */}
          <Box
            sx={{
              padding: "10px",
              width: "33%",
            }}
          >
            {/* Parte del titolo */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              <PlayerVsComputerIcon />
              {/* Ci scrivo il nome della categoria */}
              <Typography sx={{ fontSize: "0.8em", fontWeight: "bold" }}>
                Ranked
              </Typography>
            </Box>
            <Divider />
            {/* Viene scritto il rank massimo */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "2px",
              }}
            >
              <Typography sx={{ fontSize: "0.8em" }}>
                <b>Rank massimo</b>
              </Typography>
              <Typography sx={{ fontSize: "0.8em" }}>
                {accountData.maxRank}
              </Typography>
            </Box>
            <Divider />
            {/* Viene scritto il winrate in percentuale */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "2px",
              }}
            >
              <Typography sx={{ fontSize: "0.8em" }}>
                <b>Rank attuale</b>
              </Typography>
              <Typography sx={{ fontSize: "0.8em" }}>
                {accountData.currentRank}
              </Typography>
            </Box>
          </Box>
          <Divider orientation="vertical" flexItem />
          {/* Porzione dedicata alla Daily Challenge */}
          <Box
            sx={{
              padding: "10px",
              width: "34%",
            }}
          >
            {/* Parte del titolo */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              <DailyChallengeIcon />
              {/* Ci scrivo il nome della categoria */}
              <Typography sx={{ fontSize: "0.8em", fontWeight: "bold" }}>
                Daily Challenge
              </Typography>
            </Box>
            <Divider />
            {/* Viene scritto l'ELO */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "2px",
              }}
            >
              <Typography sx={{ fontSize: "0.8em" }}>
                <b>Daily attuale</b>
              </Typography>
              <Typography sx={{ fontSize: "0.8em" }}>
                {accountData.currentDailyRecord
                  ? accountData.currentDailyRecord
                  : "Nessuna"}
              </Typography>
            </Box>
            <Divider />
            {/* Viene scritto il winrate in percentuale */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "2px",
              }}
            >
              <Typography sx={{ fontSize: "0.8em" }}>
                <b>Daily migliore</b>
              </Typography>
              <Typography sx={{ fontSize: "0.8em" }}>
                {accountData.maxDailyRecord
                  ? accountData.maxDailyRecord
                  : "Nessuna"}
              </Typography>
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem />
          {/* Porzione dedicata al Kriegspiel */}
          <Box
            sx={{
              padding: "10px",
              width: "34%",
            }}
          >
            {/* Parte del titolo */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              <VisibilityOff
                style={{
                  width: "24px",
                  height: "24px",
                  marginTop: "8px",
                  marginBottom: "8px",
                }}
              />
              {/* Ci scrivo il nome della categoria */}
              <Typography sx={{ fontSize: "0.8em", fontWeight: "bold" }}>
                Kriegspiel
              </Typography>
            </Box>
            <Divider />
            {/* Viene scritto l'ELO */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "2px",
              }}
            >
              <Typography sx={{ fontSize: "0.8em" }}>
                <b>Elo</b>
              </Typography>
              <Typography sx={{ fontSize: "0.8em" }}>
                {accountData.kriELO}
              </Typography>
            </Box>
            <Divider />
            {/* Viene scritto il winrate in percentuale */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "2px",
              }}
            >
              <Typography sx={{ fontSize: "0.8em" }}>
                <b>Winrate</b>
              </Typography>
              <Typography sx={{ fontSize: "0.8em" }}>
                {Math.round(accountData.kriWinrate * 100)}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProfileComponent;
