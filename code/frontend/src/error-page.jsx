import React from 'react';
import { useRouteError, useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error("ErrorPage caught an error: ", error);

  // Extracting message and statusText from the error object
  const errorMessage = error?.message || "Unknown error occurred.";
  const errorStatusText = error?.statusText || "No status text available.";

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Sorry, an unexpected error has occurred.
        </Typography>
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          <strong>Error Message:</strong> {errorMessage}
        </Typography>
        <Typography variant="body1" color="error">
          <strong>Status Text:</strong> {errorStatusText}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={() => navigate('/')} // Navigates back to the home page
        >
          Go Back Home
        </Button>
      </Paper>
    </Container>
  );
}
