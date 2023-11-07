import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import styles from './LoginStyles'; // Import styles
import { formFields, buttonText, formTitle } from './LoginConfig'; // Import configurations

function LoginComponent() {
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
        save(data);
      } catch (error) {
        // Handle errors
        console.error('There was an error!', error);
        console.log(error.status);
      }
    };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={styles.container}>
        <Typography component="h1" variant="h5">
          {formTitle}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={styles.form}>
          <TextField
            {...formFields.username}
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            {...formFields.email}
            value={formData.email}
            onChange={handleChange}
        />
          <TextField
            {...formFields.password}
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.loginButton}
          >
            Login
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.anonimoButton}
            >
                Continua come anonimo
            </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
