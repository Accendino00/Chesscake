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

function registerButtonCallback () {
    //  richiesta http a /api/register
    //  se la risposta è positiva, reindirizza a /login

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;

    let data = {
        username: username,
        password: password,
        email: email
    }

    fetch('/register/newuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(function (data, err) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            // passa a login
            window.location.href = '/login';
        }
    })
}

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
