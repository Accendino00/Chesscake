import React from 'react';
//import { TextField, Container, AppBar, Toolbar, Typography, Grid, Box } from '@mui/material';
//import Login from '@mui/icons-material/Login';
//import useStyles from './loginStyles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Login from '@mui/icons-material/Login';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export default function LoginUI() {
    return (
        <div>
            <Container
            component="form"
            maxwidth="xl"
            margin="50px"  
            >
                <Grid direction="column" alignItems="flex-end" spacing="1">
                    <Grid>
                        <TextField required label="Username" variant="outlined" />
                    </Grid>
                    <Grid>
                        <TextField required label="Password" variant="outlined"  type="password" />
                    </Grid>
                </Grid>
            </Container>
            <Button variant="contained">Login</Button>
        </div>
    );
}


/*

*/