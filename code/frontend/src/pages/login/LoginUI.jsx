import React from 'react';
//import { TextField, Container, AppBar, Toolbar, Typography, Grid, Box } from '@mui/material';
//import Login from '@mui/icons-material/Login';
//import useStyles from './loginStyles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import LoginIcon from '@mui/icons-material/Login';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import createTheme from '@mui/material/styles/createTheme';	
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Link from '@mui/material/Link';
import styled from '@mui/material/styles/styled';
import Stack from '@mui/material/Stack';
import { ColorAnonimoButton } from './colors';
import { ColorLoginButton } from './colors';
import { ColorUsernameTextField } from './colors';
import { ColorPasswordTextField } from './colors';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function LoginUI() {

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    return (
            <Grid container
                sx={{ height: '100vh' }}
            >
                {/* Grid item a xs=6 per effettivamente prendere metà width della pagina */}
                <Grid item xs={6}
                    sx={{ 
                        backgroundImage: 'url(https://i.imgur.com/iz0ypgo.jpeg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center', 
                    }}
                >
                </Grid>
                {/* Grid item a xs=6 per effettivamente prendere metà width della pagina */}
                <Grid item 
                    xs={6}
                >
                        {/* Grid per il login */}
                        <Grid container
                            direction="column"
                            justifyContent = "center"
                            alignItems="center"
                            spacing={2}
                            sx={{ height: '100vh' }}
                        >
                            <Grid item>
                                <img src='https://i.imgur.com/9is4Ypk.png'></img>
                            </Grid>
                            <Grid item>
                                <ColorUsernameTextField required sx={{ width: '26ch' }} label="Username"  variant="filled" 
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                    ),
                                }}/>
                            </Grid>
                            <Grid item>
                            <ColorPasswordTextField
                                required
                                sx={{ width: '26ch' }}
                                label="Password"
                                variant="filled"
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    ),
                                }}
                                />
                            </Grid>
                            <Grid item>
                                <Grid container
                                    direction = "row"
                                    justifyContent = "center"
                                    alignItems = "center"
                                    spacing={2}
                                >
                                    <Grid item>
                                        <Link href="#" variant ="body2" component="button" color="#FFD700">Registrati</Link>
                                    </Grid>  
                                    <Grid item>
                                        <ColorLoginButton size="medium" variant="contained" endIcon={<LoginIcon />}>Login</ColorLoginButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <ColorAnonimoButton variant="outlined">Continua come anonimo</ColorAnonimoButton>
                            </Grid>
                        </Grid>
                </Grid>
            </Grid>
    );
}