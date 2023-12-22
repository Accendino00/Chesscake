// Replay.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import ChessGameStyles from "../reallybadchess/ChessGameStyles.jsx";
import { useNavigate } from "react-router-dom";
let chess = new Chess();

const Replay = () => {
  const location = useLocation();
  const gameHistory = location.state.gameHistory;
  const initialState = location.state.initialState;
  const navigate = useNavigate();
  const [fen, setFen] = useState(initialState);
  const [currentMove, setCurrentMove] = useState(0);
  const currentPlayer = chess.turn();
  console.log(currentPlayer); // logs 'w' or 'b'
  console.log("currentMove: " + currentMove);
  let isNextMoveAvailable = currentMove + 1 <= gameHistory.length;
  let isPreviousMoveAvailable = currentMove - 1 >= 0;
  useEffect(() => {
    replayGame();
  }, []);
  
  const replayGame = () => {
    // Set the current move to the first move
    setCurrentMove(0);
    chess.load(fen);
  };

  const handleNextMove = () => {
    if (isNextMoveAvailable) {
      const newMove = currentMove;
      const sanMove = gameHistory[newMove];
      console.log(sanMove); // log the new SAN move to the console
      // Check if the move is valid
      const validMoves = chess.moves();
      console.log("sanMove: " + sanMove);
      console.log("validMoves: ", validMoves);
      console.log("fen: " + fen);
      console.log(chess.ascii());
      if (validMoves.includes(sanMove)) {
        chess.move(sanMove);
        setFen(chess.fen());
        setCurrentMove(newMove + 1);
      } else {
        console.error(`Invalid move: ${sanMove}`);
      }
    }
  };

  const handlePreviousMove = () => {
    if (currentMove > 0) {
      chess.undo();
      setFen(chess.fen());
      setCurrentMove(currentMove - 1);
    } else {
      console.error("No previous move to undo");
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
        <Chessboard position={fen} width={"50vh"} draggable={false} />
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
