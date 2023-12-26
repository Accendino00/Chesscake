import React from 'react';
import { Container, Grid } from '@mui/material';
import styles from './LoginPageStyles';
import LoginComponent from './components/LoginComponent';
import useTokenChecker from '../../utils/useTokenChecker.jsx';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';


export default function LoginPage() {  
    const { loginStatus, isTokenLoading} = useTokenChecker();
    const navigate = useNavigate();

    if (isTokenLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (loginStatus) {
        navigate("/play");
    }

    return (
        <Container 
            maxWidth = 'false'
            sx = {styles.container}
            >
            <Grid 
                container 
                sx={styles.grid}
                >
                <Grid 
                    item 
                    xs={6}
                    sx={styles.imageGrid}
                    >
                </Grid>
                <Grid 
                    item 
                    xs={6}
                    >
                    
                    <LoginComponent trigger="true"/>
                    
                </Grid>
            </Grid>
        </Container>
    );
}