import React from 'react';
import { Modal, Paper, TextField } from '@mui/material';
import FacebookButton from './FacebookButton';
import { Typography } from '@mui/material';

const SharePaper = ({ text, onClose }) => {
    return (
        <Modal sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 10px',
        }}
            open={true} onClose={onClose}>
            <Paper
                elevation={3}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    borderRadius: '20px',
                    p: 3,
                    m: 2,
                    maxWidth: '600px',
                    width: '100%',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Typography>{text}</Typography>
                <FacebookButton />
            </Paper>
        </Modal>
    );
};

export default SharePaper;