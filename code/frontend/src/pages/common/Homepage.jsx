import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Grid, Container } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

function HomePage() {
    const navigate = useNavigate();

    const buttonStyle = {
        mb: 2,
        width: '250px',
        padding: '10px 15px',
        fontSize: '1rem',
    };

    return (
        <Container maxWidth="md" sx={{
            textAlign: 'center',
            height: '100vh',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }}>

            <Grid item xs={12} sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/icon@1x.png" alt="Chess Cake" style={{ maxWidth: '160px', height: 'auto', marginRight: '20px' }} />
                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                        Chess Cake
                    </Typography>
                </Box>
            </Grid>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    startIcon={<PlayCircleIcon />} // Add an icon to the button
                    variant="contained"
                    sx={buttonStyle}
                    onClick={() => navigate('/play/reallybadchess/')}>
                    Play <b style={{ marginLeft: "10px" }} >Really Bad Chess</b>
                </Button>
                <Button
                    variant="contained"
                    sx={buttonStyle}
                    onClick={() => navigate('/play/leaderboard/')}>
                    Leaderboard
                </Button>
            </Box>
        </Container>
    );
}

export default HomePage;
