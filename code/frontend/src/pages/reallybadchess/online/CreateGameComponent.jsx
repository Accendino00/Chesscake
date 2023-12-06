import { Box, Tab, Typography } from '@mui/material';
import { Paper } from '@mui/material';
import React from 'react';
import ChessGameStyles from '../ChessGameStyles';
import { Button, ButtonGroup } from '@mui/material';


// TODO nome della lobby

function CreateGameComponent() {
    
    const [side, setSide] = React.useState('w'); // 'w' or 'b'

    
    return (
        <Box sx={ChessGameStyles.everythingContainer}>
            <Paper elevation={3} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                borderRadius: '20px',
                p: 3,
                m: 2,
                maxWidth: '600px',
                width: '100%',
                backdropFilter: 'blur(10px)'
            }}>
                <Typography variant="h5">Create a new game!</Typography>
                
            </Paper>
        </Box>
    );
}

export default CreateGameComponent;