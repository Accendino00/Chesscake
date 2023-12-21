import React from "react";
import { Modal, Paper, TextField } from "@mui/material";
import ShareAppList from "./ShareAppList";
import { Typography } from "@mui/material";

const SharePaper = ({ text, onClose, url }) => {
  return (
    <Modal
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 10px",
      }}
      open={true}
      onClose={onClose}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          borderRadius: "20px",
          p: 2,
          m: 2,
          width: "100%",
          backdropFilter: "blur(10px)",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          width: "550px",
          height: "350px",
        }}
      >
        <Typography
        sx={{
            p: 2,
            fontSize: "1.3rem",
            fontWeight: "bold",
            marginBottom: "10px"
        }}>
          Condividi i tuoi traguardi!
        </Typography>
        <fieldset
          style={{
            borderColor: "#80808038",
            borderRadius: "20px",
          }}
        >
          <legend
            style={{
              fontFamily: "Roboto, Helvetica, Arial, sans-serif",
              fontSize: "0.675rem",
              color: "#808080",
            }}
          >
            Messaggio che condividerai
          </legend>
          <Typography>{text}</Typography>
        </fieldset>
        <ShareAppList 
            sharedText={text}
            url={url}
        />
      </Paper>
    </Modal>
  );
};

export default SharePaper;
