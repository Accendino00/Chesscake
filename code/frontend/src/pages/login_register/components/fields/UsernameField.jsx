import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import styles from '../LoginStyles';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function UsernameField({handleChangeData})  {
    return (
        <TextField
            sx = {styles.usernameTextField}
            variant="filled"
            label="Username"
            type="text"
            name="username"
            onChange={handleChangeData}
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