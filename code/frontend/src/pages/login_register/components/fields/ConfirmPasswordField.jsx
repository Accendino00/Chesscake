import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../LoginStyles';

export default function ConfirmPasswordField({error, password, confirmPassword, setConfirmPassword, passwordsMatch, setPasswordsMatch})  {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  function checkPasswordsMatch(e) {
    setConfirmPassword(e.target.value);
    if (e.target.value == password) {
      setPasswordsMatch(1);
    }
    else {
      setPasswordsMatch(-1);
    }
  }

  return (
      <TextField
        labelId="confirmPasswordRegisterField"
        sx = {styles.ConfirmPasswordTextField}
        error={passwordsMatch == -1 || error}
        variant="filled"
        value={confirmPassword}
        label="Confirm Password"
        name="confirmPassword"
        onChange={(checkPasswordsMatch)}
        type={showConfirmPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showConfirmPassword ? 'Hide Confirm Password' : 'Show Confirm Password'}
                onClick={toggleConfirmPasswordVisibility}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
  );
};