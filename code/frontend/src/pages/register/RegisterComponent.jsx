import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, IconButton, Paper } from '@mui/material';
import styles from './RegisterStyles'; // Register styles
import CloseIcon from '@mui/icons-material/Close'; // Close icon
import { formFields, formTitle } from './RegisterConfig'; // IRegister configurations

function RegisterComponent(props) {
    // States for each form input
    const [formData, setFormData] = useState({
      username: '',
      email: '',
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
    <Container
    maxWidth = 'false'
    sx={styles.background}
    >
    <Paper
      elevation = {10} sx={styles.paper}
    >
    <Container component="main" maxWidth="xs" position="relative">
      <IconButton sx={styles.closeButton} onClick={() => props.setTrigger(false)}> <CloseIcon /> </IconButton>
      <Box sx={styles.container}>
        <Typography component="h1" variant="h5">
          {formTitle.register}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={styles.form}>
          <TextField
            sx = {styles.textField}
            helperText={styles.usernameHelperText}
            {...formFields.username}
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            sx = {styles.textField}
            helperText={styles.emailHelperText}
            {...formFields.email}
            value={formData.email}
            onChange={handleChange}
        />
          <TextField
            sx = {styles.textField}
            helperText={styles.passwordHelperText}
            {...formFields.password}
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.registerButton}
          >
            Registrati
          </Button>
        </Box>
      </Box>
    </Container>
    </Paper>
  </Container>
  ) : "";
};

export default RegisterComponent;
