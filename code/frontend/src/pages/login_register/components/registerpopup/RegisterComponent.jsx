import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, IconButton, Paper } from '@mui/material';
import styles from './RegisterStyles'; // Register styles
import CloseIcon from '@mui/icons-material/Close'; // Close icon
import { formFields, formTitle } from './RegisterConfig'; // IRegister configurations
import PasswordField from '../fields/PasswordField'; // Password field
import UsernameField from '../fields/UsernameField'; // Username field
import ConfirmPasswordField from '../fields/ConfirmPasswordField'; // Confirm password field
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';


function RegisterComponent(props) {
  const [username, setUsername] = useState(''); // Username state
  const [password, setPassword] = useState(''); // Password state
  const [confirmedPassword, setConfirmedPassword] = useState(''); // Confirmed password state
  const [loading, setLoading] = useState(false); // Loading state

  const [errorRegistration, setErrorRegistration] = useState(false); // Error registration state

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setErrorRegistration(false);
    setLoading(true);

    let formData = {
      username: username,
      password: password,
    }

    console.log(formData);

    try {
      // Send HTTP request
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Parse JSON response
      const data = await response.json();

      // Log data
      console.log(data);


      // Se i dati sono un json del tipo {"successo" : true},
      // allora chiudo il popup della registrazione
      if (data.success) {
        props.setTrigger(false);
        props.setOpenRegisterSuccess(true);
        setLoading(false);
      } else {
        setErrorRegistration(true);
        setLoading(false);
      }
    } catch (error) {
      // Handle errors
      console.error('There was an error!', error);
      console.log(error.status);

      setErrorRegistration(true);
      setLoading(false);
    }
  };

  return (props.trigger) ? (
    <Container maxWidth='false' sx={styles.background} >
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
              error={errorRegistration}
            />
          </Grid>
          <Grid item>
            <ConfirmPasswordField
              {...formFields.confirmPassword}
              confirmPassword={confirmedPassword}
              setConfirmPassword={setConfirmedPassword}
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
