// Replay.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import ChessGameStyles from "../chessboard/ChessGameStyles.jsx";
import { useNavigate } from "react-router-dom";

const Replay = ({ gameHistory = "" }) => {
  const navigate = useNavigate();

  const [fen, setFen] = useState("start");
  const [currentMove, setCurrentMove] = useState(0);
  const chess = new Chess();
  let isNextMoveAvailable = currentMove + 1 < gameHistory.length;
  let isPreviousMoveAvailable = currentMove - 1 >= 0;

  useEffect(() => {
    replayGame();
  }, []);

  const replayGame = () => {
    console.log("Rendering Replay component");
    // Set the current move to the first move
    setCurrentMove(0);
    const moves = gameHistory.split(" ").filter((move) => isNaN(move));
    moves.forEach((move) => {
      chess.move(move, { sloppy: true });
    });
    const newFen = chess.fen();
    setFen(newFen);
  };

  const loadGameState = (fen) => {
    setFen(fen);
    chess.load(fen);
  };

  const handleNextMove = () => {
    if (isNextMoveAvailable) {
      const newMove = currentMove + 1;
      setCurrentMove(newMove);
      const newFen = gameHistory[newMove];
      console.log(newFen); // log the new FEN string to the console
      loadGameState(newFen);
    }
  };

  const handlePreviousMove = () => {
    if (isPreviousMoveAvailable) {
      const newMove = currentMove - 1;
      setCurrentMove(newMove);
      const newFen = gameHistory[newMove];
      console.log(newFen); // log the new FEN string to the console
      loadGameState(newFen);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div style={ChessGameStyles.divChessBoard}>
        <Chessboard position={fen} boardOrientation="white" width={"50vh"} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handlePreviousMove}
          disabled={!isPreviousMoveAvailable}
        >
          Previous move
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "20px" }}
          onClick={handleNextMove}
          disabled={!isNextMoveAvailable}
        >
          Next move
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "20px" }}
          onClick={() => (navigate("/play/account"))}
        >
          Stop Replay
        </Button>
      </div>
    </div>
  );
};

export default Replay;
