import React from 'react';
import { TextField, Container, AppBar, Toolbar, Typography, Grid, Box } from '@mui/material';
import Login from '@mui/icons-material/Login';

import useStyles from './loginStyles';

export class LoginUI extends React.Component {
    render (props) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Login />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Login
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                <div>
                    <Container
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    >
                        <Grid>
                            <Grid item>
                                <TextField id="outlined-required" label="Username" variant="outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id="outlined-basic" label="Email" variant="outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id="outlined-basic" label="Password" variant="outlined"  type="password" />
                            </Grid>
                            <Grid item>
                                <TextField id="outlined-basic" label="Prova" variant="outlined" />
                            </Grid>
                        </Grid>
                    </Container>
                    <Button variant="contained">Login</Button>
                </div>
            </main>
        </Box>
        );
    }
}

export default LoginUI;

