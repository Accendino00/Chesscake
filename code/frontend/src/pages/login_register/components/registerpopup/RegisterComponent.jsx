import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, IconButton, Paper } from '@mui/material';
import styles from './RegisterStyles'; // Register styles
import CloseIcon from '@mui/icons-material/Close'; // Close icon
import { formFields, formTitle } from './RegisterConfig'; // IRegister configurations
import PasswordField from '../fields/PasswordField'; // Password field
import UsernameField from '../fields/UsernameField'; // Username field
import ConfirmPasswordField from '../fields/ConfirmPasswordField'; // Confirm password field
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Per il popup che indica una registrazione avvenuta con successo
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function RegisterComponent(props) {
  const [username, setUsername] = useState(''); // Username state
  const [password, setPassword] = useState(''); // Password state
  const [confirmedPassword, setConfirmedPassword] = useState(''); // Confirmed password state
  const [passwordsMatch, setPasswordsMatch] = useState(0); // 0 no password, 1 passwords match, -1 passwords don't match
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState("Credenziali sbagliate"); // Error message state

  const [errorRegistration, setErrorRegistration] = useState(false); // Error registration state

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorRegistration(false);
  };

  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        // Se la registrazione è aperta, allora non faccio nulla
        if (!props.trigge) return;
        else handleSubmit();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [username, password,  props.trigger]);

  // Handle form submission
  const handleSubmit = async (e) => {
    if(e)
      e.preventDefault(); // Prevent default form submission

    setErrorRegistration(false);
    setLoading(true);

    // Check if passwords match
    if (password !== confirmedPassword) {
      setPasswordsMatch(-1);
      setLoading(false);
      setErrorMessage("Le password non corrispondono")
      setErrorRegistration(true);
      return;
    }


    let formData = {
      username: username,
      password: password,
    }

    try {
      // Send HTTP request
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Parse JSON response
      const data = await response.json();


      // Se i dati sono un json del tipo {"successo" : true},
      // allora chiudo il popup della registrazione
      if (data.success) {
        props.setTrigger(false);
        props.setOpenRegisterSuccess(true);
        setLoading(false);
      } else {
        setErrorMessage("L'utente esiste già o le credenziali contengono caratteri non validi")
        setErrorRegistration(true);
        setLoading(false);
      }
    } catch (error) {
      // Handle errors
      setErrorMessage("Problemi con il server, riprova più tardi")
      setErrorRegistration(true);
      setLoading(false);
    }
  };

  return (props.trigger) ? (
    <Container maxWidth='false' sx={styles.background} >
      <Snackbar open={errorRegistration} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '300px' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Paper elevation={10} sx={styles.paper} >
        <Grid container sx={styles.grid} spacing={2}>
          {/* Many Grid items which have the various field components in them */}
          <Grid item xs={12}>
            <IconButton onClick={() => props.setTrigger(false)} sx={styles.closeButton}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography component="h1" variant="h5">
              {formTitle.register}
            </Typography>
          </Grid>
          <Grid item>
            <UsernameField
              {...formFields.username}
              username={username}
              setUsername={setUsername}
              error={errorRegistration}
            />
          </Grid>
          <Grid item>
            <PasswordField
              {...formFields.password}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmedPassword}
              setPasswordsMatch={setPasswordsMatch}
              error={errorRegistration}
            />
          </Grid>
          <Grid item>
            <ConfirmPasswordField
              {...formFields.confirmPassword}
              confirmPassword={confirmedPassword}
              setConfirmPassword={setConfirmedPassword}
              setPasswordsMatch={setPasswordsMatch}
              passwordsMatch={passwordsMatch}
              password={password}
              error={errorRegistration}
            />
          </Grid>
          {
            loading ? (
              <Grid item>
                <CircularProgress />
              </Grid>
            ) : (
              <Grid item>
                <Button
                  type="submit"
                  fullWidth
                  onClick={handleSubmit}
                  variant="contained"
                  sx={styles.registerButton}
                >
                  Register
                </Button>
              </Grid>
            )
          }
        </Grid>
      </Paper>
    </Container>
  ) : "";
};

export default RegisterComponent;
