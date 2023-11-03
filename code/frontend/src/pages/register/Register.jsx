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
import createTheme from '@mui/material/styles/createTheme';	
import ThemeProvider from '@mui/material/styles/ThemeProvider';
  

export default function Register() {
    return (
            // Grid generale per la pagina di login
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
                </Grid>
            </Grid>
    );
}
