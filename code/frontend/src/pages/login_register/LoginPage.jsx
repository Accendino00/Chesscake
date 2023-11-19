import React from 'react';
import { Container, Grid } from '@mui/material';
import styles from './LoginPageStyles';
import LoginComponent from './components/LoginComponent';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export default function LoginPage() {

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