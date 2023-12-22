import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";

import LeaderBoardRecord from "./LeaderBoardRecord.jsx";
import Skeleton from "@mui/material/Skeleton";
import Cookies from "js-cookie";

import ShareButton from "../components/ShareButton.jsx";

function RankLeaderBoard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  let token = Cookies.get("token");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      let response, data;
      if (token) {
        response = await fetch("/api/leaderboard/rank", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await fetch("/api/leaderboard/rank", {
          method: "GET",
        });
      }
      data = await response.json();
      setLeaderboardData(data);
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  return (
    <Box>
      {token ? (
        <Typography
          variant="h6"
          sx={{
            fontSize: "15px",
            fontWeight: "bold",
            color: "#1976d2",
            marginTop: "20px",
            marginBottom: "10px",
          }}
        >
          Classifica Generale
        </Typography>
      ) : (
        <Box sx={{ height: "15px" }} />
      )}

      {loading ? (
        <>
          <Skeleton
            variant="rounded"
            width={700}
            height={35}
            sx={{ margin: "4px" }}
          />
          <Skeleton
            variant="rounded"
            width={700}
            height={35}
            sx={{ margin: "4px" }}
          />
          <Skeleton
            variant="rounded"
            width={700}
            height={35}
            sx={{ margin: "4px" }}
          />
          <Skeleton
            variant="rounded"
            width={700}
            height={35}
            sx={{ margin: "4px" }}
          />
          <Skeleton
            variant="rounded"
            width={700}
            height={35}
            sx={{ margin: "4px" }}
          />
          <Skeleton
            variant="rounded"
            width={700}
            height={35}
            sx={{ margin: "4px" }}
          />
          <Skeleton
            variant="rounded"
            width={700}
            height={35}
            sx={{ margin: "4px" }}
          />
          <Skeleton
            variant="rounded"
            width={700}
            height={35}
            sx={{ margin: "4px" }}
          />
          <Skeleton
            variant="rounded"
            width={700}
            height={35}
            sx={{ margin: "4px" }}
          />
          <Skeleton
            variant="rounded"
            width={700}
            height={35}
            sx={{ margin: "4px" }}
          />
        </>
      ) : leaderboardData.leaderboard.length === 0 ? (
        <Typography
          variant="h6"
          sx={{
            fontSize: "15px",
            fontWeight: "bold",
            color: "#1976d2",
            marginTop: "20px",
            marginBottom: "10px",
          }}
        >
          Nessun record da mostrare
        </Typography>
      ) : (
        <>
          {leaderboardData.leaderboard.map((record, index, array) => {
            return (
              <React.Fragment key={"rank" + (index + 1)}>
                <LeaderBoardRecord
                  rank={index + 1}
                  username={record.username}
                  value={record.rank}
                />
                {array.length - 1 !== index && <Divider />}
              </React.Fragment>
            );
          })}
        </>
      )}

      {/* Se e solo se c'è il token, vado a renderizzare questa parte */}
      {token && (
        <>
          <Typography
            variant="h6"
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              color: "#1976d2",
              marginTop: "20px",
              marginBottom: "10px",
            }}
          >
            Il tuo profilo
            <ShareButton
              width="20px"
              height="20px"
              text={
                "Ho raggiunto " +
                (loading ? "" : leaderboardData.userPlace.elo) +
                " di rank su Really Bad Chess! Provalo anche tu sul sito di Chess Cake!"
              }
              style={{
                marginLeft: "10px",
                width: "30px",
                minWidth: "30px",
                height: "30px",
              }}
              disabled={loading}
            />
          </Typography>
          {loading ? (
            <Skeleton
              variant="rounded"
              width={700}
              height={35}
              sx={{ margin: "4px" }}
            />
          ) : (
            <LeaderBoardRecord
              rank={leaderboardData.userPlace.place}
              username={leaderboardData.userPlace.username}
              value={leaderboardData.userPlace.rank}
            />
          )}
        </>
      )}
    </Box>
  );
}

export default RankLeaderBoard;
