import React from 'react';
import { Paper, Typography, Icon, Box } from '@mui/material';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

function Timer({ time, setTime, shouldRun, setHasEnded, playerColor }) {
    // Convert seconds to MM:SS format
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    React.useEffect(() => {
        if (shouldRun) {
            if (time > 0) {
                const timer = setTimeout(() => {
                    setTime(time - 1);
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                setHasEnded(true);
            }
        }
    }, [time, shouldRun, setTime, setHasEnded]);

    return (
        <Paper
            elevation={3}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 10px',
                margin: '10px',
                backgroundColor: playerColor,
                color: playerColor == 'white' ? 'black' : 'white',
                minWidth: '150px',
            }}
        >
            <Icon>
                {shouldRun ? <AccessAlarmsIcon /> : <PauseCircleOutlineIcon />}
            </Icon>
            <Typography variant="h5" component="div">
                {formatTime(time)}
            </Typography>
        </Paper>
    );
}

export default Timer;
