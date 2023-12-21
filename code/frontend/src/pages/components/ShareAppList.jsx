import React, { useEffect } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  XIcon,
  RedditShareButton,
} from "react-share";
import { Button, Box } from "@mui/material/";
import { Facebook, Reddit } from "@mui/icons-material/";

const ShareAppList = ({ sharedText, url }) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <FacebookShareButton
        url={url}
        hashtag="#chesscake"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: "8px",
          width: "130px",
          backgroundColor: "#3b5998",
          color: "#fff",
          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          borderRadius: "10px",
          fontSize: "0.875rem",
        }}
      >
        <Facebook />
        Condividi
      </FacebookShareButton>
      <TwitterShareButton
        url={url}
        title={sharedText}
        hashtags={["chesscake", "veryfun"]}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: "8px",
          width: "130px",
          backgroundColor: "#000000",
          color: "#fff",
          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          borderRadius: "10px",
          fontSize: "0.875rem",
        }}
      >
        <XIcon
          style={{
            width: "24px",
            height: "24px",
          }}
        />
        Condividi
      </TwitterShareButton>
      <RedditShareButton
        url={url}
        title={sharedText}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: "8px",
          width: "130px",
          backgroundColor: "#ff4500",
          color: "#fff",
          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          borderRadius: "10px",
          fontSize: "0.875rem",
        }}
      >
        <Reddit
          style={{
            width: "24px",
            height: "24px",
          }}
        />
        Condividi
      </RedditShareButton>
    </Box>
  );
};

export default ShareAppList;
