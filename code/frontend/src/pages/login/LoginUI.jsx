import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export class LoginUI extends React.Component {
    render (props) {
        return (
            <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            >
                <TextField id="outlined-required" label="Username" variant="outlined" />
                <TextField id="outlined-basic" label="Email" variant="outlined" type="password" />
                <TextField id="outlined-basic" label="Password" variant="outlined" />
                <TextField id="outlined-basic" label="Prova" variant="outlined" />
            </Box>
        );
    }
}

export default LoginUI;