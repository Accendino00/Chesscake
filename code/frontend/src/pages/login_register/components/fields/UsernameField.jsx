import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import styles from '../LoginStyles';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function UsernameField({username, setUsername, error})  {
    return (
        <TextField
            sx = {styles.usernameTextField}
            variant="filled"
            label="Username"
            error={error}
            value={username}
            type="text"
            autoComplete='username'
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <AccountCircle />
                    </InputAdornment>
                    ),
              }}
        />
    );
};