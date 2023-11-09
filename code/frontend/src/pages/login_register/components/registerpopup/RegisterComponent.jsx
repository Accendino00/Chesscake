import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, IconButton, Paper } from '@mui/material';
import styles from './RegisterStyles'; // Register styles
import CloseIcon from '@mui/icons-material/Close'; // Close icon
import { formFields, formTitle } from './RegisterConfig'; // IRegister configurations
import PasswordField from '../fields/PasswordField'; // Password field
import UsernameField from '../fields/UsernameField'; // Username field
import ConfirmPasswordField from '../fields/ConfirmPasswordField'; // Confirm password field
import Grid from '@mui/material/Grid';

function RegisterComponent(props) {
  // States for each form input
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Handle form field changes
  const handleChange = (e) => {
    console.log(e.target);
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
    <Container maxWidth='false' sx={styles.background} >
      <Paper elevation={10} sx={styles.paper} >
          <Grid container onSubmit={handleSubmit} noValidate sx={styles.grid} spacing={2}>
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
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <PasswordField
                {...formFields.password}
                value={formData.password}
                formData={formData}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item>
              <ConfirmPasswordField
                {...formFields.confirmPassword}
                value={formData.confirmPassword}
                formData={formData}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={styles.registerButton}
              >
                Register
              </Button>
            </Grid>
          </Grid>
      </Paper>
    </Container>
  ) : "";
};

export default RegisterComponent;
