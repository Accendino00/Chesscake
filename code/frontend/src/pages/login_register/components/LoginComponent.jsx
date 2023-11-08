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

function LoginComponent(props) {
  const [buttonPopup, setButtonPopup] = React.useState(false);

  // States for each form input
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name: " + name + " value: " + value + "");
    // log the e
    console.log(e.target);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmitLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    console.log(formData)

    try {
      // Send HTTP request
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Parse JSON response
      const data = await response.json();

      // Handle data
      console.log(data);
    } catch (error) {
      // Handle errors
      console.error('There was an error!', error);
      console.log(error.status);
    }
  };

  return (props.trigger) ? (
    <Grid container sx={styles.grid} spacing={2}>
      <Grid item>
        <img src='https://i.imgur.com/9is4Ypk.png'></img>
      </Grid>

      <Grid item>
        <UsernameField
          {...formFields.username}
          handleChangeData={handleChange}
        />
      </Grid>
      <Grid item>
        <PasswordField
          {...formFields.password}
          handleChangeData={handleChange}
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
              setTrigger={setButtonPopup}>
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
