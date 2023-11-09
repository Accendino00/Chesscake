import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';
import styles from './LoginStyles'; // Import styles
import LoginIcon from '@mui/icons-material/Login'; // Import login icon
import { formFields, formTitle } from './LoginConfig'; // Import configurations
import PasswordField from './fields/PasswordField'; // Import password field
import UsernameField from './fields/UsernameField'; // Import username field
import RegisterComponent from './registerpopup/RegisterComponent';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Per il popup che indica una registrazione avvenuta con successo
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function LoginComponent(props) {
  const [username, setUsername] = useState(''); // Username state
  const [password, setPassword] = useState(''); // Password state
  const [buttonPopup, setButtonPopup] = React.useState(false);

  const [openRegisterSuccess, setOpenRegisterSuccess] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenRegisterSuccess(false);
  };

  // Handle form submission
  const handleSubmitLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    let formData = {
      username: username,
      password: password,
    }
    
    try {
      // Send HTTP request
      const response = await fetch('http://localhost:8000/api/login', {
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
      // allora passa a "/"
      if (data.successo) {
        window.location.pathname = "/";
      }
    } catch (error) {
      // Handle errors
      console.error('There was an error!', error);
      console.log(error.status);
    }
  };

  return (props.trigger) ? (
    <Grid container sx={styles.grid} spacing={2}>
      
      <Snackbar open={openRegisterSuccess} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '200px' }}>
          Registrazione ha avuto successo
        </Alert>
      </Snackbar>

      <Grid item>
        <img src='https://i.imgur.com/9is4Ypk.png'></img>
      </Grid>

      <Grid item>
        <UsernameField
          {...formFields.username}
          username={username}
          setUsername={setUsername}
        />
      </Grid>
      <Grid item>
        <PasswordField
          {...formFields.password}
          password={password}
          setPassword={setPassword}
        />
      </Grid>
      <Grid item>
        <Grid container
          direction="row"
          spacing={2}
          sx={styles.gridButtons}
        >
          <Grid item>
            <Link
              sx={styles.registerButton}
              variant="body2"
              component="button"
              onClick={(() => setButtonPopup(true))}
            >
              Registrati
            </Link>
            <RegisterComponent
              trigger={buttonPopup}
              setTrigger={setButtonPopup}
              setOpenRegisterSuccess={setOpenRegisterSuccess}
              >
            </RegisterComponent>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              fullWidth
              onClick={handleSubmitLogin}
              variant="contained"
              endIcon={<LoginIcon />}
              sx={styles.loginButton}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Button
          type="submit"
          variant="outlined"
          sx={styles.anonimoButton}
        >
          Continua come anonimo
        </Button>
      </Grid>
    </Grid>

  ) : "";
};

export default LoginComponent;
