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
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from 'js-cookie';


// Per il popup che indica una registrazione avvenuta con successo
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function LoginComponent(props) {
  const [username, setUsername] = useState(''); // Username state
  const [password, setPassword] = useState(''); // Password state
  const [buttonPopup, setButtonPopup] = React.useState(false);

  const [openRegisterSuccess, setOpenRegisterSuccess] = React.useState(false);
  const [openLoginError, setOpenLoginError] = React.useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const handleCloseLogin = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenLoginError(false);
  };

  const handleCloseRegister = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenRegisterSuccess(false);
  };

  // Handle form submission
  const handleSubmitLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setLoading(true);
    setOpenLoginError(false);

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
      if (data.success) {
        var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
        Cookies.set('token', data.token, { expires: inFifteenMinutes }); // Expires in 7 days

        setLoading(false);
        window.location.pathname = "/reallybadchess";
      } else {
        setOpenLoginError(true);
        setLoading(false);
      }
    } catch (error) {
      // Handle errors
      console.error('There was an error!', error);
      console.log(error.status);

      setOpenLoginError(true);
      setLoading(false);
    }
  };

  return (props.trigger) ? (
    <Grid container sx={styles.grid} spacing={2}>

      <Snackbar open={openRegisterSuccess} autoHideDuration={4000} onClose={handleCloseRegister} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseRegister} severity="success" sx={{ width: '300px' }}>
          Registrazione ha avuto successo
        </Alert>
      </Snackbar>

      <Snackbar open={openLoginError} autoHideDuration={4000} onClose={handleCloseLogin} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseLogin} severity="error" sx={{ width: '300px' }}>
          Credenziali errate o problemi con il server
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
          error={openLoginError}
        />
      </Grid>
      <Grid item>
        <PasswordField
          {...formFields.password}
          password={password}
          setPassword={setPassword}
          error={openLoginError}
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
                  onClick={handleSubmitLogin}
                  variant="contained"
                  endIcon={<LoginIcon />}
                  sx={styles.loginButton}
                >
                  Login
                </Button>
              </Grid>
            )
          }
        </Grid>
      </Grid>
      <Grid item>
        <Button
          type="submit"
          variant="outlined"
          sx={styles.anonimoButton}
          onClick={() => window.location.pathname = "/reallybadchess"}
        >
          Continua come anonimo
        </Button>
      </Grid>
    </Grid>

  ) : "";
};

export default LoginComponent;
