import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import useTokenChecker from '../../utils/useTokenChecker.jsx';

function AccountPage() {
    const { loginStatus, isTokenLoading } = useTokenChecker();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isTokenLoading) {
            if (!loginStatus) {
                navigate("/login");
            }
        }
    }, [loginStatus, isTokenLoading]);

    if (isTokenLoading || loginStatus === undefined) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    // Renderizza nulla, perché il redirect viene fatto in useEffect
    return (
        <Box style={{
            textAlign: 'center',
            height: '100vh',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Box style={{
                borderRadius: '10px',
                padding: '20px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
                width: "600px",
            }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Account
                </Typography>
                {/* 
                    Ispirazione per il futuro: https://i.pinimg.com/550x/ab/1c/92/ab1c9284c62678597c58896294ea7d6d.jpg 
                    dove a destra ci sono i replay delle partite e magari degli accordio con altri dati in cima (tipo boh statistiche etc.)
                */}
            </Box>
        </Box>
    );
}

export default AccountPage;