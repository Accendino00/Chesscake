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


const ColorLoginButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#000000',
    borderColor: '#000000',
    borderBlockColor: '#000000',
    '&:hover': {
        backgroundColor: '#000000',
        borderColor: '#000000',
        boxShadow: 'none',
        borderBlockColor: '#000000',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#000000',
        borderColor: '#000000',
        borderBlockColor: '#000000',
    },
});

const ColorAnonimoButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    color: '#000000',
    borderColor: '#000000',
    borderBlockColor: '#000000',
    '&:hover': {
        borderColor: '#000000',
        boxShadow: 'none',
        borderBlockColor: '#000000',
    },
    '&:active': {
        boxShadow: 'none',
        borderColor: '#000000',
        borderBlockColor: '#000000',
    },
});

const ColorUsernameTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#FFD700',
      },
      '& .MuiFilledInput-underline:after': {
        borderBottomColor: '#FFD700',
      },
      '& .MuiFilledInput-underline:before': {
        borderBottomColor: '#FFD700',
      },
});

const ColorPasswordTextField = styled(TextField)({
      '& label.Mui-focused': {
        color: '#FFD700',
      },
      '& .MuiFilledInput-underline:after': {
        borderBottomColor: '#FFD700',
      },
      '& .MuiFilledInput-underline:before': {
        borderBottomColor: '#FFD700',
      },
});

export { ColorLoginButton, ColorAnonimoButton, ColorUsernameTextField, ColorPasswordTextField };