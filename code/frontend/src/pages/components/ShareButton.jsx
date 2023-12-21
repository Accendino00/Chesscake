import React from "react";
import Button from "@mui/material/Button";
import { Share } from "@mui/icons-material/";
import SharePaper from "./SharePaper";

export default function ShareButton({ text, style, disabled, url }) {
  const handleShare = () => {
    // Open the modal by setting the state in the parent component
    setModalIsOpen(true);
  };

  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="contained"
        onClick={handleShare}
        style={style}
        disabled={disabled}
      >
        <Share />
      </Button>
      {/* Render the SharePaper component conditionally based on modalIsOpen */}
      {modalIsOpen && (
        <SharePaper url={url ? url : "https://site222341.cs.unibo.it/"} text={text} onClose={() => setModalIsOpen(false)} />
      )}
    </>
  );
}
