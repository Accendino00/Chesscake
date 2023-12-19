import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styles from '../LoginStyles';

export default function PasswordField({password, setPassword, error, confirmPassword, setPasswordsMatch})  {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
      <TextField
        labelId="passwordRegisterField"
        sx = {styles.passwordTextField}
        variant="filled"
        error={error}
        value={password}
        label="Password"
        name="password"
        onChange={(e) => {
          setPassword(e.target.value)

          // Controllo se confirmpassword è definito:
          if (confirmPassword != undefined) {
            if (e.target.value == confirmPassword) {
              setPasswordsMatch(1);
            }
            else {
              setPasswordsMatch(-1);
            }
          }
        }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={togglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
  );
};