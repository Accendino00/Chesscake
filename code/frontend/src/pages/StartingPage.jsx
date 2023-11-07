import React from 'react';
import { Container, Grid } from '@mui/material';
import styles from './StartingPageStyles';
import LoginComponent from './login/LoginComponent';

export default function StartingPage() {

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