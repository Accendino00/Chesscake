import { Box, Tab, Typography } from '@mui/material';
import React from 'react';


function JoinGameComponent() {
    return (
        

        <Box style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
        }}>
            <TextField label="ex:./${gameId}" variant="outlined" />
            <Button variant="contained" color="primary">
                Join Game
            </Button>
            <Typography variant="h5">
                Choose a game to join
            </Typography>
            <Box>
                //diplay the game array using a list of cliccable tabs, the tab name is the gameId
                <Tab label="GameId" />

            </Box>
        </Box>
    );
}

export default JoinGameComponent;