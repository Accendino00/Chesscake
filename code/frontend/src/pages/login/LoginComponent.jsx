import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';
import styles from './LoginStyles'; // Import styles
import LoginIcon from '@mui/icons-material/Login'; // Import login icon
import { formFields, formTitle } from './LoginConfig'; // Import configurations
import PasswordField from './PasswordField'; // Import password field
import UsernameField from './UsernameField'; // Import username field
import RegisterComponent from '../register/RegisterComponent';
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
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission
  
      try {
        // Send HTTP request
        const response = await fetch('./', {
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
      <Grid container onSubmit={handleSubmit} noValidate sx={styles.grid} spacing={2}>
        <Typography component="h1" variant="h5">
          {formTitle.login}
        </Typography>
        <Grid item>
          <UsernameField
            {...formFields.username}
            value={formData.username}
            onChange={handleChange}
          />
        </Grid>
        <Grid item>
          <PasswordField
            {...formFields.password}
            value={formData.password}
            onChange={handleChange}
            formData={formData}
            handleChange={handleChange}
          />
        </Grid>
        <Grid item>
          <PasswordField
            {...formFields.confirmpassword}
            value={formData.confirmpassword}
            onChange={handleChange}
            formData={formData}
            handleChange={handleChange}
          /> 
          </Grid>
          <Grid item>
            <Grid container
              direction = "row"
              spacing={2}
              sx={styles.gridButtons}
            >
              <Grid item>
                  <Link 
                    sx = {styles.registerButton}
                    variant ="body2" 
                    component="button" 
                    onClick={(()=> setButtonPopup(true))}
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
