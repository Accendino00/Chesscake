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

export default function StartingPage() {

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
                        <LoginComponent />
                </Grid>
            </Grid>
    );
}